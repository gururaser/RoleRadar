import { Building, MapPin } from 'lucide-react'

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

interface JobCardProps {
  job: JobResult
  onViewDetails: (job: JobResult) => void
}

export default function JobCard({ job, onViewDetails }: JobCardProps) {
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

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
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
          onClick={() => onViewDetails(job)}
        >
          View Details
        </button>
      </div>
    </div>
  )
}
