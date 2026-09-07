import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Lock,
  Globe,
  AlertTriangle,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    escrowAlerts: true,
    chatMessages: true,
    promotions: false,
  });

  const [email, setEmail] = useState(user?.email || '');
  const [emailEditing, setEmailEditing] = useState(false);

  const [changeMobileModal, setChangeMobileModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success('Preference saved', { duration: 2000 });
      return updated;
    });
  };

  const handleEmailSave = () => {
    if (!email.trim()) {
      toast.error('Email cannot be empty');
      return;
    }
    toast.success('Email updated!');
    setEmailEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    try {
      await logout();
      toast.success('Account deletion requested');
      navigate('/auth');
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setDeleteAccountModal(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <main className="page-shell min-h-screen bg-slate-50 py-8 animate-fade-slide-up">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-ink">Settings</h1>
          <p className="mt-1 text-slate-500">Manage your account and preferences</p>
        </div>

        {/* Account Settings */}
        <SettingsCard title="Account Settings">
          {/* Change Mobile Number */}
          <SettingsRow
            label="Change Mobile Number"
            value={user?.mobile || 'Not set'}
            action={() => setChangeMobileModal(true)}
            actionLabel="Change"
          />

          {/* Change Email */}
          <SettingsRow
            label="Change Email"
            action={() => setEmailEditing(!emailEditing)}
            actionLabel={emailEditing ? 'Cancel' : 'Edit'}
            custom={
              emailEditing && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter new email"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button
                    onClick={handleEmailSave}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Save
                  </button>
                </div>
              )
            }
            value={!emailEditing ? user?.email : undefined}
          />

          {/* Linked Accounts */}
          <SettingsRow
            label="Linked Accounts"
            value="Google: Not connected"
            action={() => toast.success('Coming soon')}
            actionLabel="Connect"
          />
        </SettingsCard>

        {/* Notifications Preferences */}
        <SettingsCard title="Notifications">
          <NotificationToggle
            icon={Bell}
            label="Order Updates"
            value={notifications.orderUpdates}
            onChange={() => handleNotificationToggle('orderUpdates')}
          />
          <NotificationToggle
            icon={Lock}
            label="Escrow Alerts"
            value={notifications.escrowAlerts}
            onChange={() => handleNotificationToggle('escrowAlerts')}
          />
          <NotificationToggle
            icon={Mail}
            label="Chat Messages"
            value={notifications.chatMessages}
            onChange={() => handleNotificationToggle('chatMessages')}
          />
          <NotificationToggle
            icon={Globe}
            label="Promotional & Platform Updates"
            value={notifications.promotions}
            onChange={() => handleNotificationToggle('promotions')}
          />
        </SettingsCard>

        {/* Privacy & Security */}
        <SettingsCard title="Privacy & Security">
          <SettingsRow
            label="Two-factor Authentication"
            value={<span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">Coming soon</span>}
            hideAction
          />

          <SettingsRow
            label="Data & Privacy"
            action={() => window.open('https://zyro.example.com/privacy', '_blank')}
            actionLabel={<ExternalLink className="h-4 w-4" />}
          />

          <SettingsRow
            label="Delete Account"
            value={<span className="text-rose-600 font-semibold">Permanent</span>}
            action={() => setDeleteAccountModal(true)}
            actionLabel="Delete"
            isRed
          />
        </SettingsCard>

        {/* App Preferences */}
        <SettingsCard title="App Preferences">
          <SettingsRow
            label="Language"
            value={
              <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option>English</option>
              </select>
            }
            hideAction
          />

          <SettingsRow
            label="Currency Display"
            value={<span className="font-semibold text-slate-700">₹ INR</span>}
            hideAction
            isDisabled
          />
        </SettingsCard>

        {/* About */}
        <SettingsCard title="About">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">App Version</span>
              <span className="font-semibold text-ink">v0.1.0 (MVP)</span>
            </div>

            <div className="border-t border-slate-200 pt-3 flex gap-4">
              <a
                href="https://zyro.example.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Terms of Service <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://zyro.example.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Privacy Policy <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <a
                href="mailto:support@zyro.example.com"
                className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
              >
                Contact Support
              </a>
            </div>
          </div>
        </SettingsCard>
      </div>

      {/* Modals */}
      <ChangeMobileModal
        isOpen={changeMobileModal}
        onClose={() => setChangeMobileModal(false)}
        currentMobile={user?.mobile}
      />

      <DeleteAccountModal
        isOpen={deleteAccountModal}
        onClose={() => {
          setDeleteAccountModal(false);
          setDeleteConfirmText('');
        }}
        confirmText={deleteConfirmText}
        setConfirmText={setDeleteConfirmText}
        onConfirm={handleDeleteAccount}
      />
    </main>
  );
}

function SettingsCard({ title, children }) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingsRow({
  label,
  value,
  action,
  actionLabel,
  custom,
  hideAction,
  isRed,
  isDisabled,
}) {
  return (
    <div className={`flex items-center justify-between ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${isRed ? 'text-rose-600' : 'text-slate-700'}`}>
          {label}
        </p>
        {value && !custom && (
          <p className="mt-0.5 text-xs text-slate-500">{value}</p>
        )}
        {custom}
      </div>
      {!hideAction && (
        <button
          onClick={action}
          disabled={isDisabled}
          className={`ml-4 px-4 py-2 rounded-lg font-semibold text-sm transition whitespace-nowrap ${
            isRed
              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-50'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50'
          }`}
        >
          {typeof actionLabel === 'string' ? actionLabel : actionLabel}
        </button>
      )}
    </div>
  );
}

function NotificationToggle({ icon: Icon, label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <button
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? 'bg-green-500' : 'bg-slate-300'
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function ChangeMobileModal({ isOpen, onClose, currentMobile }) {
  const [step, setStep] = useState('input');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = () => {
    if (!mobile.trim()) {
      toast.error('Please enter a mobile number');
      return;
    }
    toast.success('OTP sent!');
    setStep('verify');
  };

  const handleVerifyOTP = () => {
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }
    toast.success('Mobile number updated!');
    onClose();
    setStep('input');
    setMobile('');
    setOtp('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-ink mb-4">Change Mobile Number</h2>
        <p className="text-sm text-slate-600 mb-4">
          Current: <span className="font-semibold">{currentMobile}</span>
        </p>

        {step === 'input' && (
          <>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter new mobile number"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border-2 border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendOTP}
                className="flex-1 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-dark"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 mb-4"
              maxLength="6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep('input');
                  setOtp('');
                }}
                className="flex-1 rounded-lg border-2 border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={handleVerifyOTP}
                className="flex-1 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-dark"
              >
                Verify
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DeleteAccountModal({ isOpen, onClose, confirmText, setConfirmText, onConfirm }) {
  if (!isOpen) return null;

  const canDelete = confirmText === 'DELETE';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl border-2 border-rose-300 bg-white p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-rose-100 p-3">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-ink mb-2 text-center">Delete Account</h2>
        <p className="text-sm text-slate-600 mb-4 text-center">
          This action is irreversible. All your data will be permanently deleted.
        </p>

        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
          ⚠️ You will lose access to all your listings, purchases, and wallet balance.
        </div>

        <p className="text-xs font-semibold text-slate-600 mb-2">
          Type &quot;DELETE&quot; to confirm:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
          placeholder="Type DELETE"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 mb-4 font-mono"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border-2 border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canDelete}
            className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
