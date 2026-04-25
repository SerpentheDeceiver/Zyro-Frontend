export default function EmptyState({ title, description, action }) {
  return (
    <div className="panel flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
