const stageColors = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-purple-100 text-purple-800',
  'Proposal Sent': 'bg-orange-100 text-orange-800',
  Won: 'bg-green-100 text-green-800',
  Lost: 'bg-red-100 text-red-800',
};

const priorityColors = {
  Low: 'bg-gray-100 text-gray-800',
  Medium: 'bg-blue-100 text-blue-800',
  High: 'bg-red-100 text-red-800',
};

const formatCurrency = (value) => {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const OpportunityCard = ({ opportunity, currentUserId, onEdit, onDelete, deleting }) => {
  const isOwner = opportunity.owner?._id === currentUserId;

  return (
    <div className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{opportunity.customerName}</h3>
        <div className="flex flex-shrink-0 gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColors[opportunity.stage]}`}
          >
            {opportunity.stage}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[opportunity.priority]}`}
          >
            {opportunity.priority}
          </span>
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-gray-600">{opportunity.requirement}</p>

      <div className="space-y-1 text-sm text-gray-500">
        <p>
          <span className="font-medium text-gray-700">Value:</span>{' '}
          {formatCurrency(opportunity.estimatedValue)}
        </p>
        <p>
          <span className="font-medium text-gray-700">Next Follow-up:</span>{' '}
          {formatDate(opportunity.nextFollowUpDate)}
        </p>
        <p>
          <span className="font-medium text-gray-700">Created by:</span>{' '}
          {opportunity.owner?.name || 'Unknown'}
        </p>
        <p>
          <span className="font-medium text-gray-700">Created:</span>{' '}
          {formatDate(opportunity.createdAt)}
        </p>
      </div>

      {isOwner && (
        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
          <button
            onClick={() => onEdit(opportunity)}
            className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(opportunity._id)}
            disabled={deleting}
            className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;
