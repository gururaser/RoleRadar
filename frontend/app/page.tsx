'use client'

import { useState } from 'react'
import { Search, MapPin, Clock, Building, DollarSign, Users, Filter, Sparkles, X, ExternalLink, Calendar, Globe } from 'lucide-react'

interface JobResult {
  id: string
  fields: {
    job_title: string
    job_summary: string
    company: string
    job_skills: string[]
    job_location: string
    city: string
    state: string
    job_level: string
    job_type: string
    job_category: string
    job_link?: string
  }
  metadata: {
    score: number
  }
}

interface SearchResponse {
  entries: JobResult[]
  metadata: {
    search_params: {
      natural_query: string
    }
  }
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<JobResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')
  const [selectedJob, setSelectedJob] = useState<JobResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
          limit: 10
        })
      })

      if (!response.ok) {
        throw new Error('Search failed. Please try again.')
      }

      const data: SearchResponse = await response.json()
      setResults(data.entries)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatSkills = (skills: string[]) => {
    if (!skills || skills.length === 0) return []
    return skills[0].split(',').map(skill => skill.trim()).filter(Boolean)
  }

  const getJobLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'associate': return 'bg-green-900 text-green-200'
      case 'mid senior': return 'bg-blue-900 text-blue-200'
      case 'senior': return 'bg-purple-900 text-purple-200'
      default: return 'bg-gray-700 text-gray-200'
    }
  }

  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'remote': return 'bg-emerald-900 text-emerald-200'
      case 'hybrid': return 'bg-orange-900 text-orange-200'
      case 'onsite': return 'bg-red-900 text-red-200'
      default: return 'bg-gray-700 text-gray-200'
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
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/roleradar_logo2.png" 
                  alt="RoleRadar Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-100">RoleRadar</h1>
                <p className="text-sm text-gray-400">Spot your next role in a heartbeat</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
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
              {[
                "Data Scientist jobs in San Francisco with Python and ML",
                "Remote Software Engineer positions with React",
                "Data Analyst roles in New York with SQL experience",
                "Senior Data Engineer jobs in Seattle"
              ].map((example, index) => (
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

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-900 border border-red-700 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div className="max-w-6xl mx-auto">
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

            {results.length === 0 && !isLoading && hasSearched && !error && (
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
                <div key={job.id} className="card hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-100 mb-2">
                        {job.fields.job_title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center space-x-1">
                          <Building className="w-4 h-4" />
                          <span>{job.fields.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.fields.job_location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-2">
                        Match Score: {Math.round(job.metadata.score * 100)}%
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobLevelColor(job.fields.job_level)}`}>
                          {job.fields.job_level}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.fields.job_type)}`}>
                          {job.fields.job_type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {job.fields.job_summary.substring(0, 300)}
                      {job.fields.job_summary.length > 300 && '...'}
                    </p>
                  </div>

                  {job.fields.job_skills && job.fields.job_skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-100 mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formatSkills(job.fields.job_skills).slice(0, 8).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-900 text-primary-200 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {formatSkills(job.fields.job_skills).length > 8 && (
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                            +{formatSkills(job.fields.job_skills).length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      <span className="capitalize">{job.fields.job_category.replace('_', ' ')}</span>
                    </div>
                    <button 
                      className="btn-primary"
                      onClick={() => handleViewDetails(job)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-700">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">
                  {selectedJob.fields.job_title}
                </h2>
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{selectedJob.fields.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.fields.job_location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{selectedJob.fields.job_type}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="ml-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Job Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Job Level</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getJobLevelColor(selectedJob.fields.job_level)}`}>
                    {selectedJob.fields.job_level}
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Work Type</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(selectedJob.fields.job_type)}`}>
                    {selectedJob.fields.job_type}
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Match Score</div>
                  <div className="text-lg font-semibold text-primary-400">
                    {Math.round(selectedJob.metadata.score * 100)}%
                  </div>
                </div>
              </div>

              {/* Job Category */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-3">Category</h3>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm capitalize">
                  {selectedJob.fields.job_category.replace('_', ' ')}
                </span>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-3">Job Description</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedJob.fields.job_summary}
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              {selectedJob.fields.job_skills && selectedJob.fields.job_skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formatSkills(selectedJob.fields.job_skills).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-primary-900 text-primary-200 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-3">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Full Location</div>
                    <div className="text-gray-100">{selectedJob.fields.job_location}</div>
                  </div>
                  {selectedJob.fields.state && (
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">State</div>
                      <div className="text-gray-100">{selectedJob.fields.state}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-700">
                <button
                  onClick={closeModal}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
                <button
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  onClick={() => {
                    const jobLink = selectedJob.fields.job_link
                    if (jobLink && jobLink.trim()) {
                      window.open(jobLink, '_blank')
                    } else {
                      // Fallback to Google search if job_link is not available
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedJob.fields.job_title + ' ' + selectedJob.fields.company)}`, '_blank')
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Apply Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-300">
            <p>&copy; 2025 RoleRadar. Powered by Superlinked and Qdrant.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
