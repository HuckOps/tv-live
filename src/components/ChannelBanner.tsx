import { Text, View } from 'react-native';

import { styles } from '../utils/styles';
import type { Channel } from '../types';

// ============================================================
// ChannelBanner
// 屏幕底部展示当前频道名称、分组、串流源编号
// ============================================================

interface ChannelBannerProps {
  channel: Channel;
  sourceIndex: number;
  sourceTotal: number;
}

export function ChannelBanner({
  channel,
  sourceIndex,
  sourceTotal,
}: ChannelBannerProps) {
  return (
    <View style={styles.channelBanner}>
      <View style={styles.channelBannerMain}>
        <Text style={styles.channelBannerName} numberOfLines={1}>
          {channel.name}
        </Text>
        <Text style={styles.channelBannerGroup} numberOfLines={1}>
          {channel.group}
        </Text>
      </View>

      <View style={styles.channelBannerSource}>
        <Text style={styles.channelBannerSourceLabel}>当前串流源</Text>
        <Text style={styles.channelBannerSourceText} numberOfLines={1}>
          源 {sourceIndex + 1} / {sourceTotal}
        </Text>
      </View>
    </View>
  );
}
