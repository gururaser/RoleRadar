import { Tag, MapPin, Briefcase, DollarSign, Users, Building, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { DetectedFilters as DetectedFiltersType } from '../types'

interface DetectedFiltersProps {
  filters: DetectedFiltersType
  queryCount: number
}

export default function DetectedFilters({ filters, queryCount }: DetectedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const renderFilterItem = (icon: React.ReactNode, label: string, value: string | string[] | undefined) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null
    
    const displayValue = Array.isArray(value) ? value.join(', ') : value
       
    return (
      <div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg">
        {icon}
        <span className="text-sm text-gray-300">{label}:</span>
        <span className="text-sm font-medium text-gray-100">{displayValue}</span>
      </div>
    )
  }

  const renderArrayFilter = (icon: React.ReactNode, label: string, values: string[] | null | undefined, type: 'include' | 'exclude') => {
    if (!values || values.length === 0) return null
    
    const bgColor = type === 'include' ? 'bg-green-800' : 'bg-red-800'
    const textColor = type === 'include' ? 'text-green-200' : 'text-red-200'
    const prefix = type === 'include' ? '' : 'Not '
    
    return (
      <div className={`flex items-center space-x-2 ${bgColor} px-3 py-2 rounded-lg`}>
        {icon}
        <span className={`text-sm ${textColor}`}>{prefix}{label}:</span>
        <span className={`text-sm font-medium ${textColor}`}>{values.join(', ')}</span>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto mb-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-750 rounded-lg p-2 -m-2 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-100">
              Detected Search Filters
            </h3>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-500 ease-out ${
              isExpanded ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
        
        <div 
          className={`overflow-hidden transition-all duration-500 ease-out ${
            isExpanded 
              ? 'max-h-96 opacity-100 mt-4' 
              : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Skip natural_query - don't show Search Query */}
            
            {/* Basic Filters */}
            {renderFilterItem(
              <Briefcase className="w-4 h-4 text-blue-400" />,
              "Job Title",
              filters.title
            )}
            
            {renderFilterItem(
              <Tag className="w-4 h-4 text-purple-400" />,
              "Description",
              filters.description
            )}
            
            {renderFilterItem(
              <Tag className="w-4 h-4 text-yellow-400" />,
              "Skills",
              filters.skills
            )}
            
            {renderFilterItem(
              <MapPin className="w-4 h-4 text-green-400" />,
              "Location",
              filters.location
            )}
            
            {renderFilterItem(
              <Building className="w-4 h-4 text-orange-400" />,
              "Company",
              filters.company
            )}
            
            {renderFilterItem(
              <Users className="w-4 h-4 text-indigo-400" />,
              "Experience Level",
              filters.experience_level
            )}
            
            {renderFilterItem(
              <Briefcase className="w-4 h-4 text-cyan-400" />,
              "Work Type",
              filters.work_type
            )}
            
            {renderFilterItem(
              <MapPin className="w-4 h-4 text-pink-400" />,
              "Remote Preference",
              filters.remote_preference
            )}
            
            {filters.salary !== undefined && filters.salary !== 0 && (
              <div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Salary Preference:</span>
                <span className="text-sm font-medium text-gray-100">
                  {filters.salary > 0 ? 'Higher' : 'Lower'} salary priority
                </span>
              </div>
            )}
            
            {/* Include/Exclude Filters */}
            {renderArrayFilter(
              <MapPin className="w-4 h-4 text-green-400" />,
              "States",
              filters.states_include,
              'include'
            )}
            
            {renderArrayFilter(
              <MapPin className="w-4 h-4 text-red-400" />,
              "States",
              filters.states_exclude,
              'exclude'
            )}
            
            {renderArrayFilter(
              <MapPin className="w-4 h-4 text-green-400" />,
              "Cities",
              filters.search_cities_include,
              'include'
            )}
            
            {renderArrayFilter(
              <MapPin className="w-4 h-4 text-red-400" />,
              "Cities",
              filters.search_cities_exclude,
              'exclude'
            )}
            
            {renderArrayFilter(
              <MapPin className="w-4 h-4 text-green-400" />,
              "Countries",
              filters.search_countries_include,
              'include'
            )}
            
            {renderArrayFilter(
              <MapPin className="w-4 h-4 text-red-400" />,
              "Countries",
              filters.search_countries_exclude,
              'exclude'
            )}
            
            {renderArrayFilter(
              <Building className="w-4 h-4 text-green-400" />,
              "Companies",
              filters.companies_include,
              'include'
            )}
            
            {renderArrayFilter(
              <Building className="w-4 h-4 text-red-400" />,
              "Companies",
              filters.companies_exclude,
              'exclude'
            )}
            
            {renderArrayFilter(
              <Users className="w-4 h-4 text-green-400" />,
              "Job Levels",
              filters.job_levels_include,
              'include'
            )}
            
            {renderArrayFilter(
              <Users className="w-4 h-4 text-red-400" />,
              "Job Levels",
              filters.job_levels_exclude,
              'exclude'
            )}
            
            {renderArrayFilter(
              <Briefcase className="w-4 h-4 text-green-400" />,
              "Job Types",
              filters.job_types_include,
              'include'
            )}
            
            {renderArrayFilter(
              <Briefcase className="w-4 h-4 text-red-400" />,
              "Job Types",
              filters.job_types_exclude,
              'exclude'
            )}
            
            {renderArrayFilter(
              <Tag className="w-4 h-4 text-green-400" />,
              "Job Categories",
              filters.job_categories_include,
              'include'
            )}
            
            {renderArrayFilter(
              <Tag className="w-4 h-4 text-red-400" />,
              "Job Categories",
              filters.job_categories_exclude,
              'exclude'
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
