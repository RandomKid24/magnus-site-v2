'use client';

import { useState, useRef, type ReactNode } from 'react';

export default function Tooltip({
  label,
  hint,
  children,
  placement = 'top',
  className = '',
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 80);
  };

  const positionClass = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[placement];

  const arrowClass = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900',
  }[placement];

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute z-[200] whitespace-nowrap max-w-[220px] overflow-hidden text-ellipsis ${positionClass}`}
        >
          <span className="relative block rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium leading-tight text-white shadow">
            {label}
            {hint && (
              <span className="ml-1 text-slate-300">· {hint}</span>
            )}
            <span
              className={`absolute w-0 h-0 border-4 border-transparent ${arrowClass}`}
            />
          </span>
        </span>
      )}
    </span>
  );
}
