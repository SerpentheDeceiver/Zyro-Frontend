import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Laptop,
  Shirt,
  Home,
  Book,
  Trophy,
  Star,
  Grid3x3,
  X,
  Camera,
} from 'lucide-react';
import { productsAPI } from '../api';
import Button from '../components/common/Button.jsx';
import { PRODUCT_CONDITIONS } from '../utils/constants';

const CATEGORIES = [
  { id: 'Electronics', icon: Laptop, label: 'Electronics' },
  { id: 'Fashion', icon: Shirt, label: 'Fashion' },
  { id: 'Home', icon: Home, label: 'Home' },
  { id: 'Books', icon: Book, label: 'Books' },
  { id: 'Sports', icon: Trophy, label: 'Sports' },
  { id: 'Collectibles', icon: Star, label: 'Collectibles' },
  { id: 'Other', icon: Grid3x3, label: 'Other' },
];

const MAX_IMAGES = 5;
const MAX_DESCRIPTION_LENGTH = 1000;

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [publishing, setPublishing] = useState(false);

  const [form, setForm] = useState({
    title: '',
    price: '',
    condition: 'GOOD',
    category: 'Electronics',
    city: '',
    state: '',
    imageUrls: [''],
    description: '',
  });

  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  }

  function updateImageUrl(index, value) {
    const newUrls = [...form.imageUrls];
    newUrls[index] = value;
    setForm((current) => ({ ...current, imageUrls: newUrls }));
  }

  function addImageUrl() {
    if (form.imageUrls.length < MAX_IMAGES) {
      setForm((current) => ({
        ...current,
        imageUrls: [...current.imageUrls, ''],
      }));
    }
  }

  function removeImageUrl(index) {
    setForm((current) => ({
      ...current,
      imageUrls: current.imageUrls.filter((_, i) => i !== index),
    }));
  }

  function validateStep1() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2() {
    const newErrors = {};
    const validUrls = form.imageUrls.filter((url) => url.trim());
    if (validUrls.length === 0) newErrors.imageUrls = 'At least one image URL is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goToNextStep() {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  }

  function goToPreviousStep() {
    setErrors({});
    setStep(step - 1);
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      const validUrls = form.imageUrls.filter((url) => url.trim());
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        condition: form.condition,
        category: form.category,
        locationCity: form.city,
        locationState: form.state,
        negotiable: true,
        imageUrls: validUrls,
      };
      const product = await productsAPI.createProduct(payload);
      await productsAPI.publishProduct(product.id);
      toast.success('Listing published!');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to publish listing');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="page-shell min-h-screen bg-slate-50 py-8 animate-fade-slide-up">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-ink">Create listing</h1>
          <p className="mt-1 text-slate-500">Multi-step listing form</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <StepProgressBar currentStep={step} />
        </div>

        {/* Content */}
        <div className="rounded-xl bg-white p-8 shadow-soft">
          {step === 1 && (
            <Step1Details
              form={form}
              errors={errors}
              updateField={updateField}
              onNext={goToNextStep}
            />
          )}
          {step === 2 && (
            <Step2ImagesDescription
              form={form}
              errors={errors}
              updateField={updateField}
              updateImageUrl={updateImageUrl}
              addImageUrl={addImageUrl}
              removeImageUrl={removeImageUrl}
              onBack={goToPreviousStep}
              onNext={goToNextStep}
            />
          )}
          {step === 3 && (
            <Step3ReviewPublish
              form={form}
              publishing={publishing}
              onBack={goToPreviousStep}
              onPublish={handlePublish}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function StepProgressBar({ currentStep }) {
  const steps = ['Details', 'Media', 'Review'];

  return (
    <div className="flex items-center justify-between">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="flex flex-1 items-center">
            {/* Circle */}
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

            {/* Label */}
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

            {/* Connector Line */}
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

function Step1Details({ form, errors, updateField, onNext }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Product Details</h2>

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Title *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter product title"
          className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
            errors.title
              ? 'border-rose-500 bg-rose-50'
              : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Price *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-2.5 text-slate-500">₹</span>
          <input
            type="number"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="0"
            min="1"
            className={`w-full rounded-lg border px-4 py-2.5 pl-8 outline-none transition ${
              errors.price
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
            }`}
          />
        </div>
        {errors.price && (
          <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
        )}
      </div>

      {/* Condition */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Condition *
        </label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_CONDITIONS.map((condition) => (
            <div
              key={condition}
              onClick={() => updateField('condition', condition)}
              className={`cursor-pointer rounded-pill border-2 px-4 py-2 font-semibold transition ${
                form.condition === condition
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-primary/50'
              }`}
            >
              {condition.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Category *
        </label>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map(({ id, icon: Icon, label }) => (
            <div
              key={id}
              onClick={() => updateField('category', id)}
              className={`cursor-pointer flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                form.category === id
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 bg-white hover:border-primary/30'
              }`}
            >
              <Icon
                className={`h-6 w-6 ${
                  form.category === id ? 'text-primary' : 'text-slate-400'
                }`}
              />
              <span className="text-center text-xs font-semibold text-slate-700">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* City and State */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            City *
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="Enter city"
            className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
              errors.city
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-rose-500">{errors.city}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            State *
          </label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => updateField('state', e.target.value)}
            placeholder="Enter state"
            className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
              errors.state
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
            }`}
          />
          {errors.state && (
            <p className="mt-1 text-xs text-rose-500">{errors.state}</p>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <div
          onClick={onNext}
          className="flex cursor-pointer items-center gap-2 rounded-pill bg-primary px-6 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
        >
          Next <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function Step2ImagesDescription({
  form,
  errors,
  updateImageUrl,
  addImageUrl,
  removeImageUrl,
  onBack,
  onNext,
}) {
  const validImageCount = form.imageUrls.filter((url) => url.trim()).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Images & Description</h2>

      {/* Image URLs */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Images * ({validImageCount}/{MAX_IMAGES})
        </label>
        <div className="space-y-3">
          {form.imageUrls.map((url, index) => (
            <ImageUrlInput
              key={index}
              url={url}
              index={index}
              onChange={(value) => updateImageUrl(index, value)}
              onRemove={() => removeImageUrl(index)}
              canRemove={form.imageUrls.length > 1}
            />
          ))}
        </div>
        {errors.imageUrls && (
          <p className="mt-2 text-xs text-rose-500">{errors.imageUrls}</p>
        )}

        {form.imageUrls.length < MAX_IMAGES && (
          <div
            onClick={addImageUrl}
            className="mt-3 cursor-pointer text-sm font-semibold text-primary hover:text-primary-dark"
          >
            + Add another image
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Description *
        </label>
        <textarea
          value={form.description}
          onChange={(e) => {
            const value = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH);
            updateField('description', value);
          }}
          placeholder="Describe your product in detail..."
          rows="5"
          className={`w-full resize-none rounded-lg border px-4 py-2.5 outline-none transition ${
            errors.description
              ? 'border-rose-500 bg-rose-50'
              : 'border-slate-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10'
          }`}
        />
        <div className="mt-2 flex justify-between">
          {errors.description && (
            <p className="text-xs text-rose-500">{errors.description}</p>
          )}
          <p className="ml-auto text-xs text-slate-500">
            {form.description.length} / {MAX_DESCRIPTION_LENGTH}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-3 pt-4">
        <div
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 rounded-pill border-2 border-slate-300 px-6 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </div>
        <div
          onClick={onNext}
          className="flex cursor-pointer items-center gap-2 rounded-pill bg-primary px-6 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
        >
          Next <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function ImageUrlInput({ url, index, onChange, onRemove, canRemove }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            onChange(e.target.value);
            setImageError(false);
          }}
          placeholder="Paste image URL (e.g., https://...)"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
        {url.trim() && (
          <div className="mt-2 h-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {imageError ? (
              <div className="flex h-full items-center justify-center gap-2 text-slate-400">
                <Camera className="h-4 w-4" />
                <span className="text-xs">Image unavailable</span>
              </div>
            ) : (
              <img
                src={url}
                alt="Preview"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )}
      </div>

      {canRemove && (
        <div
          onClick={onRemove}
          className="flex cursor-pointer items-center justify-center rounded-lg border border-rose-300 bg-rose-50 px-3 transition hover:bg-rose-100"
        >
          <X className="h-5 w-5 text-rose-600" />
        </div>
      )}
    </div>
  );
}

function Step3ReviewPublish({ form, publishing, onBack, onPublish }) {
  const validImageUrls = form.imageUrls.filter((url) => url.trim());

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Review & Publish</h2>

      {/* Preview Card */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <div className="aspect-video overflow-hidden bg-slate-100">
          {validImageUrls[0] ? (
            <img
              src={validImageUrls[0]}
              alt={form.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <Camera className="h-12 w-12" />
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-ink">{form.title}</h3>
          <p className="mt-2 text-3xl font-black text-primary">
            ₹{Number(form.price).toLocaleString('en-IN')}
          </p>
          <p className="mt-4 text-slate-600">{form.description}</p>
        </div>
      </div>

      {/* Summary Details */}
      <div className="space-y-3 rounded-lg bg-slate-50 p-6">
        <SummaryRow label="Category" value={form.category} />
        <SummaryRow label="Condition" value={form.condition.replace(/_/g, ' ')} />
        <SummaryRow label="Location" value={`${form.city}, ${form.state}`} />
        <SummaryRow label="Images" value={`${validImageUrls.length} image(s)`} />
      </div>

      {/* Publish Section */}
      <div className="space-y-4">
        <div
          onClick={onPublish}
          disabled={publishing}
          className={`w-full rounded-pill px-6 py-3.5 text-center font-bold text-white transition ${
            publishing
              ? 'bg-slate-400 cursor-not-allowed'
              : 'cursor-pointer bg-primary hover:bg-primary-dark'
          }`}
        >
          {publishing ? 'Publishing...' : 'Publish Listing'}
        </div>

        <div
          onClick={onBack}
          className="cursor-pointer text-center text-sm font-semibold text-primary hover:text-primary-dark"
        >
          ← Back to edit
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
