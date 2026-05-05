import { useState } from 'react';
import API from '../../api/axios';
import { getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FiTrash2, FiUserPlus } from 'react-icons/fi';

export default function MemberList({ project, isAdmin, onUpdate }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        try {
            // Pehle user dhundo by email
            const { data: users } = await API.get(`/users?email=${email}`);
            if (!users.length) return toast.error('User not found');
            await API.post(`/projects/${project._id}/members`, {
                userId: users[0]._id,
                role: 'member'
            });
            toast.success('Member added!');
            setEmail('');
            onUpdate();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error adding member');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (uid) => {
        if (!confirm('Remove this member?')) return;
        try {
            await API.delete(`/projects/${project._id}/members/${uid}`);
            toast.success('Member removed');
            onUpdate();
        } catch (err) {
            toast.error('Error removing member');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FiUserPlus /> Members ({project.members?.length})
            </h3>

            {/* Member list */}
            <div className="space-y-2 mb-4">
                {project.members?.map(({ user, role }) => (
                    <div key={user._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">
                                {getInitials(user.name)}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{role}</span>
                            {isAdmin && (
                                <button onClick={() => handleRemove(user._id)}
                                    className="text-gray-300 hover:text-red-500">
                                    <FiTrash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add member (admin only) */}
            {isAdmin && (
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        type="email" placeholder="Add by email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="flex-1 border px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button type="submit" disabled={loading}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                        Add
                    </button>
                </form>
            )}
        </div>
    );
}