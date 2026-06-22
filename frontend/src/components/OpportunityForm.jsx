import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const emptyForm = {
  customerName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  requirement: '',
  estimatedValue: '',
  stage: 'New',
  priority: 'Medium',
  nextFollowUpDate: '',
  notes: '',
};

const OpportunityForm = ({ isOpen, onClose, onSuccess, opportunity }) => {
  const isEdit = Boolean(opportunity);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (opportunity) {
      setForm({
        customerName: opportunity.customerName || '',
        contactName: opportunity.contactName || '',
        contactEmail: opportunity.contactEmail || '',
        contactPhone: opportunity.contactPhone || '',
        requirement: opportunity.requirement || '',
        estimatedValue: opportunity.estimatedValue ?? '',
        stage: opportunity.stage || 'New',
        priority: opportunity.priority || 'Medium',
        nextFollowUpDate: opportunity.nextFollowUpDate
          ? new Date(opportunity.nextFollowUpDate).toISOString().split('T')[0]
          : '',
        notes: opportunity.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [opportunity, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = {
      ...form,
      estimatedValue: form.estimatedValue === '' ? undefined : Number(form.estimatedValue),
      nextFollowUpDate: form.nextFollowUpDate || undefined,
    };

    try {
      if (isEdit) {
        await api.put(`/api/opportunities/${opportunity._id}`, payload);
        toast.success('Opportunity updated');
      } else {
        await api.post('/api/opportunities', payload);
        toast.success('Opportunity created');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      toast.error(message);
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.path] = e.msg;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Opportunity' : 'Add Opportunity'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Customer Name *
            </label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Contact Phone</label>
              <input
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Requirement *</label>
            <textarea
              name="requirement"
              value={form.requirement}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            {errors.requirement && (
              <p className="mt-1 text-sm text-red-500">{errors.requirement}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Estimated Value (₹)
              </label>
              <input
                name="estimatedValue"
                type="number"
                min="0"
                value={form.estimatedValue}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.estimatedValue && (
                <p className="mt-1 text-sm text-red-500">{errors.estimatedValue}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Next Follow-up Date
              </label>
              <input
                name="nextFollowUpDate"
                type="date"
                value={form.nextFollowUpDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Stage</label>
              <select
                name="stage"
                value={form.stage}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : isEdit ? (
                'Update'
              ) : (
                'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityForm;
