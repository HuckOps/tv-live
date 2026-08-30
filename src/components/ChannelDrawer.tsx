import { useEffect, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../utils/styles';
import type { Channel, CursorMode, GroupedChannels } from '../types';

// ============================================================
// ChannelDrawer
// 频道选择侧栏，包含分组列与频道列
// ============================================================

interface DrawerProps {
  groups: GroupedChannels[];
  currentChannel: Channel | null;
  cursorMode: CursorMode;
  groupIndex: number;
  channelIndex: number;

  onCursorModeChange: (mode: CursorMode) => void;
  onGroupIndexChange: (index: number) => void;
  onChannelIndexChange: (index: number) => void;
  onSelect: (channel: Channel) => void;
  onClose: () => void;
}

export function ChannelDrawer({
  groups,
  cursorMode,
  groupIndex,
  channelIndex,
  onCursorModeChange,
  onGroupIndexChange,
  onChannelIndexChange,
  onSelect,
  onClose,
}: DrawerProps) {
  const groupListRef = useRef<FlatList>(null);
  const channelListRef = useRef<FlatList>(null);

  const currentGroup = groups[groupIndex] || groups[0];
  const channels = currentGroup?.channels || [];

  // 滚动分组
  useEffect(() => {
    requestAnimationFrame(() => {
      try {
        groupListRef.current?.scrollToIndex({
          index: groupIndex,
          animated: true,
          viewPosition: 0.5,
        });
      } catch {}
    });
  }, [groupIndex]);

  // 滚动频道
  useEffect(() => {
    if (channels.length === 0) {
      return;
    }

    const index = Math.min(channelIndex, channels.length - 1);

    requestAnimationFrame(() => {
      try {
        channelListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      } catch {}
    });
  }, [channelIndex, channels.length]);

  const renderGroupItem = ({
    item,
    index,
  }: {
    item: GroupedChannels;
    index: number;
  }) => {
    const focused = cursorMode === 'group' && index === groupIndex;

    return (
      <View
        style={[styles.groupItem, focused && styles.groupItemFocused]}
        onTouchEnd={() => {
          onGroupIndexChange(index);
          onCursorModeChange('group');
        }}
      >
        {focused && <View style={styles.cursorBar} />}

        <View style={styles.groupItemContent}>
          <Text
            style={[styles.groupName, focused && styles.groupNameFocused]}
            numberOfLines={1}
          >
            {item.groupName}
          </Text>
          <Text style={styles.groupCount}>{item.channels.length}</Text>
        </View>
      </View>
    );
  };

  const renderChannelItem = ({
    item,
    index,
  }: {
    item: Channel;
    index: number;
  }) => {
    const focused = cursorMode === 'channel' && index === channelIndex;

    return (
      <TouchableOpacity
        focusable={false}
        activeOpacity={0.8}
        style={[
          styles.channelMenuItem,
          focused && styles.channelMenuItemFocused,
        ]}
        onPress={() => onSelect(item)}
        onFocus={() => onChannelIndexChange(index)}
      >
        {focused && <View style={styles.cursorBar} />}

        <View style={styles.channelNumber}>
          <Text
            style={[
              styles.channelNumberText,
              focused && styles.channelNumberTextFocused,
            ]}
          >
            {index + 1}
          </Text>
        </View>

        <View style={styles.channelMenuInfo}>
          <Text
            style={[
              styles.channelMenuName,
              focused && styles.channelMenuNameFocused,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.channelMenuSource}>
            {item.streams.length} 路源
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // 空状态
  if (!groups.length) {
    return (
      <View style={styles.drawerOverlay}>
        <View style={styles.drawerPanel}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>选择频道</Text>
          </View>
          <View style={styles.emptyDrawer}>
            <Text style={styles.emptyDrawerText}>暂无频道</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.drawerOverlay} onTouchEnd={onClose}>
      <View style={styles.drawerPanel} onTouchEnd={(e) => e.stopPropagation()}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>选择频道</Text>
          <Text style={styles.drawerHint}>
            ↑↓ 移动　←→ 切换　Back 返回　OK 选择
          </Text>
        </View>

        <View style={styles.drawerBody}>
          {/* Groups */}
          <View style={styles.groupColumn}>
            <View
              style={[
                styles.columnHeader,
                cursorMode === 'group' && styles.columnHeaderActive,
              ]}
            >
              <Text
                style={[
                  styles.columnHeaderText,
                  cursorMode === 'group' && styles.columnHeaderTextActive,
                ]}
              >
                分组
              </Text>
            </View>

            <FlatList
              ref={groupListRef}
              data={groups}
              focusable={false}
              keyExtractor={(item, index) => `${item.groupName}-${index}`}
              renderItem={renderGroupItem}
              showsVerticalScrollIndicator={false}
              getItemLayout={(_, index) => ({
                length: 54,
                offset: 54 * index,
                index,
              })}
            />
          </View>

          {/* Channels */}
          <View style={styles.channelColumn}>
            <View
              style={[
                styles.columnHeader,
                cursorMode === 'channel' && styles.columnHeaderActive,
              ]}
            >
              <View style={styles.columnHeaderLeft}>
                <Text
                  style={[
                    styles.columnHeaderText,
                    cursorMode === 'channel' && styles.columnHeaderTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {currentGroup?.groupName || '频道'}
                </Text>
              </View>
              <Text style={styles.columnHeaderCount}>{channels.length}</Text>
            </View>

            <FlatList
              ref={channelListRef}
              data={channels}
              focusable={false}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderChannelItem}
              showsVerticalScrollIndicator={false}
              getItemLayout={(_, index) => ({
                length: 64,
                offset: 64 * index,
                index,
              })}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
