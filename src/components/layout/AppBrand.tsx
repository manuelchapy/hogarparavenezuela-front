interface AppBrandProps {
  country?: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
}

export const AppBrand = ({
  country,
  title,
  subtitle,
  compact = false,
}: AppBrandProps) => (
  <div className={compact ? 'text-center' : 'px-1 text-center'}>
    {country && (
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
        {country}
      </p>
    )}
    <h1
      className={[
        'font-bold leading-tight text-text-on-primary',
        compact ? 'mt-3 text-2xl' : 'mt-4 text-3xl',
      ].join(' ')}
    >
      {title}
    </h1>
    {subtitle && (
      <p className="mt-2 text-base font-medium text-primary-200">{subtitle}</p>
    )}
  </div>
);
