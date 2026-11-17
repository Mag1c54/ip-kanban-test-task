import type { ButtonHTMLAttributes } from 'react';

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Accessible name for the icon-only button. */
  label: string;
  /** Applies the red destructive-action styling. */
  danger?: boolean;
}

export function IconButton({
  label,
  danger = false,
  className,
  ...props
}: IconButtonProps) {
  const classes = [
    'icon-button',
    danger ? 'icon-button--danger' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-label={label}
      {...props}
    />
  );
}
