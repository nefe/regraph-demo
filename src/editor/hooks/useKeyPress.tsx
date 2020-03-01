import { useEffect, useCallback, useRef, RefObject } from 'react';

export type KeyPredicate = (event: KeyboardEvent) => boolean;
export type keyType = KeyboardEvent['keyCode'] | KeyboardEvent['key'];
export type KeyFilter = keyType | Array<keyType> | ((event: KeyboardEvent) => boolean);
export type EventHandler = (event: KeyboardEvent) => void;
export type keyEvent = 'keydown' | 'keyup';
export type RefType = HTMLElement | (() => HTMLElement | null);
export type EventOption = {
  events?: Array<keyEvent>;
  target?: Window | RefType;
};

// é®çäºä»¶ keyCode å«å
const aliasKeyCodeMap: any = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  delete: [8, 46]
};

// é®çäºä»¶ key å«å
const aliasKeyMap: any = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  delete: ['Backspace', 'Delete']
};

// ä¿®é¥°é®
const modifierKey: any = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => event.metaKey
};

// è¿åç©ºå¯¹è±¡
const noop = () => {};

/**
 * å¤æ­å¯¹è±¡ç±»å
 * @param [obj: any] åæ°å¯¹è±¡
 * @returns String
 */
function isType(obj: any) {
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase();
}

/**
 * å¤æ­æé®æ¯å¦æ¿æ´»
 * @param [event: KeyboardEvent]é®çäºä»¶
 * @param [keyFilter: any] å½åé®
 * @returns Boolean
 */
function genFilterKey(event: any, keyFilter: any) {
  const type = isType(keyFilter);
  // æ°å­ç±»åç´æ¥å¹éäºä»¶ç keyCode
  if (type === 'number') {
    return event.keyCode === keyFilter;
  }
  // å­ç¬¦ä¸²ä¾æ¬¡å¤æ­æ¯å¦æç»åé®
  const genArr = keyFilter.split('.');
  let genLen = 0;
  for (const key of genArr) {
    // ç»åé®
    const genModifier = modifierKey[key];
    // key å«å
    const aliasKey = aliasKeyMap[key];
    // keyCode å«å
    const aliasKeyCode = aliasKeyCodeMap[key];
    /**
     * æ»¡è¶³ä»¥ä¸è§å
     * 1. èªå®ä¹ç»åé®å«å
     * 2. èªå®ä¹ key å«å
     * 3. èªå®ä¹ keyCode å«å
     * 4. å¹é key æ keyCode
     */
    if (
      (genModifier && genModifier(event)) ||
      (aliasKey && isType(aliasKey) === 'array' ? aliasKey.includes(event.key) : aliasKey === event.key) ||
      (aliasKeyCode && isType(aliasKeyCode) === 'array'
        ? aliasKeyCode.includes(event.keyCode)
        : aliasKeyCode === event.keyCode) ||
      event.key.toUpperCase() === key.toUpperCase()
    ) {
      genLen++;
    }
  }
  return genLen === genArr.length;
}

/**
 * é®çè¾å¥é¢å¤çæ¹æ³
 * @param [keyFilter: any] å½åé®
 * @returns () => Boolean
 */
function genKeyFormater(keyFilter: any): KeyPredicate {
  const type = isType(keyFilter);
  if (type === 'function') {
    return keyFilter;
  }
  if (type === 'string' || type === 'number') {
    return (event: KeyboardEvent) => genFilterKey(event, keyFilter);
  }
  if (type === 'array') {
    return (event: KeyboardEvent) => keyFilter.some((item: any) => genFilterKey(event, item));
  }
  return keyFilter ? () => true : () => false;
}

const defaultEvents: Array<keyEvent> = ['keydown'];

function useKeyPress<T extends HTMLElement = HTMLInputElement>(
  keyFilter: KeyFilter,
  eventHandler: EventHandler = noop,
  option: EventOption = {}
): RefObject<T> {
  const { events = defaultEvents, target } = option;
  const element = useRef<T>();
  const callbackRef = useRef(eventHandler);
  callbackRef.current = eventHandler;

  const callbackHandler = useCallback(
    event => {
      const genGuard: KeyPredicate = genKeyFormater(keyFilter);
      if (genGuard(event)) {
        return callbackRef.current(event);
      }
    },
    [keyFilter]
  );

  useEffect(() => {
    const targetElement = typeof target === 'function' ? target() : target;
    const el = element.current || targetElement || window;
    for (const eventName of events) {
      el.addEventListener(eventName, callbackHandler);
    }
    return () => {
      for (const eventName of events) {
        el.removeEventListener(eventName, callbackHandler);
      }
    };
  }, [events, callbackHandler, target]);

  return element as RefObject<T>;
}

export { useKeyPress };
