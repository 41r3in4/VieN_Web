'use client';

import { useEffect, useRef, type MouseEvent, type RefObject } from 'react';

let scrollLocks = 0;
let originalOverflow = '';

export function useModalDialog(open: boolean, onClose: () => void, label: string, externalRef?: RefObject<HTMLDivElement | null>) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = externalRef ?? localRef;
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const element = ref.current;
    if (!open || !element) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (scrollLocks++ === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    element.focus({ preventScroll: true });
    const keyboard = (event: KeyboardEvent) => {
      const dialogs = document.querySelectorAll('[data-vien-dialog="true"]');
      if (dialogs[dialogs.length - 1] !== element) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        close.current();
      }
      if (event.key === 'Tab') {
        const controls = [...element.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled):not([type="hidden"]),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(control => control.getClientRects().length > 0);
        if (!controls.length) { event.preventDefault(); return; }
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === element || document.activeElement === first)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keyboard);
    return () => {
      document.removeEventListener('keydown', keyboard);
      if (--scrollLocks === 0) document.body.style.overflow = originalOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open, ref]);
  return {
    ref,
    role: 'dialog' as const,
    'aria-modal': true as const,
    'aria-label': label,
    'data-vien-dialog': 'true',
    tabIndex: -1,
    onClick: (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
  };
}
