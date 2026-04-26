import { useState, useEffect } from 'react';
import { User, Wallet, Clipboard, Grid3x3, Shield, Settings, Check, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/common/Avatar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { formatCurrency, formatDate } from '../utils/format';
import { mockUser, getWalletHistory } from '../api/mock/index.js';

const SIDEBAR_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'listings', label: 'My Listings', icon: Grid3x3 },
  { id: 'orders', label: 'Orders', icon: Clipboard },
  { id: 'kyc', label: 'KYC', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(mockUser.walletBalance);
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // Profile form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  });

  async function handleSaveProfile() {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await updateUser(formData);
      toast.success('Profile updated!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell min-h-screen bg-slate-50 py-8 animate-fade-slide-up">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* LEFT SIDEBAR */}
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            {/* User Info */}
            <div className="mb-6 text-center">
              <Avatar name={user?.fullName} url={user?.avatarUrl} size="xl" className="mx-auto mb-4" />
              <h2 className="font-bold text-ink">{user?.fullName || 'User'}</h2>
              <p className="mt-1 text-sm text-slate-500">{user?.mobile}</p>
              {user?.isVerified && (
                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 w-fit mx-auto">
                  <Check className="h-3 w-3" /> Verified
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <div
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 font-semibold transition ${
                      isActive
                        ? 'bg-primary/5 text-primary border-l-4 border-primary pl-3'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-soft">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-ink">Profile</h2>
                  <p className="mt-1 text-slate-500">
                    Joined {formatDate(user?.createdAt || new Date().toISOString())}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {/* Avatar URL */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Avatar URL
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                      />
                      {formData.avatarUrl && (
                        <Avatar
                          url={formData.avatarUrl}
                          name={formData.fullName}
                          size="md"
                          className="shrink-0"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className={`w-full rounded-pill px-6 py-2.5 text-center font-bold text-white transition ${
                      loading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'cursor-pointer bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <WalletTabContent balance={walletBalance} setBalance={setWalletBalance} />
            )}

            {/* My Listings Tab */}
            {activeTab === 'listings' && (
              <MyListingsTabContent />
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-black text-ink">Orders</h2>
                <EmptyState
                  title="View your orders"
                  subtitle="Go to the Orders page to see all your buying and selling transactions."
                  actionLabel="View Orders"
                  onAction={() => window.location.href = '/orders'}
                />
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === 'kyc' && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-black text-ink">KYC Verification</h2>
                <EmptyState title="KYC coming soon" subtitle="Identity verification features will be available soon." />
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-black text-ink">Settings</h2>
                <EmptyState title="Settings" subtitle="Additional settings will be available soon." />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      <TopUpModal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} onSuccess={(amount) => {
        setWalletBalance(prev => prev + amount);
        setShowTopUpModal(false);
      }} />
    </main>
  );
}

function WalletTabContent({ balance, setBalance }) {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    getWalletHistory()
      .then((data) => setTransactions(data.slice(0, 5)))
      .finally(() => setTxLoading(false));
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-black text-ink">Wallet</h2>
        <p className="mt-1 text-slate-500">Manage your wallet balance and view transaction history</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <p className="text-sm font-semibold opacity-90">Available Balance</p>
        <p className="mt-2 text-4xl font-black">₹{balance.toLocaleString('en-IN')}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <div
          onClick={() => setShowTopUpModal(true)}
          className="flex-1 cursor-pointer rounded-pill bg-white border-2 border-primary px-4 py-2.5 text-center font-bold text-primary transition hover:bg-primary/5"
        >
          Top Up
        </div>
        <div className="flex-1 cursor-pointer rounded-pill bg-white border-2 border-slate-300 px-4 py-2.5 text-center font-bold text-slate-700 transition hover:bg-slate-50">
          Withdraw
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="mb-4 font-bold text-ink">Recent Transactions</h3>
        {txLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoader key={i} variant="list-item" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState title="No transactions yet" subtitle="Your recent transactions will appear here." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.map((txn) => {
              const isCredit = txn.type === 'CREDIT';
              return (
                <li key={txn.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {isCredit
                        ? <TrendingUp className="h-4 w-4" />
                        : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{txn.description}</p>
                      <p className="text-xs text-slate-400">{txn.date}{txn.orderId ? ` · ${txn.orderId}` : ''}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${
                    isCredit ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <TopUpModal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} onSuccess={(amount) => {
        setBalance(prev => prev + amount);
        setShowTopUpModal(false);
      }} />
    </div>
  );
}

function MyListingsTabContent() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-ink">My Listings</h2>
          <p className="mt-1 text-slate-500">Manage your active and draft listings</p>
        </div>
        <div
          onClick={() => window.location.href = '/create-listing'}
          className="cursor-pointer rounded-pill bg-primary px-6 py-2.5 font-bold text-white transition hover:bg-primary-dark"
        >
          + Create new listing
        </div>
      </div>

      <EmptyState
        title="No listings yet"
        subtitle="Create your first listing to start selling on Zyro."
        actionLabel="Create Listing"
        onAction={() => window.location.href = '/create-listing'}
      />
    </div>
  );
}

function TopUpModal({ isOpen, onClose, onSuccess }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];

  async function handleAddFunds() {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`₹${amount.toLocaleString('en-IN')} added to your wallet!`);
      onSuccess(amount);
      setSelectedAmount(null);
      setCustomAmount('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Wallet" maxWidth="sm">
      <div className="space-y-6">
        {/* Quick Select Chips */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Quick Select
          </label>
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((amount) => (
              <div
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={`cursor-pointer rounded-lg border-2 px-4 py-3 text-center font-bold transition ${
                  selectedAmount === amount
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-300 text-slate-700 hover:border-primary/50'
                }`}
              >
                ₹{amount.toLocaleString('en-IN')}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Custom Amount
          </label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="Enter amount"
            min="1"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Add Button */}
        <div
          onClick={handleAddFunds}
          disabled={loading || (!selectedAmount && !customAmount)}
          className={`w-full rounded-pill px-4 py-2.5 text-center font-bold text-white transition ${
            loading || (!selectedAmount && !customAmount)
              ? 'bg-slate-400 cursor-not-allowed'
              : 'cursor-pointer bg-primary hover:bg-primary-dark'
          }`}
        >
          {loading ? 'Adding...' : 'Add to Wallet'}
        </div>
      </div>
    </Modal>
  );
}
