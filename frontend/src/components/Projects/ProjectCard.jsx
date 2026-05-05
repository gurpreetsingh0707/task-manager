import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { FiUsers, FiCalendar } from 'react-icons/fi';

const statusColors = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    'on-hold': 'bg-yellow-100 text-yellow-700',
};

export default function ProjectCard({ project }) {
    return (
        <Link to={`/projects/${project._id}`}>
            <div className="bg-white rounded-xl shadow hover:shadow-md transition p-5 cursor-pointer border hover:border-indigo-300">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg">{project.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[project.status]}`}>
                        {project.status}
                    </span>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {project.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <FiUsers /> {project.members?.length || 0} members
                    </span>
                    <span className="flex items-center gap-1">
                        <FiCalendar /> {formatDate(project.deadline)}
                    </span>
                </div>
            </div>
        </Link>
    );
}