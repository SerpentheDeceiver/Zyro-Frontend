import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '../components/common';
import { useAuth } from '../context/AuthContext';

const COUNTRY_OPTIONS = [
  { flag: '🇮🇳', code: '+91',  label: 'India' },
  { flag: '🇺🇸', code: '+1',   label: 'United States' },
  { flag: '🇬🇧', code: '+44',  label: 'United Kingdom' },
  { flag: '🇦🇪', code: '+971', label: 'UAE' },
  { flag: '🇸🇬', code: '+65',  label: 'Singapore' },
  { flag: '🇦🇺', code: '+61',  label: 'Australia' },
  { flag: '🇨🇦', code: '+1',   label: 'Canada' },
  { flag: '🇩🇪', code: '+49',  label: 'Germany' },
];

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('otp');
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const otpRefs = useRef([]);
  const submitGuard = useRef(false);

  const fullMobile = useMemo(() => `${countryCode}${phone}`.replace(/\s+/g, ''), [countryCode, phone]);

  useEffect(() => {
    if (step !== 2 || countdown <= 0) return undefined;
    const timer = setInterval(() => setCountdown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  useEffect(() => {
    if (step !== 2) return;
    const joined = otp.join('');
    if (joined.length !== 6 || submitGuard.current) return;
    submitGuard.current = true;
    void handleVerifyOTP(joined).finally(() => {
      submitGuard.current = false;
    });
    // handleVerifyOTP is defined in the component and intentionally runs only after OTP changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  if (isAuthenticated) return <Navigate to="/home" replace />;

  async function handleSendOTP(event) {
    event.preventDefault();
    if (!phone.trim()) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSendingOtp(true);
    try {
      await sendOTP(fullMobile);
      setStep(2);
      setCountdown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 40);
    } catch {
      toast.error('Unable to send OTP right now');
    } finally {
      setSendingOtp(false);
    }
  }

  async function handleVerifyOTP(otpValue = otp.join('')) {
    if (otpValue.length < 6 || verifyingOtp) return;

    setVerifyingOtp(true);
    try {
      await verifyOTP(fullMobile, otpValue);
      navigate('/home', { replace: true });
    } finally {
      setVerifyingOtp(false);
    }
  }

  function handleOtpChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpPaste(event) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((digit, idx) => {
      next[idx] = digit;
    });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  function handleBackToPhone() {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
    setCountdown(0);
  }

  async function handleResend() {
    if (countdown > 0 || sendingOtp) return;
    setSendingOtp(true);
    try {
      await sendOTP(fullMobile);
      setCountdown(30);
      toast.success('OTP resent');
    } finally {
      setSendingOtp(false);
    }
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-5">
      <section className="relative hidden overflow-hidden bg-ink p-10 text-white lg:col-span-3 lg:flex lg:flex-col lg:justify-between">
        <div className="animate-fade-slide-up">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Escrow Marketplace</p>
          <div className="mt-6 flex items-center gap-4">
            <img src="/src/assets/logo/logo.svg" alt="Zyro Logo" className="h-12 md:h-16 w-auto object-contain brightness-0 invert" />
            <h1 className="text-5xl md:text-6xl font-black leading-none">Zyro</h1>
          </div>
          <p className="mt-6 max-w-xl text-2xl font-semibold leading-tight text-slate-100">
            Buy and sell with money held until delivery
          </p>
        </div>

        <div className="relative mt-10">
          <div className="pointer-events-none absolute -left-20 top-6 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute right-6 top-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="animate-fade-slide-up flex-1 rounded-2xl border border-indigo-200/25 bg-slate-800/75 p-4 shadow-soft">
                <p className="text-xs uppercase tracking-wide text-slate-300">Buyer</p>
                <p className="mt-2 text-lg font-bold">Buy</p>
                <p className="mt-1 text-xs text-slate-300">Place order securely</p>
              </div>

              <ArrowRight className="h-5 w-5 shrink-0 animate-pulse text-slate-400" />

              <div className="animate-fade-slide-up delay-100 flex-1 rounded-2xl border border-amber-200/25 bg-slate-800/75 p-4 shadow-soft">
                <p className="text-xs uppercase tracking-wide text-amber-200">Escrow</p>
                <p className="mt-2 text-lg font-bold">Held</p>
                <p className="mt-1 text-xs text-slate-300">Funds protected in transit</p>
              </div>

              <ArrowRight className="h-5 w-5 shrink-0 animate-pulse text-slate-400" />

              <div className="animate-fade-slide-up delay-200 flex-1 rounded-2xl border border-emerald-200/25 bg-slate-800/75 p-4 shadow-soft">
                <p className="text-xs uppercase tracking-wide text-emerald-200">Seller</p>
                <p className="mt-2 text-lg font-bold">Release</p>
                <p className="mt-1 text-xs text-slate-300">Payment on delivery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-slide-up delay-300 text-sm text-slate-400">
          Trusted peer-to-peer commerce with protected settlements.
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-8 lg:col-span-2">
        <div className="w-full max-w-md">
          <div className="animate-fade-slide-up">
            <h2 className="text-3xl font-black text-ink">Welcome to Zyro</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to buy, sell, and track escrow orders.</p>
          </div>

          <div className="mt-7 grid grid-cols-2 rounded-pill bg-slate-100 p-1 animate-fade-slide-up delay-100">
            <button
              type="button"
              onClick={() => setActiveTab('otp')}
              className={[
                'rounded-pill px-4 py-2 text-sm font-semibold transition',
                activeTab === 'otp' ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              Mobile OTP
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('google')}
              className={[
                'rounded-pill px-4 py-2 text-sm font-semibold transition',
                activeTab === 'google' ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              Continue with Google
            </button>
          </div>

          {activeTab === 'otp' ? (
            <div className="mt-6 animate-fade-slide-up delay-200">
              {step === 1 ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Mobile Number</span>
                    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
                      <select
                        value={countryCode}
                        onChange={(event) => setCountryCode(event.target.value)}
                        className="w-28 border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none"
                      >
                        {COUNTRY_OPTIONS.map((option) => (
                          <option key={`${option.label}-${option.code}`} value={option.code}>
                            {option.flag} {option.code}
                          </option>
                        ))}
                      </select>
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 12))}
                        className="w-full px-4 py-3 text-sm text-ink outline-none"
                        placeholder="9025169190"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        required
                      />
                    </div>
                  </label>

                  <Button type="submit" variant="primary" fullWidth loading={sendingOtp}>
                    Send OTP
                  </Button>
                </form>
              ) : (
                <div className="space-y-5">
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-ink"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <div>
                    <p className="text-sm font-semibold text-slate-700">Enter 6-digit OTP</p>
                    <p className="mt-1 text-xs text-slate-500">Code sent to {fullMobile}</p>
                  </div>

                  <div className="grid grid-cols-6 gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={`otp-${index}`}
                        ref={(node) => {
                          otpRefs.current[index] = node;
                        }}
                        value={digit}
                        onChange={(event) => handleOtpChange(index, event.target.value)}
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        className="h-12 rounded-xl border border-slate-200 text-center text-xl font-bold text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20"
                        inputMode="numeric"
                        maxLength={1}
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={countdown > 0 || sendingOtp}
                      className="font-semibold text-primary transition hover:text-primary-dark disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      Resend OTP
                    </button>
                    <span className="text-slate-500">{countdown > 0 ? `00:${String(countdown).padStart(2, '0')}` : 'Ready'}</span>
                  </div>

                  {verifyingOtp ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Verifying OTP...
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 animate-fade-slide-up delay-200">
              <button
                type="button"
                onClick={() => toast('Google auth coming soon', { icon: '🔐' })}
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">Google sign-in will be enabled in a future release.</p>
            </div>
          )}

          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 animate-fade-slide-up delay-300">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            Secured by Zyro Escrow
          </div>
        </div>
      </section>
    </main>
  );
}
