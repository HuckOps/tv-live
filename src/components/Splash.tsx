import { ActivityIndicator, Image, Text, View } from 'react-native';

import { styles } from '../utils/styles';

// ============================================================
// Splash
// 应用启动 / 加载频道数据时展示的开屏
// ============================================================

interface SplashProps {
  status?: string;
}

export function Splash({ status }: SplashProps) {
  return (
    <View style={styles.splashRoot}>
      <View style={styles.splashLogoWrap}>
        <Image
          source={require('../../assets/images/icon-1920x720.png')}
          style={styles.splashLogo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.splashTitle}>TV LIVE</Text>
      <Text style={styles.splashSubtitle}>电视直播</Text>

      <View style={styles.splashProgressTrack}>
        <View style={styles.splashProgressBar} />
      </View>

      {status ? (
        <Text style={styles.splashStatus}>{status}</Text>
      ) : (
        <ActivityIndicator color="#5ba8ff" style={{ marginTop: 16 }} />
      )}
    </View>
  );
}
