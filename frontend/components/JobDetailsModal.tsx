import { Building, MapPin, Globe, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import SimilarJobsCarousel from './SimilarJobsCarousel'

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

interface JobDetailsModalProps {
  job: JobResult
  isOpen: boolean
  onClose: () => void
  onJobSelect?: (job: JobResult) => void
  onSeeMore?: (jobId: string) => void
  isTransitioning?: boolean
}

export default function JobDetailsModal({ job, isOpen, onClose, onJobSelect, onSeeMore, isTransitioning = false }: JobDetailsModalProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  
  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null

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

  const handleApplyNow = () => {
    if (job.fields.job_link && job.fields.job_link.trim()) {
      window.open(job.fields.job_link, '_blank')
    } else {
      // Fallback to Google search if no job_link
      window.open(`https://www.google.com/search?q=${encodeURIComponent(job.fields.job_title + ' ' + job.fields.company)}`, '_blank')
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-overlay"
      onClick={handleOverlayClick}
    >
      <div className={`bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto modal-content ${isTransitioning ? 'animate-modal-out' : 'animate-modal-in'}`}>
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              {job.fields.job_title}
            </h2>
            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>{job.fields.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{job.fields.job_location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{job.fields.job_type}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
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
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getJobLevelColor(job.fields.job_level)}`}>
                {job.fields.job_level}
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Work Type</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.fields.job_type)}`}>
                {job.fields.job_type}
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Match Score</div>
              <div className="text-lg font-semibold text-primary-400">
                {Math.round(job.metadata.score * 100)}%
              </div>
            </div>
          </div>

          {/* Job Category */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Category</h3>
            <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm capitalize">
              {job.fields.job_category.replace('_', ' ')}
            </span>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Job Description</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                <div 
                  className={`text-expand-animation overflow-hidden ${
                    isDescriptionExpanded ? 'max-h-none' : 'max-h-32'
                  }`}
                >
                  {job.fields.job_summary}
                </div>
                
                {/* Show More/Less Button */}
                {job.fields.job_summary && job.fields.job_summary.length > 300 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center space-x-1 mt-3 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors duration-200"
                  >
                    <span>{isDescriptionExpanded ? 'Show Less' : 'Show More'}</span>
                    {isDescriptionExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Required Skills */}
          {job.fields.job_skills && job.fields.job_skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {formatSkills(job.fields.job_skills).map((skill, index) => (
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
                <div className="text-gray-100">{job.fields.job_location}</div>
              </div>
              {job.fields.state && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">State</div>
                  <div className="text-gray-100">{job.fields.state}</div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
            <button
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
              onClick={handleApplyNow}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apply Now</span>
            </button>
          </div>

          {/* Similar Jobs Carousel */}
          <SimilarJobsCarousel 
            currentJobId={job.id}
            onJobSelect={onJobSelect || (() => {})}
            onSeeMore={onSeeMore || (() => {})}
          />
        </div>
      </div>
    </div>
  )
}
