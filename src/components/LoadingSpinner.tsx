function LoadingSpinner() {
    return (
        <div className="inset-0 fixed flex z-50 bg-gray-700/30 items-center justify-center flex-col gap-3">
            <div className="size-16 border-b-4 border-l-4 border-blue-600 animate-spin rounded-full"></div>
            <h1 className="text-2xl font-bold text-blue-800 animate-pulse">Loading...</h1>
        </div>
    );
}

export default LoadingSpinner;
