import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="page-shell py-12">
      <section className="panel p-8 text-center">
        <h1 className="text-3xl font-black text-slate-950">Page not found</h1>
        <Link className="btn-primary mt-6" to="/">
          Back to marketplace
        </Link>
      </section>
    </main>
  );
}
