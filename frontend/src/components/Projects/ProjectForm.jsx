import { useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ProjectForm({ onSuccess, onClose }) {
    const [form, setForm] = useState({ name: '', description: '', deadline: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Project name required');
        setLoading(true);
        try {
            await API.post('/projects', form);
            toast.success('Project created!');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text" placeholder="Project Name *" required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                rows={3}
            />
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Deadline</label>
                <input
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>
            <div className="flex gap-2 justify-end">
                <button type="button" onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" disabled={loading}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Project'}
                </button>
            </div>
        </form>
    );
}