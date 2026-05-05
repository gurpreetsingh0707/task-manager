import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const { data } = await API.get('/projects');
            setProjects(data);
        } catch (err) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    return { projects, loading, refetch: fetchProjects };
};