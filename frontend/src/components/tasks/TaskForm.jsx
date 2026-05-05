import { useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { TASK_PRIORITY } from '../../utils/constants';

export default function TaskForm({ projectId, members = [], onSuccess, onClose }) {
    const [form, setForm] = useState({
        title: '', description: '', assignedTo: '',
        priority: 'medium', dueDate: '', project: projectId,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error('Title required');
        setLoading(true);
        try {
            await API.post('/tasks', form);
            toast.success('Task created!');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text" placeholder="Task Title *" required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Priority</label>
                    <select value={form.priority}
                        onChange={e => setForm({ ...form, priority: e.target.value })}
                        className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {TASK_PRIORITY.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
                    <input type="date" value={form.dueDate}
                        onChange={e => setForm({ ...form, dueDate: e.target.value })}
                        className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Assign To</label>
                <select value={form.assignedTo}
                    onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option value="">-- Unassigned --</option>
                    {members.map(({ user }) => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" disabled={loading}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? 'Creating...' : 'Add Task'}
                </button>
            </div>
        </form>
    );
}