import { useCallback, useEffect, useRef, useState } from 'react';

import type { Channel, CursorMode, GroupedChannels } from '../types';

// ============================================================
// useChannelSelector
// 管理"当前播放频道 + 频道侧栏光标"的状态机，
// 数据由外部传入（避免在 AppContent 中重复请求）。
// ============================================================

interface Options {
  groups: GroupedChannels[];
  loading: boolean;
}

export function useChannelSelector({ groups, loading }: Options) {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('channel');
  const [drawerGroupIndex, setDrawerGroupIndex] = useState(0);
  const [drawerChannelIndex, setDrawerChannelIndex] = useState(0);

  // Refs（避免在遥控器回调里读到过期 state）
  const activeChannelRef = useRef<Channel | null>(null);
  const drawerVisibleRef = useRef(false);
  const cursorModeRef = useRef<CursorMode>('channel');
  const drawerGroupIndexRef = useRef(0);
  const drawerChannelIndexRef = useRef(0);

  const allChannels = groups.flatMap((g) => g.channels);

  useEffect(() => {
    activeChannelRef.current = activeChannel;
  }, [activeChannel]);

  useEffect(() => {
    drawerVisibleRef.current = drawerVisible;
  }, [drawerVisible]);

  useEffect(() => {
    cursorModeRef.current = cursorMode;
  }, [cursorMode]);

  useEffect(() => {
    drawerGroupIndexRef.current = drawerGroupIndex;
  }, [drawerGroupIndex]);

  useEffect(() => {
    drawerChannelIndexRef.current = drawerChannelIndex;
  }, [drawerChannelIndex]);

  // 数据加载完成后选中第一个频道
  useEffect(() => {
    if (!loading && !activeChannel && allChannels.length > 0) {
      setActiveChannel(allChannels[0]);
    }
  }, [loading, allChannels, activeChannel]);

  // 工具
  const findChannelPosition = useCallback(
    (channel: Channel) => {
      for (let gi = 0; gi < groups.length; gi++) {
        const ci = groups[gi].channels.findIndex(
          (item) => item.id === channel.id,
        );

        if (ci >= 0) {
          return { groupIndex: gi, channelIndex: ci };
        }
      }

      return { groupIndex: 0, channelIndex: 0 };
    },
    [groups],
  );

  // 播放控制
  const playChannel = useCallback((channel: Channel) => {
    activeChannelRef.current = channel;
    setActiveChannel(channel);
  }, []);

  const playNextChannel = useCallback(() => {
    if (allChannels.length === 0) {
      return;
    }

    const current = activeChannelRef.current;
    const idx = current
      ? allChannels.findIndex((c) => c.id === current.id)
      : -1;
    const next = (idx + 1) % allChannels.length;

    playChannel(allChannels[next]);
  }, [allChannels, playChannel]);

  const playPreviousChannel = useCallback(() => {
    if (allChannels.length === 0) {
      return;
    }

    const current = activeChannelRef.current;
    const idx = current
      ? allChannels.findIndex((c) => c.id === current.id)
      : -1;
    const total = allChannels.length;
    const prev = (idx - 1 + total) % total;

    playChannel(allChannels[prev]);
  }, [allChannels, playChannel]);

  // Drawer 控制
  const openDrawer = useCallback(() => {
    const current = activeChannelRef.current;

    let groupIndex = 0;
    let channelIndex = 0;

    if (current) {
      const pos = findChannelPosition(current);

      groupIndex = pos.groupIndex;
      channelIndex = pos.channelIndex;
    }

    drawerGroupIndexRef.current = groupIndex;
    drawerChannelIndexRef.current = channelIndex;
    cursorModeRef.current = 'channel';

    setDrawerGroupIndex(groupIndex);
    setDrawerChannelIndex(channelIndex);
    setCursorMode('channel');
    setDrawerVisible(true);
  }, [findChannelPosition]);

  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  const selectFromDrawer = useCallback(() => {
    const group = groups[drawerGroupIndexRef.current];
    const channel = group?.channels[drawerChannelIndexRef.current];

    if (!channel) {
      return;
    }

    playChannel(channel);
    closeDrawer();
  }, [groups, playChannel, closeDrawer]);

  // 光标移动
  const setGroupIndex = useCallback(
    (index: number) => {
      if (groups.length === 0) {
        return;
      }

      const safe = Math.max(0, Math.min(groups.length - 1, index));

      drawerGroupIndexRef.current = safe;
      drawerChannelIndexRef.current = 0;

      setDrawerGroupIndex(safe);
      setDrawerChannelIndex(0);
    },
    [groups.length],
  );

  const setChannelIndex = useCallback(
    (index: number) => {
      if (groups.length === 0) {
        return;
      }

      const gi = drawerGroupIndexRef.current;
      const group = groups[gi];
      const max = (group?.channels.length || 1) - 1;

      // 越界：向下到末尾 → 跳到下一分组的第一个
      if (index > max && gi < groups.length - 1) {
        const nextGroup = gi + 1;

        drawerGroupIndexRef.current = nextGroup;
        drawerChannelIndexRef.current = 0;

        setDrawerGroupIndex(nextGroup);
        setDrawerChannelIndex(0);
        return;
      }

      // 越界：向上到头 → 跳到上一分组的最后一个
      if (index < 0 && gi > 0) {
        const prevGroup = gi - 1;
        const prevMax = (groups[prevGroup].channels.length || 1) - 1;

        drawerGroupIndexRef.current = prevGroup;
        drawerChannelIndexRef.current = prevMax;

        setDrawerGroupIndex(prevGroup);
        setDrawerChannelIndex(prevMax);
        return;
      }

      const safe = Math.max(0, Math.min(max, index));

      drawerChannelIndexRef.current = safe;
      setDrawerChannelIndex(safe);
    },
    [groups],
  );

  const switchCursorMode = useCallback((mode: CursorMode) => {
    cursorModeRef.current = mode;
    setCursorMode(mode);
  }, []);

  return {
    groups,
    loading,
    allChannels,

    activeChannel,

    drawerVisible,
    cursorMode,
    drawerGroupIndex,
    drawerChannelIndex,

    playChannel,
    playNextChannel,
    playPreviousChannel,

    openDrawer,
    closeDrawer,
    selectFromDrawer,
    setGroupIndex,
    setChannelIndex,
    switchCursorMode,
  };
}
