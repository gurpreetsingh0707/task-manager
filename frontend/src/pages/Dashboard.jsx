import { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/common/Navbar';
import StatsCard from '../components/dashboard/StatsCard';
import OverdueList from '../components/dashboard/Overdue';
import Loader from '../components/common/Loader';
import { isOverdue } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, done: 0, inProgress: 0, overdue: [], tasksPerUser: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data: projects } = await API.get('/projects');
                let all = [], done = 0, inProgress = 0, overdue = [];
                let userMap = {};

                for (const p of projects) {
                    const { data: tasks } = await API.get(`/tasks/project/${p._id}`);
                    all = [...all, ...tasks];
                    done += tasks.filter(t => t.status === 'done').length;
                    inProgress += tasks.filter(t => t.status === 'in-progress').length;
                    overdue = [...overdue, ...tasks.filter(t => isOverdue(t.dueDate, t.status))];
                    
                    tasks.forEach(t => {
                        const name = t.assignedTo?.name || 'Unassigned';
                        userMap[name] = (userMap[name] || 0) + 1;
                    });
                }
                
                const tasksPerUser = Object.keys(userMap).map(k => ({ name: k, count: userMap[k] }));
                setStats({ total: all.length, done, inProgress, overdue, tasksPerUser });
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <><Navbar /><Loader /></>;

    const chartData = [
        { name: 'Total', count: stats.total },
        { name: 'Done', count: stats.done },
        { name: 'In Progress', count: stats.inProgress },
        { name: 'Overdue', count: stats.overdue.length },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard label="Total Tasks" value={stats.total} color="blue" />
                    <StatsCard label="Completed" value={stats.done} color="green" />
                    <StatsCard label="In Progress" value={stats.inProgress} color="yellow" />
                    <StatsCard label="Overdue" value={stats.overdue.length} color="red" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow">
                        <h2 className="font-semibold mb-4 text-gray-700">Tasks by Status</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow">
                        <h2 className="font-semibold mb-4 text-gray-700">Tasks per User</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.tasksPerUser}>
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <OverdueList tasks={stats.overdue} />
            </div>
        </div>
    );
}