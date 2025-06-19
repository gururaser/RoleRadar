'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import Header from '../components/Header'
import SearchSection from '../components/SearchSection'
import LoadingAnimation from '../components/LoadingAnimation'
import JobCard from '../components/JobCard'
import JobDetailsModal from '../components/JobDetailsModal'
import DetectedFilters from '../components/DetectedFilters'
import Footer from '../components/Footer'
import { JobResult, SearchResponse } from '../types'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<JobResult[]>([])
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')
  const [selectedJob, setSelectedJob] = useState<JobResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleQueryClear = () => {
    setResults([])
    setSearchResponse(null)
    setHasSearched(false)
    setError('')
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          natural_query: query,
          limit: 25
        })
      })

      if (!response.ok) {
        throw new Error('Search failed. Please try again.')
      }

      const data: SearchResponse = await response.json()
      setResults(data.entries)
      setSearchResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResults([])
      setSearchResponse(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (job: JobResult) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchSection 
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
          hasSearched={hasSearched}
          onQueryClear={handleQueryClear}
        />

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-900 border border-red-700 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {isLoading && <LoadingAnimation />}

        {/* Results */}
        {hasSearched && !isLoading && (
          <div className="max-w-6xl mx-auto">
            {/* Detected Filters */}
            {searchResponse?.metadata?.search_params && (
              <DetectedFilters 
                filters={searchResponse.metadata.search_params}
                queryCount={results.length}
              />
            )}

            {results.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  Found {results.length} job{results.length !== 1 ? 's' : ''} matching your search
                </h3>
                <p className="text-gray-300">
                  Results are ranked by relevance to your query
                </p>
              </div>
            )}

            {results.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">No jobs found</h3>
                <p className="text-gray-300 mb-4">Try adjusting your search terms or make them more general.</p>
              </div>
            )}

            <div className="space-y-6">
              {results.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}

      <Footer />
    </div>
  )
}
