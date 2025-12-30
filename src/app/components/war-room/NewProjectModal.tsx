import React, { useState } from 'react';
import { X, Calendar, Users, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (projectData: any) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    districtName: '',
    type: 'field-gotv',
    startDate: '',
    endDate: '',
    description: '',
    budget: '',
    owners: [] as string[],
  });

  const projectTypes = [
    { value: 'field-gotv', label: 'Field / GOTV' },
    { value: 'candidate-launch', label: 'Candidate Launch' },
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'persuasion-digital', label: 'Persuasion Digital' },
    { value: 'mail', label: 'Mail Program' },
    { value: 'debate-prep', label: 'Debate Prep' },
    { value: 'ballot-chase', label: 'Ballot Chase' },
    { value: 'custom', label: 'Custom' },
  ];

  const availableOwners = [
    { id: 'pm-001', name: 'Project Manager' },
    { id: 'field-001', name: 'Field Lead' },
    { id: 'digital-001', name: 'Digital Lead' },
    { id: 'consultant-001', name: 'Consultant' },
    { id: 'compliance-001', name: 'Compliance Officer' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  const toggleOwner = (ownerId: string) => {
    if (formData.owners.includes(ownerId)) {
      setFormData({
        ...formData,
        owners: formData.owners.filter(id => id !== ownerId),
      });
    } else {
      setFormData({
        ...formData,
        owners: [...formData.owners, ownerId],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-gray-900 mb-2">Create New Project</h2>
              <p className="text-sm text-gray-600">
                Start a blank campaign project from scratch
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CA-45 GOTV Program"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., AmMaj"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CA-45"
                      value={formData.districtName}
                      onChange={(e) => setFormData({ ...formData, districtName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of project goals and scope..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={18} />
                Timeline
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Budget */}
            <div>
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={18} />
                Budget
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Team Assignment */}
            <div>
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Users size={18} />
                Team Assignment
              </h3>
              <div className="space-y-2">
                {availableOwners.map((owner) => (
                  <label
                    key={owner.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={formData.owners.includes(owner.id)}
                      onChange={() => toggleOwner(owner.id)}
                    />
                    <span className="text-sm font-medium text-gray-900">{owner.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Project will start in the "Drafting" stage
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};