// ============================================================
// Domain Types
// ============================================================

export interface StreamEntry {
  url: string;
}

export interface Channel {
  id: string;
  name: string;
  logo?: string;
  group: string;
  streams: StreamEntry[];
}

export interface GroupedChannels {
  groupName: string;
  channels: Channel[];
}

export type CursorMode = 'group' | 'channel';

export interface PlayerRef {
  nextSource: () => void;
  previousSource: () => void;
}
