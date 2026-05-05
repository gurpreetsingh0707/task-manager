import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-7xl font-black text-indigo-200">404</h1>
            <p className="text-gray-500 mt-2 mb-6">Page not found</p>
            <Link to="/" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700">
                Go Home
            </Link>
        </div>
    );
}