import { useState } from 'react';
import { CheckCircle2, CircleDollarSign, ClipboardList, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency, formatDate, initials } from '../utils/format';

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'wallet', label: 'Wallet', icon: CircleDollarSign },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
];

export default function ProfilePage() {
  const { user, updateUser, becomeSeller } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateUser(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="panel h-fit overflow-hidden">
          <div className="border-b border-slate-200 p-5 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-black text-white">
              {initials(user?.fullName || user?.mobile)}
            </div>
            <h1 className="mt-4 text-xl font-black text-slate-950">{user?.fullName || 'Zyro Member'}</h1>
            <p className="text-sm text-slate-500">{user?.mobile}</p>
            <div className="mt-3">
              <StatusBadge status={user?.isVerified ? 'RELEASED' : 'DRAFT'}>
                {user?.isVerified ? 'Verified' : 'Not Verified'}
              </StatusBadge>
            </div>
          </div>
          <nav className="p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-bold ${
                  tab === id ? 'bg-indigo-50 text-primary' : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setTab(id)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="panel p-6">
          {tab === 'profile' && (
            <>
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Profile</h2>
                  <p className="text-sm text-slate-500">Joined {formatDate(user?.createdAt)}</p>
                </div>
                {!user?.isVerified && (
                  <Button variant="secondary" onClick={becomeSeller}>
                    <CheckCircle2 size={18} />
                    Become Seller
                  </Button>
                )}
              </div>

              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
                  <input
                    className="input"
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  />
                </label>
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Avatar URL</span>
                  <input
                    className="input"
                    value={form.avatarUrl}
                    onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))}
                  />
                </label>
                <div className="md:col-span-2">
                  <Button type="submit" loading={saving}>
                    Save Profile
                  </Button>
                </div>
              </form>
            </>
          )}

          {tab === 'wallet' && (
            <div>
              <h2 className="text-2xl font-black text-slate-950">Wallet</h2>
              <p className="mt-4 text-5xl font-black text-primary">{formatCurrency(user?.walletBalance)}</p>
              <Link to="/wallet" className="btn-outline mt-6">
                Open wallet
              </Link>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="text-2xl font-black text-slate-950">Orders</h2>
              <p className="mt-2 text-slate-600">View buying and selling history with escrow status.</p>
              <Link to="/orders" className="btn-outline mt-6">
                Open orders
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
