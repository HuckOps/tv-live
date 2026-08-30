import { SOURCE_URL } from '../utils/constants';
import { parseM3U } from '../utils/parseM3U';
import type { GroupedChannels } from '../types';

// ============================================================
// Channel Service
// 负责远程拉取 M3U 并解析为领域数据
// ============================================================

export async function fetchChannels(): Promise<GroupedChannels[]> {
  try {
    const response = await fetch(SOURCE_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();

    return parseM3U(text);
  } catch (error) {
    console.error('[M3U ERROR]', error);

    return [];
  }
}
