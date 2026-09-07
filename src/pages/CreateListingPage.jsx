import { useEffect, useState } from 'react';
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
  Upload,
  Loader,
} from 'lucide-react';
import { productsAPI } from '../api';
import { PRODUCT_CONDITIONS } from '../utils/constants';
import { useImageUpload } from '../hooks/useImageUpload';

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

const INDIA_STATES = [
  'Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 'Delhi',
  'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana',
  'West Bengal', 'Bihar', 'Odisha', 'Telangana', 'Andhra Pradesh',
  'Madhya Pradesh', 'Chhattisgarh', 'Assam', 'Jharkhand', 'Uttarakhand',
  'Goa', 'Tripura', 'Manipur', 'Meghalaya', 'Nagaland',
  'Sikkim', 'Arunachal Pradesh', 'Puducherry', 'Chandigarh',
  'Andaman & Nicobar', 'Ladakh', 'Lakshadweep',
];

const INDIA_DISTRICTS = {
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Erode', 'Vellore'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Thane', 'Solapur', 'Kolhapur'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi', 'Ballari', 'Shivamogga', 'Dharwad'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Saket', 'Lajpat Nagar', 'Janakpuri', 'Pitampura', 'Connaught Place'],
  'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Rangareddy'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kannur', 'Kollam', 'Palakkad', 'Alappuzha'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Junagadh'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Kharagpur', 'Haldia'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bharatpur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Ghaziabad', 'Meerut', 'Noida'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot'],
  'Haryana': ['Gurugram', 'Faridabad', 'Ambala', 'Rohtak', 'Hisar', 'Karnal', 'Panipat', 'Sonipat'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Rewa', 'Satna', 'Sagar'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Ara', 'Begusarai'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur', 'Puri', 'Balasore', 'Baripada'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  'Chandigarh': ['Chandigarh'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Calangute', 'Canacona', 'Bicholim'],
};

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
    if (!form.title.trim() || form.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Please enter a valid price';
    if (!form.city.trim()) newErrors.city = 'Please select a city';
    if (!form.state.trim()) newErrors.state = 'Please select a state';
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
    } catch {
      toast.error('Failed to publish listing');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="page-shell min-h-screen bg-slate-50 py-8 animate-fade-slide-up">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-ink">Create listing</h1>
          <p className="mt-1 text-slate-500">Fill in the details to list your item</p>
        </div>

        <div className="mb-8">
          <StepProgressBar currentStep={step} />
        </div>

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
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                    ? 'bg-indigo-600 text-white'
                    : 'border-2 border-slate-300 text-slate-400'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : stepNumber}
            </div>

            <span
              className={`ml-2 text-sm font-semibold ${
                isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-slate-400'
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

function Step1Details({ form, errors, updateField, onNext }) {
  const districts = INDIA_DISTRICTS[form.state] || [];

  useEffect(() => {
    if (form.state) updateField('city', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.state]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Product Details</h2>

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter product title (min 5 characters)"
          className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
            errors.title
              ? 'border-rose-500 bg-rose-50'
              : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
          }`}
        />
        {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
      </div>

      {/* Price */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Price *</label>
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
                : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
            }`}
          />
        </div>
        {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
      </div>

      {/* Condition */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">Condition *</label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_CONDITIONS.map((condition) => (
            <div
              key={condition}
              onClick={() => updateField('condition', condition)}
              className={`cursor-pointer rounded-full border-2 px-4 py-2 font-semibold transition ${
                form.condition === condition
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400'
              }`}
            >
              {condition.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">Category *</label>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map(({ id, icon: Icon, label }) => (
            <div
              key={id}
              onClick={() => updateField('category', id)}
              className={`cursor-pointer flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition ${
                form.category === id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <Icon className={`h-6 w-6 ${form.category === id ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="text-center text-xs font-semibold text-slate-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* State and City Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">State *</label>
          <select
            value={form.state}
            onChange={(e) => updateField('state', e.target.value)}
            className={`w-full rounded-lg border px-4 py-2.5 outline-none transition bg-white ${
              errors.state
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
            }`}
          >
            <option value="">Select state</option>
            {INDIA_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="mt-1 text-xs text-rose-500">{errors.state}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">City / District *</label>
          {districts.length > 0 ? (
            <select
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              className={`w-full rounded-lg border px-4 py-2.5 outline-none transition bg-white ${
                errors.city
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
              }`}
            >
              <option value="">Select city</option>
              {districts.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder={form.state ? 'Enter city' : 'Select state first'}
              disabled={!form.state}
              className={`w-full rounded-lg border px-4 py-2.5 outline-none transition ${
                errors.city
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400'
              }`}
            />
          )}
          {errors.city && <p className="mt-1 text-xs text-rose-500">{errors.city}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <div
          onClick={onNext}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
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
  updateField,
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
            <ImageUploadInput
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
            className="mt-3 cursor-pointer text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            + Add another image
          </div>
        )}
      </div>

      {/* Description — controlled via updateField prop */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => {
            const value = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH);
            updateField('description', value);
          }}
          placeholder="Describe your product — condition details, reason for selling, included accessories, etc."
          rows={5}
          className={`w-full resize-none rounded-lg border px-4 py-2.5 outline-none transition ${
            errors.description
              ? 'border-rose-500 bg-rose-50'
              : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
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

      <div className="flex justify-between gap-3 pt-4">
        <div
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-slate-300 px-6 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </div>
        <div
          onClick={onNext}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
        >
          Next <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function ImageUploadInput({ url, index, onChange, onRemove, canRemove }) {
  const { uploading, error, uploadImage, clearError } = useImageUpload();
  const [imageError, setImageError] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      clearError();
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(error || 'Failed to upload image');
      }
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1 space-y-2">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={`image-upload-${index}`}
          />
          <label
            htmlFor={`image-upload-${index}`}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-8 transition hover:border-indigo-500 hover:bg-indigo-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader className="h-5 w-5 animate-spin text-indigo-600" />
                <span className="text-sm font-semibold text-slate-600">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 text-slate-400" />
                <div className="text-center">
                  <span className="text-sm font-semibold text-slate-700">Upload image</span>
                  <p className="text-xs text-slate-500">or paste URL below</p>
                </div>
              </>
            )}
          </label>
        </div>

        {error && <p className="text-xs text-rose-500">{error}</p>}

        {/* Fallback URL input for manual entry */}
        {!url && (
          <input
            type="url"
            placeholder="Or paste image URL (e.g., https://...)"
            onChange={(e) => {
              onChange(e.target.value);
              setImageError(false);
            }}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
          />
        )}

        {/* Image preview */}
        {url.trim() && (
          <div className="h-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
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

      {canRemove && url && (
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
  const shortDesc = form.description.length > 100
    ? `${form.description.slice(0, 100)}...`
    : form.description;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-ink">Review & Publish</h2>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <div className="aspect-video overflow-hidden bg-slate-100">
          {validImageUrls[0] ? (
            <img
              src={validImageUrls[0]}
              alt={form.title}
              className="h-full w-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <Camera className="h-12 w-12" />
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-ink">{form.title}</h3>
          <p className="mt-2 text-3xl font-black text-indigo-600">
            ₹{Number(form.price).toLocaleString('en-IN')}
          </p>
          {shortDesc && (
            <p className="mt-3 text-sm text-slate-600">{shortDesc}</p>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-lg bg-slate-50 p-6">
        <SummaryRow label="Category" value={form.category} />
        <SummaryRow label="Condition" value={form.condition.replace(/_/g, ' ')} />
        <SummaryRow label="Location" value={[form.city, form.state].filter(Boolean).join(', ') || '—'} />
        <SummaryRow label="Images" value={`${validImageUrls.length} image(s)`} />
      </div>

      <div className="space-y-3">
        <div
          onClick={!publishing ? onPublish : undefined}
          className={`w-full rounded-full px-6 py-3.5 text-center font-bold text-white transition ${
            publishing
              ? 'bg-slate-400 cursor-not-allowed'
              : 'cursor-pointer bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {publishing ? 'Publishing...' : 'Publish Listing'}
        </div>

        <div
          onClick={onBack}
          className="cursor-pointer text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
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
