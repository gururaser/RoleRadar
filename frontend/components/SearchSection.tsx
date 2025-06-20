import { Search } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface SearchSectionProps {
  query: string
  setQuery: (query: string) => void
  onSearch: (e: React.FormEvent) => void
  isLoading: boolean
  hasSearched: boolean
  onQueryClear?: () => void
}

export default function SearchSection({ query, setQuery, onSearch, isLoading, hasSearched, onQueryClear }: SearchSectionProps) {
  const [placeholderText, setPlaceholderText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const placeholderTexts = [
    "Data Scientist jobs in Australia with Machine Learning skills",
    "Remote Software Engineer positions with React",
    "Data Analyst roles in New York with SQL experience",
  ]

  const exampleQueries = [
    "Data Scientist jobs in Australia with Machine Learning skills",
    "Remote Software Engineer positions with React",
    "Data Analyst roles in New York with SQL experience",
  ]

  useEffect(() => {
    // Input focused or user started typing, stop animation
    if (isInputFocused || query.length > 0) {
      return
    }

    const typeSpeed = 100
    const deleteSpeed = 50
    const pauseDuration = 2000

    const currentText = placeholderTexts[currentTextIndex]

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Writing mode
        if (currentCharIndex < currentText.length) {
          setPlaceholderText(currentText.substring(0, currentCharIndex + 1))
          setCurrentCharIndex(prev => prev + 1)
        } else {
          // Text completed, switch to deleting mode
          setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        // Deleting mode
        if (currentCharIndex > 0) {
          setPlaceholderText(currentText.substring(0, currentCharIndex - 1))
          setCurrentCharIndex(prev => prev - 1)
        } else {
          // Deleting completed, switch to next text
          setIsDeleting(false)
          setCurrentTextIndex(prev => (prev + 1) % placeholderTexts.length)
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timer)
  }, [currentCharIndex, isDeleting, currentTextIndex, placeholderTexts, isInputFocused, query])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    // Clear query if empty and hasSearched is true
    if (value === '' && hasSearched && onQueryClear) {
      onQueryClear()
    }
  }

  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12">
        {/* Large RoleRadar Logo */}
          <div className="flex flex-col items-center mb-10">
          <div className="w-[32rem] h-72 flex items-center justify-center mb-6">
            <Image 
              src="/roleradar_logo_main.png" 
              alt="RoleRadar Logo" 
              width={512}
              height={288}
              className="object-contain"
              priority
            />
          </div>
        </div>
        
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
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder={isInputFocused || query.length > 0 ? 'Search for jobs...' : `e.g., ${placeholderText}${!isDeleting && currentCharIndex === placeholderTexts[currentTextIndex]?.length ? '|' : ''}`}
              className="w-full pl-12 pr-40 py-4 text-lg border border-gray-600 bg-gray-800 text-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm placeholder-gray-400"
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
