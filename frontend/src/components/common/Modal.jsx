import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ title, onClose, children }) {
    // ESC key se band
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FiX size={20} />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}