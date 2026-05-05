const colorMap = {
    blue: 'bg-blue-50   text-blue-600   border-blue-200',
    green: 'bg-green-50  text-green-600  border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50    text-red-600    border-red-200',
};

export default function StatsCard({ label, value, color = 'blue' }) {
    return (
        <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
            <p className="text-sm font-medium opacity-70">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
    );
}