import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function SignupForm() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password)
            return toast.error('All fields required');
        if (form.password.length < 6)
            return toast.error('Password must be at least 6 chars');
        if (form.password !== form.confirm)
            return toast.error('Passwords do not match');

        setLoading(true);
        try {
            await signup(form.name, form.email, form.password);
            toast.success('Account created!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Account 🚀</h2>
                <p className="text-gray-400 text-sm mb-6">Start managing your projects</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                        <FiUser className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text" name="name" placeholder="Full Name" required
                            value={form.name} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email" name="email" placeholder="Email" required
                            value={form.email} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type={show ? 'text' : 'password'} name="password"
                            placeholder="Password (min 6)" required
                            value={form.password} onChange={handleChange}
                            className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button type="button" onClick={() => setShow(!show)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                            {show ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type={show ? 'text' : 'password'} name="confirm"
                            placeholder="Confirm Password" required
                            value={form.confirm} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition">
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Already have account?{' '}
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}