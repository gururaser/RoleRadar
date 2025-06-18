import { Search } from 'lucide-react'

interface SearchSectionProps {
  query: string
  setQuery: (query: string) => void
  onSearch: (e: React.FormEvent) => void
  isLoading: boolean
  hasSearched: boolean
}

export default function SearchSection({ query, setQuery, onSearch, isLoading, hasSearched }: SearchSectionProps) {
  const exampleQueries = [
    "Data Scientist jobs in San Francisco with Python and ML",
    "Remote Software Engineer positions with React",
    "Data Analyst roles in New York with SQL experience",
    "Senior Data Engineer jobs in Seattle"
  ]

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-100 mb-4">
          Find Your Dream Job with AI
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Describe your ideal position in everyday language and instantly discover the most relevant job opportunities. 
          Powered by advanced semantic search technology.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <form onSubmit={onSearch} className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Data Analyst jobs in California with SQL and Python experience..."
              className="w-full pl-12 pr-32 py-4 text-lg border border-gray-600 bg-gray-800 text-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm placeholder-gray-400"
              disabled={isLoading}
              spellCheck={false}
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Example Queries */}
      {!hasSearched && (
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-lg font-semibold text-gray-100 mb-4 text-center">Try these example searches:</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm text-gray-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
