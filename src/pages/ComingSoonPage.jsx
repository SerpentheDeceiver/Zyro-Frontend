export default function ComingSoonPage({ title }) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Coming Soon</p>
        <h1 className="mt-2 text-2xl font-black text-ink">{title}</h1>
      </div>
    </section>
  );
}

