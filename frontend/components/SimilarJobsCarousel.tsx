import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Building, ArrowRight } from 'lucide-react'

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

interface SimilarJobsCarouselProps {
  currentJobId: string
  onJobSelect: (job: JobResult) => void
  onSeeMore: (jobId: string) => void
}

export default function SimilarJobsCarousel({ currentJobId, onJobSelect, onSeeMore }: SimilarJobsCarouselProps) {
  const [similarJobs, setSimilarJobs] = useState<JobResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const itemsPerView = 3
  // Simple approach: always show exactly 3 items at a time
  const allItems = [...similarJobs]
  if (similarJobs.length > 0) {
    allItems.push('see-more' as any) // Add see more placeholder
  }
  
  const canNavigate = allItems.length > itemsPerView
  const maxIndex = canNavigate ? allItems.length - itemsPerView : 0

  useEffect(() => {
    fetchSimilarJobs()
  }, [currentJobId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSimilarJobs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/similar-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentJobId,
          limit: 10,
          description_weight: 0.8,
          title_weight: 1.0,
          skills_weight: 0.9
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch similar jobs')
      }

      const data = await response.json()
      const jobs = data.entries || []
      const filteredJobs = jobs.filter((job: JobResult) => job.id !== currentJobId)
      setSimilarJobs(filteredJobs)
    } catch (err) {
      setError('Failed to load similar jobs')
      console.error('Error fetching similar jobs:', err)
      setSimilarJobs([])
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
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

  if (loading) {
    return (
      <div className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Similar Jobs</h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error || similarJobs.length === 0) {
    return null
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Similar Jobs</h3>
      
      <div className="relative">
        {canNavigate && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-200" />
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-200" />
            </button>
          </>
        )}

        <div className="overflow-hidden px-10">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
          >
            {similarJobs.map((job) => (
              <div
                key={job.id}
                className="flex-shrink-0 cursor-pointer"
                style={{ width: 'calc(33.333% - 10.667px)' }} // 33.33% minus gap compensation
                onClick={() => onJobSelect(job)}
              >
                <div className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 h-full transition-colors border border-gray-700 hover:border-gray-600 min-h-[200px]">
                  <h4 className="font-semibold text-gray-100 mb-2 line-clamp-2">
                    {job.fields.job_title}
                  </h4>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Building className="w-4 h-4 mr-1" />
                    <span className="truncate">{job.fields.company}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{job.fields.job_location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getJobLevelColor(job.fields.job_level)}`}>
                      {job.fields.job_level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(job.metadata.score * 100).toFixed(1)}% match
                    </span>
                  </div>
                  
                  {job.fields.job_skills && job.fields.job_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formatSkills(job.fields.job_skills).slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {formatSkills(job.fields.job_skills).length > 3 && (
                        <span className="px-2 py-1 text-gray-500 text-xs">
                          +{formatSkills(job.fields.job_skills).length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div 
              className="flex-shrink-0"
              style={{ width: 'calc(33.333% - 10.667px)' }}
            >
              <div 
                className="bg-gray-900 hover:bg-gray-800 rounded-lg p-4 h-full transition-colors border border-gray-700 hover:border-primary-500 cursor-pointer flex flex-col items-center justify-center min-h-[200px] group"
                onClick={() => onSeeMore(currentJobId)}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-600 hover:bg-primary-500 rounded-full flex items-center justify-center mb-4 mx-auto transition-colors group-hover:scale-110 transform duration-200">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-100 mb-2">See More Similar Jobs</h4>
                  <p className="text-sm text-gray-400 mb-3">Discover more jobs like this one</p>
                  <div className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors group-hover:bg-primary-500">
                    View All
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
