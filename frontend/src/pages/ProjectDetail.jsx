import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskForm from '../components/tasks/TaskForm';
import MemberList from '../components/Projects/MemberList';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import ProgressBar from '../components/dashboard/ProgressBar';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';

export default function ProjectDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);

    const fetchData = async () => {
        try {
            const [{ data: proj }, { data: taskList }] = await Promise.all([
                API.get(`/projects/${id}`),
                API.get(`/tasks/project/${id}`),
            ]);
            setProject(proj);
            setTasks(taskList);
        } catch {
            toast.error('Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    if (loading || !project) return <><Navbar /><Loader /></>;

    const myRole = project.members?.find(m => m.user._id === user._id)?.role;
    const isAdmin = myRole === 'admin' || project.owner._id === user._id;
    const doneTasks = tasks.filter(t => t.status === 'done').length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Header */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
                            <p className="text-gray-500 text-sm mt-1">{project.description}</p>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                            {project.status}
                        </span>
                    </div>
                    <ProgressBar done={doneTasks} total={tasks.length} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Kanban — left 3 cols */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-semibold text-gray-700">Tasks</h2>
                            {isAdmin && (
                                <button onClick={() => setShowTaskModal(true)}
                                    className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
                                    <FiPlus size={14} /> Add Task
                                </button>
                            )}
                        </div>
                        <KanbanBoard tasks={tasks} isAdmin={isAdmin} onUpdate={fetchData} />
                    </div>

                    {/* Members — right 1 col */}
                    <div className="lg:col-span-1">
                        <MemberList project={project} isAdmin={isAdmin} onUpdate={fetchData} />
                    </div>
                </div>
            </div>

            {showTaskModal && (
                <Modal title="Add Task" onClose={() => setShowTaskModal(false)}>
                    <TaskForm
                        projectId={id}
                        members={project.members}
                        onSuccess={fetchData}
                        onClose={() => setShowTaskModal(false)}
                    />
                </Modal>
            )}
        </div>
    );
}