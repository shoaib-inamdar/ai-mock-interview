export function Header() {
  return (
    /* Updated header styling to light theme */
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white font-bold">
            RJ
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">ResumeJob</h1>
            <p className="text-xs text-gray-600">AI-Powered Job Finder</p>
          </div>
        </div>
      </div>
    </header>
  )
}
