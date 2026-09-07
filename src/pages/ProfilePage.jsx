import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Wallet, Clipboard, Grid3x3, Shield, Settings,
  CheckCircle, TrendingUp, TrendingDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/common/Avatar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import ErrorCard from '../components/common/ErrorCard.jsx';
import { formatDate } from '../utils/format';
import { walletAPI, productsAPI } from '../api';

const SIDEBAR_ITEMS = [
  { id: 'profile',  label: 'Profile',      icon: User },
  { id: 'wallet',   label: 'Wallet',        icon: Wallet },
  { id: 'listings', label: 'My Listings',   icon: Grid3x3 },
  { id: 'orders',   label: 'Orders',        icon: Clipboard },
  { id: 'kyc',      label: 'KYC',           icon: Shield },
  { id: 'settings', label: 'Settings',      icon: Settings },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(user?.walletBalance ?? user?.wallet_balance ?? 0);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const [formErrors, setFormErrors] = useState({});

  function validateProfile() {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2)
      errs.fullName = 'Name must be at least 2 characters';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Please enter a valid email address';
    return errs;
  }

  async function handleSaveProfile() {
    const errs = validateProfile();
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});
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
            <div className="mb-6 text-center">
              <Avatar name={user?.fullName} size="xl" className="mx-auto mb-4" />
              <h2 className="font-bold text-gray-900">{user?.fullName || 'User'}</h2>
              <p className="mt-1 text-sm text-slate-500">{user?.mobile}</p>
              {user?.isVerified ? (
                <div className="mt-3 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle className="h-3 w-3" /> Verified Seller
                </div>
              ) : (
                <div className="mt-3 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  <Settings className="h-3 w-3" /> Pending Verification
                </div>
              )}
            </div>

            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <div
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 font-semibold transition ${
                      isActive
                        ? 'border-l-4 border-indigo-600 bg-indigo-50 pl-3 text-indigo-700'
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

          {/* RIGHT CONTENT */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-soft">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Profile</h2>
                  <p className="mt-1 text-slate-500">
                    Joined {formatDate(user?.createdAt || new Date().toISOString())}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (formErrors.fullName) setFormErrors((p) => ({ ...p, fullName: '' }));
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
                        formErrors.fullName
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                      }`}
                    />
                    {formErrors.fullName && <p className="mt-1 text-xs text-rose-500">{formErrors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors((p) => ({ ...p, email: '' }));
                      }}
                      className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
                        formErrors.email
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                      }`}
                    />
                    {formErrors.email && <p className="mt-1 text-xs text-rose-500">{formErrors.email}</p>}
                  </div>

                  {/* Mobile (read-only) */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Mobile Number <span className="font-normal text-slate-400">(read-only)</span>
                    </label>
                    <input
                      type="text"
                      value={user?.mobile || ''}
                      readOnly
                      className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div
                  onClick={handleSaveProfile}
                  className={`w-full rounded-full px-6 py-2.5 text-center font-bold text-white transition ${
                    loading
                      ? 'cursor-not-allowed bg-slate-400'
                      : 'cursor-pointer bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </div>
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <WalletTabContent balance={walletBalance} setBalance={setWalletBalance} />
            )}

            {/* My Listings Tab */}
            {activeTab === 'listings' && <MyListingsTabContent />}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-black text-gray-900">Orders</h2>
                <EmptyState
                  title="View your orders"
                  subtitle="Go to the Orders page to see all your buying and selling transactions."
                  actionLabel="View Orders"
                  onAction={() => (window.location.href = '/orders')}
                />
              </div>
            )}

            {/* KYC Tab — Coming Soon */}
            {activeTab === 'kyc' && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-black text-gray-900">KYC Verification</h2>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                    <Shield className="h-7 w-7 text-amber-600" />
                  </div>
                  <p className="text-lg font-bold text-amber-800">Coming Soon</p>
                  <p className="mt-1 text-sm text-amber-700">
                    Identity verification will be available in the next release.
                  </p>
                  <span className="mt-4 inline-block rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold text-amber-700">
                    🚀 Coming Soon
                  </span>
                </div>
              </div>
            )}

            {/* Settings Tab — Coming Soon */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in space-y-4">
                <h2 className="text-2xl font-black text-gray-900">Settings</h2>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                    <Settings className="h-7 w-7 text-slate-500" />
                  </div>
                  <p className="text-lg font-bold text-slate-700">Coming Soon</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Account settings and preferences will be available soon.
                  </p>
                  <span className="mt-4 inline-block rounded-full bg-slate-200 px-4 py-1 text-xs font-semibold text-slate-600">
                    🔧 Coming Soon
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function WalletTabContent({ balance, setBalance }) {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    walletAPI.getLedger()
      .then((data) => setTransactions(data.slice(0, 5)))
      .finally(() => setTxLoading(false));
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Wallet</h2>
        <p className="mt-1 text-slate-500">Manage your wallet balance and view transaction history</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 p-8 text-white">
        <p className="text-sm font-semibold opacity-90">Available Balance</p>
        <p className="mt-2 text-4xl font-black">₹{balance.toLocaleString('en-IN')}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <div
          onClick={() => setShowTopUpModal(true)}
          className="flex-1 cursor-pointer rounded-full border-2 border-indigo-600 bg-white px-4 py-2.5 text-center font-bold text-indigo-600 transition hover:bg-indigo-50"
        >
          Top Up
        </div>
        <div
          onClick={() => setShowWithdrawModal(true)}
          className="flex-1 cursor-pointer rounded-full border-2 border-slate-300 bg-white px-4 py-2.5 text-center font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Withdraw
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="mb-4 font-bold text-gray-900">Recent Transactions</h3>
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
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {isCredit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{txn.description}</p>
                      <p className="text-xs text-slate-400">{txn.date}{txn.orderId ? ` · ${txn.orderId}` : ''}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                    {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSuccess={(amount) => {
          setBalance(amount);
          setShowTopUpModal(false);
        }}
      />

      {/* Withdraw Coming Soon Modal */}
      <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} title="Withdraw" maxWidth="sm">
        <div className="space-y-4 text-center">
          <p className="text-4xl">🚀</p>
          <p className="font-bold text-gray-900">Withdraw feature coming soon!</p>
          <p className="text-sm text-slate-500">We are working on bank withdrawals. Stay tuned.</p>
          <div
            onClick={() => setShowWithdrawModal(false)}
            className="cursor-pointer rounded-full bg-indigo-600 px-6 py-2.5 font-bold text-white transition hover:bg-indigo-700"
          >
            Close
          </div>
        </div>
      </Modal>
    </div>
  );
}

function MyListingsTabContent() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadListings() {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getMyListings({ page: 0, size: 20 });
      // Handle pagination response - extract content array
      const items = response?.content || response || [];
      setListings(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">My Listings</h2>
          <p className="mt-1 text-slate-500">Manage your active and draft listings</p>
        </div>
        <div
          onClick={() => (window.location.href = '/create-listing')}
          className="cursor-pointer rounded-full bg-indigo-600 px-6 py-2.5 font-bold text-white transition hover:bg-indigo-700"
        >
          + Create new
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} variant="list-item" />
          ))}
        </div>
      ) : error ? (
        <ErrorCard message={error} onRetry={loadListings} />
      ) : listings.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No listings yet"
          subtitle="Create your first listing to start selling on Zyro."
          actionLabel="Create Listing"
          onAction={() => (window.location.href = '/create-listing')}
        />
      )}
    </div>
  );
}

function TopUpModal({ isOpen, onClose, onSuccess }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customError, setCustomError] = useState('');
  const [loading, setLoading] = useState(false);
  const quickAmounts = [500, 1000, 2000, 5000];

  async function handleAddFunds() {
    const amount = selectedAmount || Number(customAmount);
    if (!amount || amount < 10) {
      setCustomError('Minimum amount is ₹10');
      return;
    }
    if (amount > 50000) {
      setCustomError('Maximum amount is ₹50,000');
      return;
    }
    setCustomError('');
    setLoading(true);
    try {
      const profile = await walletAPI.topUp(amount);
      toast.success(`₹${amount.toLocaleString('en-IN')} added to your wallet!`);
      onSuccess(profile?.walletBalance ?? profile?.wallet_balance ?? amount);
      setSelectedAmount(null);
      setCustomAmount('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Wallet" maxWidth="sm">
      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">Quick Select</label>
          <div className="grid grid-cols-2 gap-3">
            {quickAmounts.map((amount) => (
              <div
                key={amount}
                onClick={() => { setSelectedAmount(amount); setCustomAmount(''); setCustomError(''); }}
                className={`cursor-pointer rounded-lg border-2 px-4 py-3 text-center font-bold transition ${
                  selectedAmount === amount
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-300 text-slate-700 hover:border-indigo-400'
                }`}
              >
                ₹{amount.toLocaleString('en-IN')}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Custom Amount</label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); setCustomError(''); }}
            placeholder="Enter amount (₹10 – ₹50,000)"
            min="10"
            max="50000"
            className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
              customError
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
            }`}
          />
          {customError && <p className="mt-1 text-xs text-rose-500">{customError}</p>}
        </div>

        <div
          onClick={handleAddFunds}
          className={`w-full rounded-full px-4 py-2.5 text-center font-bold text-white transition ${
            loading || (!selectedAmount && !customAmount)
              ? 'cursor-not-allowed bg-slate-400'
              : 'cursor-pointer bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Adding...' : 'Add to Wallet'}
        </div>
      </div>
    </Modal>
  );
}
