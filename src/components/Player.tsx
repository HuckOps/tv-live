import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import Video from 'react-native-video';

import { SOURCE_LOAD_TIMEOUT } from '../utils/constants';
import { styles } from '../utils/styles';
import type { Channel, PlayerRef } from '../types';

// ============================================================
// Player
// 单个频道的视频播放器，支持多源故障切换。
// 纯展示组件，不负责 banner / UI 状态，
// 通过 onSourceChange 通知外部当前正在播放的源索引。
// ============================================================

interface PlayerProps {
  channel: Channel;
  onSourceChange?: (index: number, total: number) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export const Player = forwardRef<PlayerRef, PlayerProps>(
  ({ channel, onSourceChange, onLoadingChange }, ref) => {
    const videoRef = useRef<any>(null);

    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bandwidth, setBandwidth] = useState(0);

    // 内部状态 ref
    const currentIdxRef = useRef(0);
    const channelRef = useRef<Channel>(channel);
    const sourceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triedSourcesRef = useRef<Set<number>>(new Set());
    const switchingRef = useRef(false);
    const generationRef = useRef(0);
    const lastErrorTimeRef = useRef(0);

    useEffect(() => {
      channelRef.current = channel;
    }, [channel]);

    useEffect(() => {
      currentIdxRef.current = currentIdx;
    }, [currentIdx]);

    useEffect(() => {
      onSourceChange?.(currentIdx, channel.streams.length);
    }, [currentIdx, channel.streams.length, onSourceChange]);

    useEffect(() => {
      onLoadingChange?.(loading);
    }, [loading, onLoadingChange]);

    const clearSourceTimeout = useCallback(() => {
      if (sourceTimeoutRef.current !== null) {
        clearTimeout(sourceTimeoutRef.current);
        sourceTimeoutRef.current = null;
      }
    }, []);

    const getNextSourceIndex = useCallback(
      (failedIndex: number, total: number) => {
        if (total <= 0) {
          return -1;
        }

        for (let offset = 1; offset <= total; offset++) {
          const candidate = (failedIndex + offset) % total;

          if (!triedSourcesRef.current.has(candidate)) {
            return candidate;
          }
        }

        triedSourcesRef.current.clear();

        return (failedIndex + 1) % total;
      },
      [],
    );

    const switchToSource = useCallback(
      (nextIdx: number, reason: string) => {
        const total = channelRef.current.streams.length;

        if (total <= 0 || nextIdx < 0 || nextIdx >= total) {
          return;
        }

        clearSourceTimeout();
        generationRef.current += 1;
        switchingRef.current = true;
        currentIdxRef.current = nextIdx;
        setCurrentIdx(nextIdx);
        setLoading(true);
        setBandwidth(0);

        console.log(
          `[STREAM SWITCH] ${channelRef.current.name}: source ${
            nextIdx + 1
          }/${total}, reason=${reason}`,
        );

        setTimeout(() => {
          switchingRef.current = false;
        }, 150);
      },
      [clearSourceTimeout],
    );

    const manualSwitchSource = useCallback(
      (direction: 'next' | 'previous') => {
        const total = channelRef.current.streams.length;

        if (total <= 1) {
          return;
        }

        clearSourceTimeout();
        const current = currentIdxRef.current;
        const next =
          direction === 'next'
            ? (current + 1) % total
            : (current - 1 + total) % total;

        triedSourcesRef.current.clear();

        switchToSource(
          next,
          direction === 'next' ? 'manual-right' : 'manual-left',
        );
      },
      [clearSourceTimeout, switchToSource],
    );

    useImperativeHandle(
      ref,
      () => ({
        nextSource: () => manualSwitchSource('next'),
        previousSource: () => manualSwitchSource('previous'),
      }),
      [manualSwitchSource],
    );

    const switchToNextSource = useCallback(
      (failedIndex: number, generation: number, reason: string) => {
        const total = channelRef.current.streams.length;

        if (total <= 0) {
          return;
        }

        if (generation !== generationRef.current) {
          return;
        }

        if (switchingRef.current) {
          return;
        }

        const now = Date.now();

        if (now - lastErrorTimeRef.current < 300) {
          return;
        }

        lastErrorTimeRef.current = now;
        switchingRef.current = true;
        clearSourceTimeout();
        triedSourcesRef.current.add(failedIndex);

        const nextIdx = getNextSourceIndex(failedIndex, total);

        if (nextIdx < 0) {
          switchingRef.current = false;
          return;
        }

        generationRef.current += 1;
        const nextGeneration = generationRef.current;
        currentIdxRef.current = nextIdx;
        setCurrentIdx(nextIdx);
        setLoading(true);
        setBandwidth(0);

        setTimeout(() => {
          if (nextGeneration === generationRef.current) {
            switchingRef.current = false;
          }
        }, 150);
      },
      [clearSourceTimeout, getNextSourceIndex],
    );

    // 频道变化
    useEffect(() => {
      clearSourceTimeout();
      generationRef.current += 1;
      switchingRef.current = false;
      triedSourcesRef.current.clear();
      currentIdxRef.current = 0;
      setCurrentIdx(0);
      setLoading(true);
      setBandwidth(0);
      lastErrorTimeRef.current = 0;

      return () => {
        clearSourceTimeout();
        generationRef.current += 1;
        switchingRef.current = false;
      };
    }, [channel.id, clearSourceTimeout]);

    // Source timeout
    useEffect(() => {
      clearSourceTimeout();

      if (channel.streams.length === 0) {
        setLoading(false);
        return;
      }

      const generation = generationRef.current;
      const index = currentIdx;

      setLoading(true);

      sourceTimeoutRef.current = setTimeout(() => {
        sourceTimeoutRef.current = null;

        if (generation !== generationRef.current) {
          return;
        }

        if (switchingRef.current) {
          return;
        }

        switchToNextSource(index, generation, 'timeout');
      }, SOURCE_LOAD_TIMEOUT);

      return () => {
        clearSourceTimeout();
      };
    }, [channel.id, currentIdx, clearSourceTimeout, switchToNextSource]);

    if (channel.streams.length === 0) {
      return <View style={styles.playerContainer} />;
    }

    const source = channel.streams[currentIdx];

    if (!source) {
      return <View style={styles.playerContainer} />;
    }

    const generation = generationRef.current;

    return (
      <View style={styles.playerContainer}>
        <View style={styles.playerWrapper}>
          <View style={styles.bandwidthBadge}>
            <Text style={styles.bandwidthText}>
              {bandwidth >= 1000
                ? `${(bandwidth / 1000).toFixed(2)} Mbps`
                : `${bandwidth.toFixed(0)} kbps`}
            </Text>
          </View>

          <Video
            key={`${channel.id}-${currentIdx}-${generation}`}
            ref={videoRef}
            source={{ uri: source.url }}
            style={styles.video}
            resizeMode="contain"
            controls={false}
            muted={false}
            repeat={false}
            reportBandwidth={true}
            playInBackground={false}
            playWhenInactive={false}
            onLoad={() => {
              if (generation !== generationRef.current) {
                return;
              }

              clearSourceTimeout();
              switchingRef.current = false;
              setLoading(false);
              triedSourcesRef.current.clear();
            }}
            onError={() => {
              if (generation !== generationRef.current) {
                return;
              }

              if (switchingRef.current) {
                return;
              }

              switchToNextSource(currentIdx, generation, 'error');
            }}
            onBandwidthUpdate={(event) => {
              if (generation !== generationRef.current) {
                return;
              }

              const bitrate = Number(event?.bitrate) || 0;
              setBandwidth(bitrate / 1000);
            }}
          />

          {loading && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          )}
        </View>
      </View>
    );
  },
);

Player.displayName = 'Player';
