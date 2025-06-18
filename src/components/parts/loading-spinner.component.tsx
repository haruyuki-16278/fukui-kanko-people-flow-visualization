export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center fixed inset-0 bg-gray-500 bg-opacity-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg">データを読み込み中...</p>
    </div>
  );
}
