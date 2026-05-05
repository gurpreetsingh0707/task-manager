import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/common/Navbar';
import TaskCard from '../components/tasks/TaskCard';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const { data: projects } = await API.get('/projects');
            let myTasks = [];
            for (const p of projects) {
                const { data: t } = await API.get(`/tasks/project/${p._id}`);
                // only tasks assigned to me
                myTasks = [...myTasks, ...t.filter(tk => tk.assignedTo?._id === user._id)];
            }
            setTasks(myTasks);
        } catch (err) {
            console.error('Failed to load tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTasks(); }, []);

    if (loading) return <><Navbar /><Loader /></>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-bold mb-6">✅ My Tasks</h1>
                {tasks.length === 0
                    ? <p className="text-gray-400 text-center mt-20">No tasks assigned to you.</p>
                    : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tasks.map(task => (
                                <TaskCard key={task._id} task={task} isAdmin={false} onUpdate={fetchTasks} />
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
}