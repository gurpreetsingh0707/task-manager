import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import ProjectCard from '../components/Projects/ProjectCard';
import ProjectForm from '../components/Projects/ProjectForm';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import { useProjects } from '../hooks/useProjects';
import { FiPlus } from 'react-icons/fi';

export default function Projects() {
    const { projects, loading, refetch } = useProjects();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">📁 Projects</h1>
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm">
                        <FiPlus /> New Project
                    </button>
                </div>

                {loading ? <Loader /> : (
                    projects.length === 0
                        ? <p className="text-gray-400 text-center mt-20">No projects yet. Create one!</p>
                        : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.map(p => <ProjectCard key={p._id} project={p} />)}
                            </div>
                        )
                )}
            </div>

            {showModal && (
                <Modal title="New Project" onClose={() => setShowModal(false)}>
                    <ProjectForm onSuccess={refetch} onClose={() => setShowModal(false)} />
                </Modal>
            )}
        </div>
    );
}