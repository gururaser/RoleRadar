import { Search, Sparkles } from 'lucide-react'

export default function LoadingAnimation() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-16">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-8 h-8 text-primary-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-100 mb-2">Searching for perfect matches...</h3>
        <p className="text-gray-300 mb-4">Using AI to find the most relevant opportunities for you</p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Analyzing thousands of job postings</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
