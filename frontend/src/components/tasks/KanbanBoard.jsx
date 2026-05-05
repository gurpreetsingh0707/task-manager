import TaskCard from './TaskCard';
import { TASK_STATUS, STATUS_COLORS } from '../../utils/constants';

const COLUMN_LABELS = {
    'todo': '📋 To Do',
    'in-progress': '⚡ In Progress',
    'review': '👁️ Review',
    'done': '✅ Done',
};

export default function KanbanBoard({ tasks = [], isAdmin, onUpdate }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {TASK_STATUS.map(status => {
                const col = tasks.filter(t => t.status === status);
                return (
                    <div key={status} className="bg-gray-50 rounded-xl p-3 min-h-[200px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700">
                                {COLUMN_LABELS[status]}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[status]}`}>
                                {col.length}
                            </span>
                        </div>
                        {col.length === 0 && (
                            <p className="text-xs text-gray-300 text-center mt-8">No tasks</p>
                        )}
                        {col.map(task => (
                            <TaskCard key={task._id} task={task} isAdmin={isAdmin} onUpdate={onUpdate} />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}