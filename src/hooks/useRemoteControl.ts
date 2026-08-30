import { useCallback, useEffect, useRef } from 'react';
import { useTVEventHandler } from 'react-native';

// ============================================================
// Types
// ============================================================

export type RemoteAction =
  | { type: 'select' }
  | { type: 'back' }
  | { type: 'up' }
  | { type: 'down' }
  | { type: 'left' }
  | { type: 'right' };

export type RemoteHandler = (action: RemoteAction) => void;

// ============================================================
// useRemoteControl
// 封装 react-native-tvos 的 useTVEventHandler，
// 把原始事件归一化成业务语义（select / back / directions）。
// ============================================================

export function useRemoteControl(handler: RemoteHandler) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const dispatch = useCallback((event: any) => {
    if (!event) {
      return;
    }

    const rawType = event.eventType ?? event.type ?? event.event;

    if (rawType == null) {
      return;
    }

    const normalized = String(rawType).toLowerCase().replace(/[-_]/g, '');

    const action = mapEvent(normalized);

    if (action) {
      handlerRef.current(action);
    }
  }, []);

  // 顶层调用，订阅 TV 事件
  useTVEventHandler(dispatch);
}

function mapEvent(normalized: string): RemoteAction | null {
  if (
    normalized === 'select' ||
    normalized === 'enter' ||
    normalized === 'center' ||
    normalized === 'ok' ||
    normalized === 'confirm' ||
    normalized === 'numpadenter' ||
    normalized === 'dpadcenter' ||
    normalized === 'buttonselect'
  ) {
    return { type: 'select' };
  }

  if (
    normalized === 'back' ||
    normalized === 'escape' ||
    normalized === 'esc' ||
    normalized === 'menuextras' ||
    normalized === 'menu'
  ) {
    return { type: 'back' };
  }

  if (
    normalized === 'up' ||
    normalized === 'arrowup' ||
    normalized === 'dpadup'
  ) {
    return { type: 'up' };
  }

  if (
    normalized === 'down' ||
    normalized === 'arrowdown' ||
    normalized === 'dpaddown'
  ) {
    return { type: 'down' };
  }

  if (
    normalized === 'left' ||
    normalized === 'arrowleft' ||
    normalized === 'dpadleft'
  ) {
    return { type: 'left' };
  }

  if (
    normalized === 'right' ||
    normalized === 'arrowright' ||
    normalized === 'dpadright'
  ) {
    return { type: 'right' };
  }

  return null;
}
