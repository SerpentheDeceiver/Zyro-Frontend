import { useState } from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSendOTP(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await sendOTP(mobile);
      setOtpSent(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(mobile, otp);
      navigate(redirectTo, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_0.85fr]">
      <section className="hidden bg-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="inline-flex items-center gap-3 text-sm font-semibold">
          <ArrowLeft size={18} />
          <img src="/src/assets/logo/logo.svg" alt="Zyro Logo" className="h-8 w-auto object-contain brightness-0 invert" />
          <span className="text-xl font-semibold">Zyro</span>
        </Link>
        <div>
          <h1 className="max-w-xl text-5xl font-black leading-tight">Trade peer-to-peer with escrow built in.</h1>
          <p className="mt-5 max-w-lg text-lg text-indigo-100">A focused marketplace for buying, selling, wallet, orders, and chat.</p>
        </div>
        <div className="text-sm text-indigo-100">API Gateway: http://localhost:8080/api/v1</div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 lg:hidden">
            <ArrowLeft size={18} />
            Back
          </Link>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Phone size={24} />
          </div>
          <h2 className="mt-5 text-3xl font-black text-slate-950">Login with OTP</h2>
          <p className="mt-2 text-sm text-slate-600">Enter your mobile number and 6-digit OTP.</p>

          <form className="mt-8 space-y-4" onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Mobile number</span>
              <input
                className="input"
                placeholder="+919876543210"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                required
              />
            </label>

            {otpSent && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">OTP</span>
                <input
                  className="input tracking-[0.35em]"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                />
              </label>
            )}

            <Button className="w-full" loading={loading}>
              {otpSent ? 'Verify OTP' : 'Send OTP'}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
