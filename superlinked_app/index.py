from superlinked import framework as sl

from superlinked_app.config import settings


@sl.schema
class JobPosting:
    # `id` is obligatory field - job_id from your dataset
    job_id: sl.IdField
    
    # The fields below are embedded into spaces
    # and used for semantic search
    title: sl.String              # Job title
    description: sl.String        # Job description - most important field
    company_name: sl.String       # Company name
    
    # Numerical fields - for embedding
    normalized_salary: sl.Float   # Normalized salary
    views: sl.Float               # View count
    applies: sl.Float             # Application count
    
    # Categorical fields - for hard filtering
    location: sl.String           # Location
    formatted_work_type: sl.String # Work type (remote, hybrid, etc.)
    formatted_experience_level: sl.String # Experience level
    work_type: sl.String          # Job type
    pay_period: sl.String         # Pay period
    currency: sl.String           # Currency
    compensation_type: sl.String  # Compensation type
    remote_allowed: sl.Float      # Remote work allowed (0/1)


job_schema = JobPosting()

# Most important field: Job description - for semantic search
description_space = sl.TextSimilaritySpace(
    text=job_schema.description,
    model=settings.text_embedder_name,
)

# Job title - also contains important semantic information
title_space = sl.TextSimilaritySpace(
    text=job_schema.title,
    model=settings.text_embedder_name,
)

# Normalized salary - using logarithmic scale
# because salaries span a wide range
salary_space = sl.NumberSpace(
    job_schema.normalized_salary,
    min_value=0,
    max_value=300808,  # 99th percentile of our data
    mode=sl.Mode.MAXIMUM,
    scale=sl.LogarithmicScale(),
)

# View count - popularity indicator
views_space = sl.NumberSpace(
    job_schema.views,
    min_value=0,
    max_value=177,  # 99th percentile of our data
    mode=sl.Mode.MAXIMUM,
    scale=sl.LogarithmicScale(),
)

# Application count - demand indicator
applies_space = sl.NumberSpace(
    job_schema.applies,
    min_value=0,
    max_value=134,  # 99th percentile of our data
    mode=sl.Mode.MAXIMUM,
    scale=sl.LogarithmicScale(),
)

# Index - composition of spaces and filtering fields
index = sl.Index(
    spaces=[
        description_space,      # Job description (most important)
        title_space,           # Job title
        salary_space,          # Salary
        views_space,           # Views
        applies_space,         # Applications
    ],
    #
    # The fields below are used for hard-filtering
    # Users can apply exact filters based on these criteria
    fields=[
        job_schema.location,                    # City/location filter
        job_schema.formatted_work_type,         # Work type (remote, hybrid, onsite)
        job_schema.formatted_experience_level,  # Experience level (junior, senior, etc.)
        job_schema.work_type,                   # Job type
        job_schema.company_name,                # Company name
        job_schema.remote_allowed,              # Remote work allowed
        job_schema.pay_period,                  # Pay period (yearly, monthly, etc.)
        job_schema.currency,                    # Currency
        job_schema.compensation_type,           # Compensation type
    ],
)