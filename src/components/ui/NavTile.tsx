import { Link } from 'react-router-dom';

interface NavTileProps {
  to: string;
  title: string;
  description: string;
  accent?: boolean;
  icon?: string;
}

export const NavTile = ({
  to,
  title,
  description,
  accent = false,
  icon = '→',
}: NavTileProps) => (
  <Link to={to} className="block">
    <div
      className={[
        'surface-card-interactive flex items-start gap-4 md:p-6',
        accent && 'border-feedback-warning-border bg-feedback-warning-bg',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg',
          accent
            ? 'bg-accent-500 text-text-on-accent'
            : 'bg-primary-100 text-primary-700',
        ].join(' ')}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0">
        <h2
          className={[
            'text-lg font-bold md:text-xl',
            accent ? 'text-feedback-warning-text' : 'text-text-primary',
          ].join(' ')}
        >
          {title}
        </h2>
        <p
          className={[
            'mt-1 text-base',
            accent ? 'text-feedback-warning-text/90' : 'text-text-secondary',
          ].join(' ')}
        >
          {description}
        </p>
      </div>
    </div>
  </Link>
);
