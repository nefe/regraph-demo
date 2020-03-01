import { MutableRefObject, useRef, useEffect, useCallback, useMemo } from 'react';

// é¼ æ ç¹å»äºä»¶ï¼click ä¸ä¼çå¬å³é®
const defaultEvent = 'click';

type RefType = HTMLElement | (() => HTMLElement | null) | null;

export function useClickAway<T extends HTMLElement = HTMLDivElement>(
  onClickAway: (event: KeyboardEvent) => void,
  dom?: RefType,
  eventName: string = defaultEvent,
): MutableRefObject<T> {
  const element = useRef<T>();

  const handler = useCallback(
    event => {
      const targetElement = typeof dom === 'function' ? dom() : dom;
      const el = targetElement || element.current;
      if (!el || el.contains(event.target)) {
        return;
      }

      onClickAway(event);
    },
    [element.current, onClickAway, dom],
  );

  useEffect(() => {
    document.addEventListener(eventName, handler);

    return () => {
      document.removeEventListener(eventName, handler);
    };
  }, [eventName, handler]);

  return element as MutableRefObject<T>;
}