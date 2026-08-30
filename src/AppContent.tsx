import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChannelBanner } from './components/ChannelBanner';
import { ChannelDrawer } from './components/ChannelDrawer';
import { Player } from './components/Player';
import { useChannelSelector } from './hooks/useChannelSelector';
import { RemoteAction, useRemoteControl } from './hooks/useRemoteControl';
import { CHANNEL_BANNER_DURATION } from './utils/constants';
import { styles } from './utils/styles';
import type { GroupedChannels, PlayerRef } from './types';

// ============================================================
// AppContent
// 组合根：把数据/状态/UI/遥控器绑定到一起
// ============================================================

interface AppContentProps {
  groups: GroupedChannels[];
}

export function AppContent({ groups }: AppContentProps) {
  const insets = useSafeAreaInsets();
  const playerRef = useRef<PlayerRef>(null);

  const selector = useChannelSelector({ groups, loading: false });
  const {
    activeChannel,
    drawerVisible,
    cursorMode,
    drawerGroupIndex,
    drawerChannelIndex,
    openDrawer,
    closeDrawer,
    selectFromDrawer,
    setGroupIndex,
    setChannelIndex,
    switchCursorMode,
    playNextChannel,
    playPreviousChannel,
    playChannel,
  } = selector;

  // Banner 状态
  const [sourceIndex, setSourceIndex] = useState(0);
  const [sourceTotal, setSourceTotal] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(false);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 切换频道 / 源时显示 banner
  useEffect(() => {
    if (!activeChannel) {
      return;
    }

    setBannerVisible(true);

    if (bannerTimerRef.current) {
      clearTimeout(bannerTimerRef.current);
    }

    bannerTimerRef.current = setTimeout(() => {
      setBannerVisible(false);
      bannerTimerRef.current = null;
    }, CHANNEL_BANNER_DURATION);

    return () => {
      if (bannerTimerRef.current) {
        clearTimeout(bannerTimerRef.current);
        bannerTimerRef.current = null;
      }
    };
  }, [activeChannel, sourceIndex]);

  // 遥控器去抖
  const lastEventRef = useRef<{ type: string; time: number }>({
    type: '',
    time: 0,
  });
  const lastSelectTimeRef = useRef(0);

  // 业务：处理遥控器动作
  const handleAction = useCallback(
    (action: RemoteAction) => {
      const now = Date.now();

      // OK 单独防抖
      if (action.type === 'select') {
        if (now - lastSelectTimeRef.current < 180) {
          return;
        }

        lastSelectTimeRef.current = now;

        if (drawerVisible) {
          if (cursorMode === 'group') {
            switchCursorMode('channel');
            setChannelIndex(0);
            return;
          }

          selectFromDrawer();
          return;
        }

        openDrawer();
        return;
      }

      // Back
      if (action.type === 'back') {
        if (drawerVisible) {
          if (cursorMode === 'channel') {
            switchCursorMode('group');
            return;
          }

          closeDrawer();
        }

        return;
      }

      // 方向键去抖
      if (
        action.type === lastEventRef.current.type &&
        now - lastEventRef.current.time < 80
      ) {
        return;
      }

      lastEventRef.current = { type: action.type, time: now };

      // Drawer 已打开
      if (drawerVisible) {
        if (cursorMode === 'group') {
          if (action.type === 'up') {
            setGroupIndex(drawerGroupIndex - 1);
            return;
          }

          if (action.type === 'down') {
            setGroupIndex(drawerGroupIndex + 1);
            return;
          }

          if (action.type === 'right') {
            switchCursorMode('channel');
            return;
          }

          return;
        }

        // channel mode
        if (action.type === 'up') {
          setChannelIndex(drawerChannelIndex - 1);
          return;
        }

        if (action.type === 'down') {
          setChannelIndex(drawerChannelIndex + 1);
          return;
        }

        if (action.type === 'left') {
          switchCursorMode('group');
          return;
        }

        return;
      }

      // Drawer 关闭：方向键 = 切频道 / 切源
      switch (action.type) {
        case 'up':
          playPreviousChannel();
          break;

        case 'down':
          playNextChannel();
          break;

        case 'left':
          playerRef.current?.previousSource();
          break;

        case 'right':
          playerRef.current?.nextSource();
          break;
      }
    },
    [
      drawerVisible,
      cursorMode,
      drawerGroupIndex,
      drawerChannelIndex,
      openDrawer,
      closeDrawer,
      selectFromDrawer,
      setGroupIndex,
      setChannelIndex,
      switchCursorMode,
      playNextChannel,
      playPreviousChannel,
    ],
  );

  useRemoteControl(handleAction);

  // 渲染
  return (
    <View style={styles.root}>
      <View
        style={[
          styles.playerPanel,
          {
            paddingRight: insets.right,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {activeChannel ? (
          <Player
            ref={playerRef}
            channel={activeChannel}
            onSourceChange={(index, total) => {
              setSourceIndex(index);
              setSourceTotal(total);
            }}
          />
        ) : (
          <View style={styles.center}>
            <Text style={styles.placeholderText}>暂无频道</Text>
          </View>
        )}

        {activeChannel && bannerVisible && sourceTotal > 0 && (
          <ChannelBanner
            channel={activeChannel}
            sourceIndex={sourceIndex}
            sourceTotal={sourceTotal}
          />
        )}
      </View>

      {drawerVisible && (
        <ChannelDrawer
          groups={groups}
          currentChannel={activeChannel}
          cursorMode={cursorMode}
          groupIndex={drawerGroupIndex}
          channelIndex={drawerChannelIndex}
          onCursorModeChange={switchCursorMode}
          onGroupIndexChange={setGroupIndex}
          onChannelIndexChange={setChannelIndex}
          onSelect={(channel) => {
            playChannel(channel);
            closeDrawer();
          }}
          onClose={closeDrawer}
        />
      )}
    </View>
  );
}
