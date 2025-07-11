function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          レインボーラインデータ可視化
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          レインボーライン駐車場の車両データに特化した詳細分析
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <p className="text-gray-500 mb-4">
            このアプリケーションは現在開発中です。
          </p>
          <a 
            href="../" 
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            ← メインページに戻る
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
