import type { ButtonHTMLAttributes } from 'react';

interface RoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Highlights the primary action (for example "save"). */
  accent?: boolean;
}

export function RoundButton({
  accent = false,
  className,
  ...props
}: RoundButtonProps) {
  const classes = [
    'round-button',
    accent ? 'round-button--accent' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return <button type="button" className={classes} {...props} />;
}
