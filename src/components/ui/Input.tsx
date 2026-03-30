import React, { useState, useRef, useId, useEffect } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  multiline?: boolean;
  rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      multiline = false,
      rows = 3,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      type = 'text',
      ...props
    },
    forwardedRef
  ) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      value !== undefined ? String(value).length > 0 : defaultValue !== undefined ? String(defaultValue).length > 0 : false
    );

    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Merge refs
    const ref = (node: HTMLInputElement | HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = node;
      }
    };

    useEffect(() => {
      if (value !== undefined) {
        setHasValue(String(value).length > 0);
      } else if (internalRef.current) {
        setHasValue(internalRef.current.value.length > 0);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (value === undefined) {
        setHasValue(e.target.value.length > 0);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const isFloating = isFocused || hasValue || props.placeholder;

    const baseInputClasses = twMerge(
      clsx(
        'w-full bg-[var(--color-card)] border rounded-xl text-[var(--color-text)] transition-all duration-200 outline-none placeholder:opacity-0 focus:placeholder:opacity-100',
        error ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-2 focus:ring-[var(--color-danger)]/20' : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
        icon && iconPosition === 'left' ? 'pl-11' : 'pl-4',
        icon && iconPosition === 'right' ? 'pr-11' : 'pr-4',
        multiline ? 'py-4 min-h-[100px] resize-y' : 'h-14 py-2',
        className
      )
    );

    const labelClasses = clsx(
      'absolute transition-all duration-200 pointer-events-none select-none',
      isFloating
        ? 'text-xs top-2 text-[var(--color-primary)]'
        : 'text-base top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]',
      icon && iconPosition === 'left' && !isFloating ? 'left-11' : 'left-4',
      error && isFloating && 'text-[var(--color-danger)]'
    );

    // adjust label top position for textarea when not floating
    const textAreaLabelClasses = clsx(
        'absolute transition-all duration-200 pointer-events-none select-none',
         isFloating
        ? 'text-xs top-2 text-[var(--color-primary)]'
        : 'text-base top-4 text-[var(--color-text-dim)]',
        icon && iconPosition === 'left' && !isFloating ? 'left-11' : 'left-4',
        error && isFloating && 'text-[var(--color-danger)]'
    )

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="relative w-full">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] flex items-center justify-center">
              {icon}
            </div>
          )}

          {multiline ? (
            <textarea
              ref={ref as any}
              id={id}
              className={baseInputClasses}
              rows={rows}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange as any}
              onFocus={handleFocus as any}
              onBlur={handleBlur as any}
              {...(props as any)}
            />
          ) : (
            <input
              ref={ref as any}
              id={id}
              type={type}
              className={clsx(baseInputClasses, isFloating && 'pt-6 pb-2')}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange as any}
              onFocus={handleFocus as any}
              onBlur={handleBlur as any}
              {...(props as any)}
            />
          )}

          <label htmlFor={id} className={multiline ? textAreaLabelClasses : labelClasses}>
            {label}
          </label>

          {icon && iconPosition === 'right' && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={clsx(
              'text-xs px-1',
              error ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-dim)]'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
