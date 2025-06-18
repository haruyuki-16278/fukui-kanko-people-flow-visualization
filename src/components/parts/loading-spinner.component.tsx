export function LoadingSpinner() {
  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-30"></div>
      <div
        className="flex flex-col items-center justify-center h-full w-full"
        style={{ zIndex: "var(--loading-z-index)" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">データを読み込み中...</p>
      </div>
    </>
  );
}
