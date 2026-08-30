import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppContent } from './src/AppContent';
import { Splash } from './src/components/Splash';
import { SPLASH_MIN_DURATION } from './src/utils/constants';
import { fetchChannels } from './src/services/channelService';
import type { GroupedChannels } from './src/types';

// ============================================================
// App
// 启动流程：
//   1. 立刻展示 Splash
//   2. 同时请求 M3U 直播源
//   3. 数据就绪 + 最短动画时间达到后再切换到主界面
// ============================================================

type BootStatus =
  | { phase: 'loading'; message: string }
  | {
      phase: 'ready';
      groups: GroupedChannels[];
    };

export default function App() {
  const [boot, setBoot] = useState<BootStatus>({
    phase: 'loading',
    message: '正在加载频道...',
  });

  useEffect(() => {
    let cancelled = false;

    const startedAt = Date.now();

    // 请求 M3U 源
    (async () => {
      try {
        const groups = await fetchChannels();

        if (cancelled) {
          return;
        }

        // 保证 Splash 至少展示 SPLASH_MIN_DURATION
        const elapsed = Date.now() - startedAt;
        const wait = Math.max(0, SPLASH_MIN_DURATION - elapsed);

        setTimeout(() => {
          if (cancelled) {
            return;
          }

          setBoot({ phase: 'ready', groups });
        }, wait);
      } catch (e) {
        if (cancelled) {
          return;
        }

        const message = e instanceof Error ? e.message : '加载失败';

        setTimeout(
          () => {
            if (cancelled) {
              return;
            }

            setBoot({
              phase: 'ready',
              groups: [],
            });
          },
          Math.max(0, SPLASH_MIN_DURATION - (Date.now() - startedAt)),
        );

        console.warn('[BOOT] load failed:', message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaProvider>
      {boot.phase === 'loading' ? (
        <Splash status={boot.message} />
      ) : (
        <AppContent groups={boot.groups} />
      )}
    </SafeAreaProvider>
  );
}
