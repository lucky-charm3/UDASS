import { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaSpinner, 
  FaPaperclip,
  FaCalendarAlt,
  FaTag
} from 'react-icons/fa';
import Modal from './Modal';
import { useCreateAnnouncement, useUpdateAnnouncement } from '../queries/announcementsQuery';

export default function AnnouncementModal({ announcement, onClose }) {
  const isEditing = !!announcement;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    expiresAt: '',
    tags: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  
  const loading = createMutation.isLoading || updateMutation.isLoading;

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        category: announcement.category || 'general',
        priority: announcement.priority || 'medium',
        expiresAt: announcement.expiresAt 
          ? new Date(announcement.expiresAt).toISOString().split('T')[0]
          : '',
        tags: announcement.tags?.join(', ') || '',
        attachments: announcement.attachments || []
      });
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      expiresAt: formData.expiresAt || undefined
    };

    if (isEditing) {
      updateMutation.mutate({
        id: announcement._id,
        updateData: payload
      }, {
        onSuccess: () => {
          onClose();
        }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  return (
    <Modal 
    isOpen={true}
      onClose={onClose} 
      title={isEditing ? 'Edit Announcement' : 'Create New Announcement'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter announcement title"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={200}
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.title.length}/200 characters
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            placeholder="Enter announcement content..."
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              errors.content ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={5000}
            disabled={loading}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
          <div className="mt-1 text-xs text-gray-500">
            {formData.content.length}/5000 characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            >
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="payment">Payment</option>
              <option value="emergency">Emergency</option>
              <option value="academic">Academic</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="w-4 h-4" />
                Expiry Date (Optional)
              </div>
            </label>
            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                errors.expiresAt ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.expiresAt && (
              <p className="mt-1 text-sm text-red-600">{errors.expiresAt}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <FaTag className="w-4 h-4" />
                Tags (Optional)
              </div>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tag1, tag2, tag3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <FaSpinner className="animate-spin" />}
            {isEditing ? 'Update Announcement' : 'Create Announcement'}
          </button>
        </div>
      </form>
    </Modal>
  );
}