from superlinked import framework as sl
import json
import os

from superlinked_app.config import settings

# Load categories from JSON file
def load_categories():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Use settings.path_categories for the path
    categories_path = os.path.join(current_dir, '..', settings.path_categories)
    with open(categories_path, 'r', encoding='utf-8') as f:
        return json.load(f)

categories = load_categories()


@sl.schema
class JobPosting:
    # `id` is obligatory field - using job_link as unique identifier
    id: sl.IdField
    
    # The fields below are embedded into spaces
    # and used for semantic search
    job_title: sl.String | None       # Job title
    job_summary: sl.String | None     # Job description/summary
    company: sl.String | None         # Company name
    job_skills: sl.StringList | None      # Skills mentioned in job
    
    
    # Categorical fields - for hard filtering
    job_location: sl.String | None    # Full job location
    state: sl.String | None           # Extracted state (US)
    search_city: sl.String | None     # Search city used
    search_country: sl.String | None  # Search country used
    job_level: sl.String | None       # Experience level (Associate, Mid Senior)
    job_type: sl.String | None        # Job type (Onsite, Remote, Hybrid)
    job_category: sl.String | None    # Job category (data_analyst, data_engineer, etc.)


job_schema = JobPosting()

# Most important field: Job summary/description - for semantic search
description_space = sl.TextSimilaritySpace(
    text=job_schema.job_summary,
    model=settings.text_embedder_name,
)

# Job title - also contains important semantic information
title_space = sl.TextSimilaritySpace(
    text=job_schema.job_title,
    model=settings.text_embedder_name,
)

# Job skills - important for matching requirements
skills_space = sl.CategoricalSimilaritySpace(
    category_input=job_schema.job_skills,
    categories=categories['skills_list']
)

# Index - composition of spaces and filtering fields
index = sl.Index(
    spaces=[
        description_space,          # Job description (most important)
        title_space,               # Job title
        skills_space,              # Job skills
    ],
    #
    # The fields below are used for hard-filtering
    # Users can apply exact filters based on these criteria
    fields=[
        job_schema.job_location,        # Full location filter
        job_schema.state,               # State filter
        job_schema.search_city,         # Search city filter
        job_schema.search_country,      # Search country filter
        job_schema.job_level,           # Experience level (Associate, Mid Senior)
        job_schema.job_type,            # Work type (Onsite, Remote, Hybrid)
        job_schema.job_category,        # Job category (data_analyst, etc.)
        job_schema.company,             # Company name
    ],
)