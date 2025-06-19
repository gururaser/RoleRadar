export interface JobResult {
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

export interface DetectedFilters {
  // Basic search parameters
  description?: string
  title?: string
  skills?: string[]
  location?: string
  
  // Weight parameters
  similar_description_weight?: number
  similar_title_weight?: number
  similar_skills_weight?: number
  description_weight?: number
  title_weight?: number
  skills_weight?: number
  
  // Limit and selection
  limit?: number
  select_param__?: string[]
  
  // Include/Exclude filters
  states_include?: string[] | null
  states_exclude?: string[] | null
  search_cities_include?: string[] | null
  search_cities_exclude?: string[] | null
  search_countries_include?: string[] | null
  search_countries_exclude?: string[] | null
  companies_include?: string[] | null
  companies_exclude?: string[] | null
  job_levels_include?: string[] | null
  job_levels_exclude?: string[] | null
  job_types_include?: string[] | null
  job_types_exclude?: string[] | null
  job_categories_include?: string[] | null
  job_categories_exclude?: string[] | null
  
  // Natural language query and system parameters
  natural_query?: string
  system_prompt_param__?: string
  radius_param__?: number | null
  
  // Legacy fields for backward compatibility
  company?: string
  experience_level?: string
  work_type?: string
  remote_preference?: string
  salary?: number
}

export interface SearchResponse {
  entries: JobResult[]
  metadata: {
    schema_name: string
    search_vector?: number[]  // Optional since backend doesn't always send it
    search_params: DetectedFilters
  }
}
