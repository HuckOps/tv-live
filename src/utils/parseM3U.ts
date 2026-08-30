import type { Channel, GroupedChannels } from '../types';

// ============================================================
// M3U Parser
// 解析 EXTINF / 流地址行，构造 GroupedChannels。
//
// 处理策略：
// 1. 每个 EXTINF 条目独立成 channel（保留所有源变体，不按 id 聚合）
// 2. 过滤"更新时间"等元信息分组
// 3. channel 内按 url 去重
// 4. 同分组内同名 channel 合并 streams
// ============================================================

// 元信息分组：这些条目不是真正的频道（如更新时间、来源声明等）
const META_GROUP_PATTERNS = [
  /更新时间/,
  /更新/,
  /update/i,
  /notice/i,
  /说明/,
  /声明/,
  /免责声明/,
  /author/i,
  /source/i,
  /来源/,
];

function isMetaGroup(name: string): boolean {
  return META_GROUP_PATTERNS.some((re) => re.test(name));
}

// 元信息频道名：日期、URL、纯英文声明等
const META_NAME_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}/, // 2026-08-27 ...
  /^\d{10,}$/, // 纯数字时间戳
  /^https?:\/\//i, // 链接
  /免责/,
  /请勿/,
  /仅供/,
];

function isMetaName(name: string): boolean {
  return META_NAME_PATTERNS.some((re) => re.test(name.trim()));
}

export function parseM3U(text: string): GroupedChannels[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const groupMap = new Map<string, Channel[]>();

  let currentChannel: Channel | null = null;

  for (const line of lines) {
    if (line.startsWith('#EXTINF')) {
      const nameMatch = line.match(/,(.+)$/);
      const groupMatch = line.match(/group-title="([^"]*)"/i);
      const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/i);

      const name = nameMatch?.[1]?.trim() || '未知频道';
      const group = groupMatch?.[1]?.trim() || '其他';
      const logo = logoMatch?.[1]?.trim() || undefined;
      const id = tvgIdMatch?.[1]?.trim() || name;

      // 跳过元信息分组和元信息频道
      if (isMetaGroup(group) || isMetaName(name)) {
        currentChannel = null;
        continue;
      }

      if (!groupMap.has(group)) {
        groupMap.set(group, []);
      }

      const channels = groupMap.get(group)!;

      // 同分组内同名频道：复用现有 channel，把 stream 追加进去
      const local = channels.find((channel) => channel.name === name);

      if (local) {
        currentChannel = local;
        continue;
      }

      currentChannel = {
        id,
        name,
        logo,
        group,
        streams: [],
      };

      channels.push(currentChannel);
    } else if (line.startsWith('http://') || line.startsWith('https://')) {
      if (currentChannel) {
        const url = line;

        if (!currentChannel.streams.some((s) => s.url === url)) {
          currentChannel.streams.push({ url });
        }
      }
    }
  }

  return Array.from(groupMap.entries())
    .map(([groupName, channels]) => ({
      groupName,
      channels: channels
        .filter((channel) => channel.streams.length > 0)
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')),
    }))
    .filter((group) => group.channels.length > 0);
}
