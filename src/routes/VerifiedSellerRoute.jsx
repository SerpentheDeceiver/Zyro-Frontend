import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { canSell } from '../utils/auth';

export default function VerifiedSellerRoute({ children }) {
  const { user } = useAuth();

  if (canSell(user)) return children;

  return (
    <main className="page-shell py-10">
      <section className="panel mx-auto max-w-2xl p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertCircle size={28} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">Verification required</h1>
        <p className="mt-3 text-slate-600">
          Verified Zyro members can create listings. Your account can still browse, buy, chat,
          and manage wallet activity.
        </p>
        <Link to="/profile" className="btn-primary mt-6">
          Open profile
        </Link>
      </section>
    </main>
  );
}
