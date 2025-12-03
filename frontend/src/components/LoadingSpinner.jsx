export const LoadingSpinner = ({ size = 'md' }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    return (
        <div className="flex items-center justify-center p-8">
            <div className={`spinner ${sizes[size]}`} />
        </div>
    );
};

export const SkeletonCard = () => {
    return (
        <div className="card">
            <div className="skeleton h-48 w-full rounded-lg mb-4" />
            <div className="skeleton h-6 w-3/4 rounded mb-2" />
            <div className="skeleton h-4 w-1/2 rounded" />
        </div>
    );
};

export const SkeletonList = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton h-20 w-full rounded-lg" />
            ))}
        </div>
    );
};

export default LoadingSpinner;
