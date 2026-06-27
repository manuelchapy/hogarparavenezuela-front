interface StepProgressProps {
  steps: readonly string[];
  currentStep: number;
}

export const StepProgress = ({ steps, currentStep }: StepProgressProps) => (
  <div className="mt-4 flex gap-1">
    {steps.map((label, index) => {
      const isActive = index === currentStep;
      const isDone = index < currentStep;

      return (
        <div key={label} className="flex min-w-0 flex-1 flex-col gap-1">
          <div
            className={[
              'h-1.5 rounded-full',
              isActive
                ? 'bg-accent-500'
                : isDone
                  ? 'bg-primary-600'
                  : 'bg-surface-muted',
            ].join(' ')}
            aria-hidden
          />
          <span
            className={[
              'truncate text-center text-[10px] font-bold uppercase tracking-wide',
              isActive
                ? 'text-accent-600'
                : isDone
                  ? 'text-primary-700'
                  : 'text-text-muted',
            ].join(' ')}
          >
            {label}
          </span>
        </div>
      );
    })}
  </div>
);
