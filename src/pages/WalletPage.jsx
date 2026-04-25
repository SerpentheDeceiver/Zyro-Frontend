import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Loader from '../components/common/Loader.jsx';
import { useWallet } from '../hooks/useWallet';
import { formatCurrency, formatDate } from '../utils/format';

export default function WalletPage() {
  const { balance, transactions, loading, addFunds } = useWallet();
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleTopUp(event) {
    event.preventDefault();
    if (!Number(amount)) return;
    setSaving(true);
    try {
      await addFunds(Number(amount));
      setAmount('');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader label="Loading wallet" />;

  return (
    <main className="page-shell py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-950">Wallet</h1>
        <p className="text-slate-500">Balance and escrow ledger</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="panel p-6">
          <p className="text-sm font-semibold text-slate-500">Available balance</p>
          <p className="mt-3 text-5xl font-black text-slate-950">{formatCurrency(balance)}</p>
          <form className="mt-8 flex gap-3" onSubmit={handleTopUp}>
            <input
              className="input"
              type="number"
              min="1"
              placeholder="Amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <Button type="submit" loading={saving}>
              <Plus size={18} />
              Add
            </Button>
          </form>
        </section>

        <section className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-black text-slate-950">Transactions</h2>
          </div>
          {transactions.length ? (
            <div className="divide-y divide-slate-100">
              {transactions.map((txn) => {
                const credit = txn.type === 'CREDIT';
                return (
                  <div key={txn.id} className="flex items-center gap-4 p-5">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        credit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {credit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-950">{txn.description || txn.type}</p>
                      <p className="text-sm text-slate-500">{formatDate(txn.createdAt)}</p>
                    </div>
                    <p className={`font-black ${credit ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {credit ? '+' : '-'}
                      {formatCurrency(txn.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-5">
              <EmptyState title="No transactions" description="Wallet ledger entries will appear after top-ups and orders." />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
