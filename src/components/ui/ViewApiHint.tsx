import { getViewEndpoints } from '@/constants/viewEndpointMap';

interface ViewApiHintProps {
  route: string;
  className?: string;
}

export const ViewApiHint = ({ route, className = '' }: ViewApiHintProps) => {
  const binding = getViewEndpoints(route);

  if (!binding?.endpoints.length) {
    return null;
  }

  return (
    <p
      className={[
        'rounded-xl bg-slate-100 px-3 py-2 text-sm leading-relaxed text-text-secondary',
        className,
      ].join(' ')}
    >
      <span className="font-medium text-text-primary">API: </span>
      {binding.endpoints.map((endpoint, index) => (
        <span key={`${endpoint.method}-${endpoint.path}`}>
          {index > 0 ? ' · ' : ''}
          {endpoint.method} /api{endpoint.path}
          {endpoint.note ? ` (${endpoint.note})` : ''}
        </span>
      ))}
    </p>
  );
};
