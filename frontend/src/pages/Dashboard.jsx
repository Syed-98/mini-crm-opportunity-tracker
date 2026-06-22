import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import OpportunityCard from '../components/OpportunityCard';
import OpportunityForm from '../components/OpportunityForm';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STAGES = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const Dashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/opportunities');
      setOpportunities(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const stageMatch = stageFilter === 'All' || opp.stage === stageFilter;
      const priorityMatch = priorityFilter === 'All' || opp.priority === priorityFilter;
      return stageMatch && priorityMatch;
    });
  }, [opportunities, stageFilter, priorityFilter]);

  const summary = useMemo(() => {
    const activeStages = ['New', 'Contacted', 'Qualified', 'Proposal Sent'];
    const totalPipeline = opportunities
      .filter((o) => activeStages.includes(o.stage))
      .reduce((sum, o) => sum + (o.estimatedValue || 0), 0);
    const wonValue = opportunities
      .filter((o) => o.stage === 'Won')
      .reduce((sum, o) => sum + (o.estimatedValue || 0), 0);
    const highPriorityCount = opportunities.filter((o) => o.priority === 'High').length;
    return { totalPipeline, wonValue, highPriorityCount };
  }, [opportunities]);

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;

    setDeletingId(id);
    try {
      await api.delete(`/api/opportunities/${id}`);
      toast.success('Opportunity deleted');
      fetchOpportunities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete opportunity');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingOpportunity(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Opportunities</h2>
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            + Add Opportunity
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-md">
            <p className="text-sm font-medium text-gray-500">Total Pipeline Value</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {formatCurrency(summary.totalPipeline)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-md">
            <p className="text-sm font-medium text-gray-500">Won Value</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {formatCurrency(summary.wonValue)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-md">
            <p className="text-sm font-medium text-gray-500">High Priority</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{summary.highPriorityCount}</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                Stage: {s}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                Priority: {p}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="rounded-xl bg-white py-16 text-center shadow-md">
            <p className="text-lg font-medium text-gray-500">No opportunities found</p>
            <p className="mt-2 text-sm text-gray-400">
              {opportunities.length === 0
                ? 'Get started by adding your first opportunity.'
                : 'Try adjusting your filters.'}
            </p>
            {opportunities.length === 0 && (
              <button
                onClick={() => setFormOpen(true)}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Add Opportunity
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                currentUserId={user?._id}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={deletingId === opp._id}
              />
            ))}
          </div>
        )}
      </main>

      <OpportunityForm
        isOpen={formOpen}
        onClose={handleFormClose}
        onSuccess={fetchOpportunities}
        opportunity={editingOpportunity}
      />
    </div>
  );
};

export default Dashboard;
