import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Store,
  Shield,
  Star,
  Wallet,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Upload,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const ID_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Voter ID'];

export default function KYCPage() {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    dateOfBirth: '',
    gender: '',
    address: '',
    idType: 'Aadhaar',
    idFront: null,
    idBack: null,
    selfie: null,
    confirmAccuracy: false,
  });

  const [errors, setErrors] = useState({});
  const [previews, setPreviews] = useState({
    idFront: null,
    idBack: null,
    selfie: null,
  });

  // Already verified state
  if (user?.role === 'SELLER' && user?.isVerified) {
    return <VerifiedSellerState user={user} />;
  }

  // Not a seller - show upgrade flow
  if (user?.role !== 'SELLER') {
    if (!showForm) {
      return (
        <SellerUpgradeFlow
          onUpgradeClick={() => setShowForm(true)}
        />
      );
    }
  }

  // Verification form
  if (submitted) {
    return (
      <SubmissionSuccessState />
    );
  }

  return (
    <main className="page-shell min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-ink">Identity Verification</h1>
          <p className="mt-1 text-slate-500">Complete your seller profile</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <StepProgressBar currentStep={step} />
        </div>

        {/* Content */}
        <div className="rounded-xl bg-white p-8 shadow-soft">
          {step === 1 && (
            <Step1PersonalInfo
              form={form}
              errors={errors}
              setForm={setForm}
              setErrors={setErrors}
              onNext={() => validateStep1() && setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2DocumentUpload
              form={form}
              errors={errors}
              setForm={setForm}
              setErrors={setErrors}
              previews={previews}
              setPreviews={setPreviews}
              onBack={() => setStep(1)}
              onNext={() => validateStep2() && setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3ReviewSubmit
              form={form}
              setForm={setForm}
              errors={errors}
              setErrors={setErrors}
              publishing={publishing}
              onBack={() => setStep(2)}
              onSubmit={() => handleSubmit()}
            />
          )}
        </div>
      </div>
    </main>
  );

  function validateStep1() {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2() {
    const newErrors = {};
    if (!form.idFront) newErrors.idFront = 'Front of document is required';
    if (!form.idBack) newErrors.idBack = 'Back of document is required';
    if (!form.selfie) newErrors.selfie = 'Selfie is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!form.confirmAccuracy) {
      setErrors({ confirmAccuracy: 'Please confirm accuracy' });
      return;
    }
    setPublishing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Application submitted!');
      setSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setPublishing(false);
    }
  }
}

function VerifiedSellerState({ user }) {
  return (
    <main className="page-shell min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-12 shadow-soft text-center">
          {/* Checkmark Animation */}
          <div className="mb-8 flex justify-center">
            <svg
              className="h-24 w-24 animate-checkmark"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="4" />
              <path
                d="M30 50 L45 65 L70 35"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="100"
                strokeDashoffset="0"
                className="animate-checkmark-mark"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-black text-ink mb-3">
            You&apos;re a verified seller on Zyro
          </h1>

          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-700 mb-2">
              <span className="font-semibold">Verification Date:</span> {new Date(user?.verifiedAt || Date.now()).toLocaleDateString()}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Seller ID:</span> {user?.sellerId || 'SLR-' + Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/my-listings'}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-pill bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            View my listings <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* CSS for checkmark animation */}
      <style>{`
        @keyframes checkmark {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes checkmark-mark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-checkmark {
          animation: checkmark 0.8s ease-out;
        }
        
        .animate-checkmark-mark {
          animation: checkmark-mark 0.6s ease-out 0.2s forwards;
        }
      `}</style>
    </main>
  );
}

function SellerUpgradeFlow({ onUpgradeClick }) {
  const benefits = [
    {
      icon: Shield,
      title: 'Escrow Protection',
      description: 'Secure transactions with escrow protection',
    },
    {
      icon: Star,
      title: 'Build Trust',
      description: 'Verified seller badge increases credibility',
    },
    {
      icon: Wallet,
      title: 'Get Paid Fast',
      description: 'Quick withdrawals to your bank account',
    },
  ];

  return (
    <main className="page-shell min-h-screen bg-gradient-to-br from-primary/5 to-blue-50 py-12">
      <div className="mx-auto max-w-5xl px-4">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Store className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-ink mb-3">
            Start selling on Zyro
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Unlock seller features and reach thousands of buyers
          </p>

          {/* Benefits Grid */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-lg bg-white p-6 shadow-soft border border-slate-200 transition hover:shadow-md"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <button
            onClick={onUpgradeClick}
            className="flex cursor-pointer items-center justify-center gap-2 mx-auto rounded-pill bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            Upgrade to Seller <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

function StepProgressBar({ currentStep }) {
  const steps = ['Personal Info', 'Documents', 'Review'];

  return (
    <div className="flex items-center justify-between">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="flex flex-1 items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                    ? 'bg-primary text-white'
                    : 'border-2 border-slate-300 text-slate-400'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                stepNumber
              )}
            </div>

            <span
              className={`ml-2 text-sm font-semibold ${
                isActive
                  ? 'text-primary'
                  : isCompleted
                    ? 'text-green-600'
                    : 'text-slate-400'
              }`}
            >
              {label}
            </span>

            {stepNumber < steps.length && (
              <div
                className={`mx-4 flex-1 h-1 transition-colors ${
                  isCompleted ? 'bg-green-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1PersonalInfo({ form, errors, setForm, setErrors, onNext }) {
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Personal Information</h2>

      {/* Full Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name *
        </label>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => updateField('fullName', e.target.value)}
          placeholder="Enter your full name"
          className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
            errors.fullName
              ? 'border-rose-500 bg-rose-50'
              : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
          }`}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Date of Birth *
        </label>
        <input
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => updateField('dateOfBirth', e.target.value)}
          className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
            errors.dateOfBirth
              ? 'border-rose-500 bg-rose-50'
              : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
          }`}
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-xs text-rose-500">{errors.dateOfBirth}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Gender *
        </label>
        <div className="flex gap-3">
          {['Male', 'Female', 'Other'].map((option) => (
            <button
              key={option}
              onClick={() => updateField('gender', option)}
              className={`rounded-pill border-2 px-6 py-2 font-semibold transition cursor-pointer ${
                form.gender === option
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-primary/50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {errors.gender && (
          <p className="mt-1 text-xs text-rose-500">{errors.gender}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Address *
        </label>
        <textarea
          value={form.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="Enter your full address"
          rows="4"
          className={`w-full rounded-lg border px-4 py-2.5 outline-none transition resize-none ${
            errors.address
              ? 'border-rose-500 bg-rose-50'
              : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          className="flex cursor-pointer items-center gap-2 rounded-pill bg-primary px-6 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Step2DocumentUpload({
  form,
  errors,
  setForm,
  setErrors,
  previews,
  setPreviews,
  onBack,
  onNext,
}) {
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  const handleFileSelect = (field, file) => {
    if (file) {
      updateField(field, file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((current) => ({
          ...current,
          [field]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (field) => {
    updateField(field, null);
    setPreviews((current) => ({ ...current, [field]: null }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Identity Verification</h2>

      {/* ID Type Selector */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Document Type *
        </label>
        <div className="flex flex-wrap gap-2">
          {ID_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => updateField('idType', type)}
              className={`rounded-pill border-2 px-4 py-2 font-semibold transition cursor-pointer ${
                form.idType === type
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-primary/50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Front of Document Upload */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Front of {form.idType} *
        </label>
        <UploadZone
          label="Click to upload or drag & drop"
          preview={previews.idFront}
          onFileSelect={(file) => handleFileSelect('idFront', file)}
          onClear={() => clearFile('idFront')}
          error={errors.idFront}
        />
        {errors.idFront && (
          <p className="mt-1 text-xs text-rose-500">{errors.idFront}</p>
        )}
      </div>

      {/* Back of Document Upload */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Back of {form.idType} *
        </label>
        <UploadZone
          label="Click to upload or drag & drop"
          preview={previews.idBack}
          onFileSelect={(file) => handleFileSelect('idBack', file)}
          onClear={() => clearFile('idBack')}
          error={errors.idBack}
        />
        {errors.idBack && (
          <p className="mt-1 text-xs text-rose-500">{errors.idBack}</p>
        )}
      </div>

      {/* Selfie Upload */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Selfie *
        </label>
        <UploadZone
          label="Click to upload or drag & drop"
          preview={previews.selfie}
          onFileSelect={(file) => handleFileSelect('selfie', file)}
          onClear={() => clearFile('selfie')}
          error={errors.selfie}
        />
        {errors.selfie && (
          <p className="mt-1 text-xs text-rose-500">{errors.selfie}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 rounded-pill border-2 border-slate-300 px-6 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onNext}
          className="flex cursor-pointer items-center gap-2 rounded-pill bg-primary px-6 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function UploadZone({ label, preview, onFileSelect, onClear, error }) {
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFileSelect(e.target.files[0])}
        className="hidden"
        id={`upload-${Math.random()}`}
      />
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-green-300 bg-green-50">
          <img src={preview} alt="Preview" className="h-40 w-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <button
            onClick={onClear}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-slate-700 hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={`upload-${Math.random()}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition ${
            error
              ? 'border-rose-300 bg-rose-50'
              : 'border-slate-300 bg-slate-50 hover:border-primary/50'
          }`}
        >
          <Upload className="mb-2 h-6 w-6 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          <span className="text-xs text-slate-500">PNG, JPG up to 10MB</span>
        </label>
      )}
    </div>
  );
}

function Step3ReviewSubmit({
  form,
  setForm,
  errors,
  setErrors,
  publishing,
  onBack,
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Review & Submit</h2>

      {/* Information Summary */}
      <div className="rounded-lg bg-slate-50 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500">Full Name</span>
            <p className="text-sm text-ink font-semibold">{form.fullName}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Date of Birth</span>
            <p className="text-sm text-ink font-semibold">{form.dateOfBirth}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Gender</span>
            <p className="text-sm text-ink font-semibold">{form.gender}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">ID Type</span>
            <p className="text-sm text-ink font-semibold">{form.idType}</p>
          </div>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500">Address</span>
          <p className="text-sm text-ink font-semibold">{form.address}</p>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="confirm"
          checked={form.confirmAccuracy}
          onChange={(e) => {
            setForm((current) => ({ ...current, confirmAccuracy: e.target.checked }));
            if (errors.confirmAccuracy) {
              setErrors((current) => ({ ...current, confirmAccuracy: '' }));
            }
          }}
          className="mt-1 h-4 w-4 rounded border-slate-300 accent-primary"
        />
        <label htmlFor="confirm" className="text-sm text-slate-700">
          I confirm that all the information provided above is accurate and true.
        </label>
      </div>
      {errors.confirmAccuracy && (
        <p className="text-xs text-rose-500">{errors.confirmAccuracy}</p>
      )}

      {/* Submit Button */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          disabled={publishing}
          className="flex cursor-pointer items-center gap-2 rounded-pill border-2 border-slate-300 px-6 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={publishing}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-pill bg-primary px-8 py-2.5 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          {publishing ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit for Verification'
          )}
        </button>
      </div>
    </div>
  );
}

function SubmissionSuccessState() {
  const confettiPieces = Array.from({ length: 50 });

  return (
    <main className="page-shell min-h-screen bg-gradient-to-br from-primary/5 to-blue-50 py-12 relative overflow-hidden">
      {/* Confetti Animation */}
      {confettiPieces.map((_, i) => (
        <div
          key={i}
          className="fixed pointer-events-none animate-confetti"
          style={{
            left: Math.random() * 100 + '%',
            top: -10,
            animation: `confetti ${2 + Math.random() * 1}s ease-out forwards`,
            animationDelay: Math.random() * 0.3 + 's',
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][
              Math.floor(Math.random() * 5)
            ],
            width: 8 + Math.random() * 8 + 'px',
            height: 8 + Math.random() * 8 + 'px',
          }}
        />
      ))}

      <div className="mx-auto max-w-2xl relative z-10">
        <div className="rounded-xl bg-white p-12 shadow-soft text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <svg
              className="h-24 w-24 animate-checkmark"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="4" />
              <path
                d="M30 50 L45 65 L70 35"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="100"
                strokeDashoffset="0"
                className="animate-checkmark-mark"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-black text-ink mb-3">
            Application Submitted!
          </h1>

          <p className="text-lg text-slate-600 mb-8">
            We&apos;ll verify your details within 24 hours. You&apos;ll be notified once your seller account is activated.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-700">
              ✓ Application received and queued for review
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/home'}
            className="flex cursor-pointer items-center justify-center gap-2 mx-auto rounded-pill bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary-dark"
          >
            Back to Home <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes checkmark {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes checkmark-mark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes confetti {
          0% {
            opacity: 1;
            transform: translateY(0) rotateZ(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotateZ(360deg);
          }
        }
        
        .animate-checkmark {
          animation: checkmark 0.8s ease-out;
        }
        
        .animate-checkmark-mark {
          animation: checkmark-mark 0.6s ease-out 0.2s forwards;
        }
        
        .animate-confetti {
          animation: confetti 2s ease-out;
        }
      `}</style>
    </main>
  );
}
