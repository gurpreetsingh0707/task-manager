export default function ProgressBar({ done = 0, total = 0 }) {
    const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
    
    return (
        <div className="w-full">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span className="font-medium">Progress</span>
                <span>{percentage}% ({done}/{total})</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}