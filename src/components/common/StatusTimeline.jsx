export function StatusTimeline({ steps = [], className = '' }) {
  return (
    <ol className={['space-y-4', className].filter(Boolean).join(' ')}>
      {steps.map((step, index) => {
        const done = Boolean(step.done);
        const active = Boolean(step.active);
        const isLast = index === steps.length - 1;

        const dotWrapClass = done
          ? 'border-emerald-500 bg-emerald-500 text-white'
          : active
            ? 'border-primary bg-white text-primary'
            : 'border-slate-300 bg-white text-slate-400';

        const connectorClass = done ? 'bg-emerald-500/60' : 'bg-slate-200';

        const labelClass = done ? 'text-emerald-700' : active ? 'text-primary' : 'text-slate-600';

        return (
          <li key={`${step.label}-${index}`} className="relative pl-8">
            {!isLast ? (
              <span
                className={[
                  'absolute left-[11px] top-6 h-[calc(100%+0.5rem)] w-0.5',
                  connectorClass,
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              />
            ) : null}

            <span
              className={[
                'absolute left-0 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2',
                dotWrapClass,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden="true"
            >
              <span
                className={[
                  'h-2.5 w-2.5 rounded-full',
                  done ? 'bg-white' : active ? 'bg-primary animate-pulse' : 'bg-slate-300',
                ].join(' ')}
              />
            </span>

            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
              <p className={['text-sm font-semibold', labelClass].join(' ')}>{step.label}</p>
              {step.date ? <p className="mt-0.5 text-xs text-slate-500">{step.date}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default StatusTimeline;
