import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api';
import Button from '../components/common/Button.jsx';
import { PRODUCT_CONDITIONS } from '../utils/constants';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'GOOD',
    transactionType: 'REMOTE',
    locationCity: '',
    locationState: '',
    imageUrls: '',
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        condition: form.condition,
        transactionType: form.transactionType,
        locationCity: form.locationCity,
        locationState: form.locationState,
        negotiable: true,
        imageUrls: form.imageUrls
          .split('\n')
          .map((url) => url.trim())
          .filter(Boolean),
      };
      const product = await productsAPI.createProduct(payload);
      await productsAPI.publishProduct(product.id);
      toast.success('Listing published');
      navigate(`/products/${product.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-shell py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-950">Create listing</h1>
        <p className="text-slate-500">Verified seller listing form</p>
      </div>

      <form className="panel grid gap-5 p-6 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Title</span>
          <input className="input" required value={form.title} onChange={(event) => updateField('title', event.target.value)} />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Price</span>
          <input
            className="input"
            required
            type="number"
            min="1"
            value={form.price}
            onChange={(event) => updateField('price', event.target.value)}
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">Condition</span>
          <select className="input" value={form.condition} onChange={(event) => updateField('condition', event.target.value)}>
            {PRODUCT_CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">City</span>
          <input className="input" value={form.locationCity} onChange={(event) => updateField('locationCity', event.target.value)} />
        </label>

        <label>
          <span className="mb-2 block text-sm font-semibold text-slate-700">State</span>
          <input className="input" value={form.locationState} onChange={(event) => updateField('locationState', event.target.value)} />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Image URLs</span>
          <textarea
            className="input min-h-28"
            placeholder="One image URL per line"
            value={form.imageUrls}
            onChange={(event) => updateField('imageUrls', event.target.value)}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
          <textarea
            className="input min-h-36"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
          />
        </label>

        <div className="md:col-span-2">
          <Button type="submit" loading={saving}>
            Publish Listing
          </Button>
        </div>
      </form>
    </main>
  );
}
