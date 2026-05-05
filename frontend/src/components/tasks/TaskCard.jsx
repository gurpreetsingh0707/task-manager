import { useState } from 'react';
import API from '../../api/axios';
import { formatDate, isOverdue, getInitials } from '../../utils/helpers';
import { STATUS_COLORS, PRIORITY_COLORS, TASK_STATUS } from '../../utils/constants';
import { FiCalendar, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TaskCard({ task, isAdmin, onUpdate }) {
    const [updating, setUpdating] = useState(false);
    const overdue = isOverdue(task.dueDate, task.status);

    const changeStatus = async (status) => {
        setUpdating(true);
        try {
            await API.patch(`/tasks/${task._id}/status`, { status });
            onUpdate();
        } catch {
            toast.error('Status update failed');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete task?')) return;
        try {
            await API.delete(`/tasks/${task._id}`);
            toast.success('Task deleted');
            onUpdate();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className={`bg-white rounded-xl p-4 shadow-sm border ${overdue ? 'border-red-300' : 'border-gray-100'} mb-3`}>
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm text-gray-800 flex-1">{task.title}</h4>
                {isAdmin && (
                    <button onClick={handleDelete} className="text-gray-300 hover:text-red-500 ml-2">
                        <FiTrash2 size={14} />
                    </button>
                )}
            </div>

            {task.description && (
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-1 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                </span>
                {overdue && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">overdue</span>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FiCalendar size={11} />
                    {formatDate(task.dueDate)}
                </div>
                {task.assignedTo && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center"
                        title={task.assignedTo.name}>
                        {getInitials(task.assignedTo.name)}
                    </div>
                )}
            </div>

            {/* Status dropdown */}
            <select
                value={task.status}
                onChange={e => changeStatus(e.target.value)}
                disabled={updating}
                className={`mt-2 w-full text-xs rounded-lg px-2 py-1 border-0 font-medium cursor-pointer ${STATUS_COLORS[task.status]}`}
            >
                {TASK_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
    );
}