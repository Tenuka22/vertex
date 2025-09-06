const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-gray-900 border-b-2" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
