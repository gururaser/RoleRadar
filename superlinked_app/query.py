from collections import namedtuple

from superlinked import framework as sl

from superlinked_app.index import (
    description_space,
    index,
    job_schema,
    load_categories,
    skills_space,
    title_space,
)
from superlinked_app.nlq import (
    FIELD_DESCRIPTIONS,
    openai_config,
    system_prompt,
)

job_categories = load_categories()

# query_debug is a simple way to check if server has some data ingested:
query_debug = sl.Query(index).find(job_schema).limit(3).select_all()

# Let's define a main query that will be used for multi-modal semantic search:
query = (
    sl.Query(
        index,
        weights={
            description_space: sl.Param("description_weight", default=0.8),
            title_space: sl.Param("title_weight", default=1.0),
            skills_space: sl.Param("skills_weight", default=0.9),
        },
    )
    .find(job_schema)
    .similar(
        description_space.text,
        sl.Param("description", description=FIELD_DESCRIPTIONS["description"]),
        weight=sl.Param("similar_description_weight", default=0.8),
    )
    .similar(
        title_space.text,
        sl.Param("title", description=FIELD_DESCRIPTIONS["title"]),
        weight=sl.Param("similar_title_weight", default=1.0),
    )
    .similar(
        skills_space.category,
        sl.Param("skills", description=FIELD_DESCRIPTIONS["skills"]),
        weight=sl.Param("similar_skills_weight", default=0.9),
    )
)

# We can specify number of retrieved results like this:
query = query.limit(sl.Param("limit", default=10))

# We want all fields to be returned
query = query.select_all()

# .. and all the metadata including knn_params and partial_scores
query = query.include_metadata()

# Now let's add hard-filtering for categorical attributes based on actual schema:
CategoryFilter = namedtuple(
    "CategoryFilter", ["operator", "param_name", "field_name", "description", "options"]
)

filters = [
    # State filters - available in categories.json
    CategoryFilter(
        operator=job_schema.state.in_,
        param_name="states_include",
        field_name="state",
        description=f"States to include. {FIELD_DESCRIPTIONS['location']} Only include explicitly mentioned states.",
        options=job_categories.get("state", []),
    ),
    CategoryFilter(
        operator=job_schema.state.not_in_,
        param_name="states_exclude",
        field_name="state",
        description=f"States to exclude. {FIELD_DESCRIPTIONS['location']} Use when query mentions 'but not [state]'.",
        options=job_categories.get("state", []),
    ),
    # Search city filters - dynamic values (many unique search cities)
    CategoryFilter(
        operator=job_schema.search_city.in_,
        param_name="search_cities_include",
        field_name="search_city",
        description=f"Cities to include. {FIELD_DESCRIPTIONS['location']}",
        options=job_categories.get("search_city", []),
    ),
    CategoryFilter(
        operator=job_schema.search_city.not_in_,
        param_name="search_cities_exclude",
        field_name="search_city",
        description=f"Cities to exclude. {FIELD_DESCRIPTIONS['location']}",
        options=job_categories.get("search_city", []),
    ),
    # Search country filters - available in categories.json
    CategoryFilter(
        operator=job_schema.search_country.in_,
        param_name="search_countries_include",
        field_name="search_country",
        description=f"Countries to include. {FIELD_DESCRIPTIONS['location']} Available: United States, United Kingdom, Canada, Australia.",
        options=job_categories.get("search_country", []),
    ),
    CategoryFilter(
        operator=job_schema.search_country.not_in_,
        param_name="search_countries_exclude",
        field_name="search_country",
        description=f"Countries to exclude. {FIELD_DESCRIPTIONS['location']}",
        options=job_categories.get("search_country", []),
    ),
    # Company filters - dynamic values (many unique companies)
    CategoryFilter(
        operator=job_schema.company.in_,
        param_name="companies_include",
        field_name="company",
        description="Companies to include. Use when specific company names are mentioned (Google, Microsoft, Apple, etc.) or company types (tech startup, consulting firm).",
        options=job_categories.get("company", []),
    ),
    CategoryFilter(
        operator=job_schema.company.not_in_,
        param_name="companies_exclude",
        field_name="company",
        description="Companies to exclude. Use when specific company names should be avoided.",
        options=job_categories.get("company", []),
    ),
    # Job level filters - available in categories.json
    CategoryFilter(
        operator=job_schema.job_level.in_,
        param_name="job_levels_include",
        field_name="job_level",
        description=f"Job levels to include. {FIELD_DESCRIPTIONS['experience_level']}",
        options=job_categories.get("job_level", []),
    ),
    CategoryFilter(
        operator=job_schema.job_level.not_in_,
        param_name="job_levels_exclude",
        field_name="job_level",
        description=f"Job levels to exclude. {FIELD_DESCRIPTIONS['experience_level']}",
        options=job_categories.get("job_level", []),
    ),
    # Job type filters - available in categories.json
    CategoryFilter(
        operator=job_schema.job_type.in_,
        param_name="job_types_include",
        field_name="job_type",
        description=f"Job types to include. {FIELD_DESCRIPTIONS['work_type']}",
        options=job_categories.get("job_type", []),
    ),
    CategoryFilter(
        operator=job_schema.job_type.not_in_,
        param_name="job_types_exclude",
        field_name="job_type",
        description=f"Job types to exclude. {FIELD_DESCRIPTIONS['work_type']}",
        options=job_categories.get("job_type", []),
    ),
    # Job category filters - available in categories.json
    CategoryFilter(
        operator=job_schema.job_category.in_,
        param_name="job_categories_include",
        field_name="job_category",
        description=f"Job categories to include. Use {FIELD_DESCRIPTIONS['title']} mapping logic. Available: data_analyst, software_engineer, data_engineer, data_scientist.",
        options=job_categories.get("job_category", []),
    ),
    CategoryFilter(
        operator=job_schema.job_category.not_in_,
        param_name="job_categories_exclude",
        field_name="job_category",
        description="Job categories to exclude. Use when specific job types should be avoided.",
        options=job_categories.get("job_category", []),
    ),
]

# Apply all categorical filters
for filter_item in filters:
    # For dynamic fields (city, company, job_location, search_city), options may be empty
    # but we still want to enable the filtering capability
    param = sl.Param(
        filter_item.param_name,
        description=filter_item.description,
        options=filter_item.options if filter_item.options else None,
    )
    query = query.filter(filter_item.operator(param))

# And finally, let's add natural language interface on top
# that will call LLM to parse user natural query
# into structured superlinked query, i.e. suggest parameters values.
query = query.with_natural_query(
    natural_query=sl.Param("natural_query"),
    client_config=openai_config,
    system_prompt=system_prompt,
)