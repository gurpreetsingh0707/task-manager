import { formatDate } from '../../utils/helpers';
import { FiAlertCircle } from 'react-icons/fi';

export default function OverdueList({ tasks = [] }) {
    if (!tasks.length) return null;

    return (
        <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                <FiAlertCircle /> Overdue Tasks ({tasks.length})
            </h2>
            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task._id} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <span className="text-sm text-gray-700">{task.title}</span>
                        <span className="text-xs text-red-500">{formatDate(task.dueDate)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}