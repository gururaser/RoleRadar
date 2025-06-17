from collections import namedtuple

from superlinked import framework as sl

from superlinked_app.index import (
    applies_space,
    description_space,
    index,
    job_schema,
    salary_space,
    title_space,
    views_space,
)
from superlinked_app.nlq import (
    company_description,
    description_description,
    experience_level_description,
    get_job_categories,
    location_description,
    openai_config,
    remote_preference_description,
    salary_description,
    system_prompt,
    title_description,
    work_type_description,
)
from superlinked_app.config import settings

job_categories = get_job_categories()

# query_debug is a simple way to check if server has some data ingested:
query_debug = sl.Query(index).find(job_schema).limit(3).select_all()

# Let's define a main query that will be used for multi-modal semantic search:
query = (
    sl.Query(
        index,
        weights={
            description_space: sl.Param("description_weight", default=1.0),
            title_space: sl.Param("title_weight", default=0.8),
            salary_space: sl.Param(
                "salary_weight",
                description=salary_description,
                default=0.0,
            ),
            views_space: sl.Param("views_weight", default=0.1),
            applies_space: sl.Param("applies_weight", default=0.1),
        },
    )
    .find(job_schema)
    .similar(
        description_space.text,
        sl.Param("description", description=description_description),
        weight=sl.Param("similar_description_weight", default=1.0),
    )
    .similar(
        title_space.text,
        sl.Param("title", description=title_description),
        weight=sl.Param("similar_title_weight", default=0.8),
    )
)

# We can specify number of retrieved results like this:
query = query.limit(sl.Param("limit", default=10))

# We want all fields to be returned
query = query.select_all()

# .. and all the metadata including knn_params and partial_scores
query = query.include_metadata()

# Now let's add hard-filtering for numerical attributes:
query = (
    query.filter(job_schema.normalized_salary >= sl.Param("min_salary", default=0))
    .filter(job_schema.normalized_salary <= sl.Param("max_salary", default=1000000))
    .filter(job_schema.views >= sl.Param("min_views", default=0))
    .filter(job_schema.views <= sl.Param("max_views", default=1000))
    .filter(job_schema.applies >= sl.Param("min_applies", default=0))
    .filter(job_schema.applies <= sl.Param("max_applies", default=1000))
    .filter(job_schema.remote_allowed >= sl.Param("remote_allowed_min", default=0))
    .filter(job_schema.remote_allowed <= sl.Param("remote_allowed_max", default=1))
)

# ... and for all categorical attributes:
CategoryFilter = namedtuple(
    "CategoryFilter", ["operator", "param_name", "field_name", "description", "options"]
)

filters = [
    # Location filters
    CategoryFilter(
        operator=job_schema.location.in_,
        param_name="locations_include",
        field_name="location",
        description=location_description + " Locations that should be included.",
        options=job_categories.get("location", []),
    ),
    CategoryFilter(
        operator=job_schema.location.not_in_,
        param_name="locations_exclude",
        field_name="location",
        description=location_description + " Locations that should be excluded.",
        options=job_categories.get("location", []),
    ),
    # Company filters
    CategoryFilter(
        operator=job_schema.company_name.in_,
        param_name="companies_include",
        field_name="company_name",
        description=company_description + " Companies that should be included.",
        options=job_categories.get("company_name", []),
    ),
    CategoryFilter(
        operator=job_schema.company_name.not_in_,
        param_name="companies_exclude",
        field_name="company_name",
        description=company_description + " Companies that should be excluded.",
        options=job_categories.get("company_name", []),
    ),
    # Work type filters
    CategoryFilter(
        operator=job_schema.work_type.in_,
        param_name="work_types_include",
        field_name="work_type",
        description=work_type_description + " Types that should be included.",
        options=job_categories.get("work_type", []),
    ),
    CategoryFilter(
        operator=job_schema.work_type.not_in_,
        param_name="work_types_exclude",
        field_name="work_type",
        description=work_type_description + " Types that should be excluded.",
        options=job_categories.get("work_type", []),
    ),
    # Formatted work type (remote preference) filters
    CategoryFilter(
        operator=job_schema.formatted_work_type.in_,
        param_name="remote_preferences_include",
        field_name="formatted_work_type",
        description=remote_preference_description + " Values that should be included.",
        options=job_categories.get("formatted_work_type", []),
    ),
    CategoryFilter(
        operator=job_schema.formatted_work_type.not_in_,
        param_name="remote_preferences_exclude",
        field_name="formatted_work_type",
        description=remote_preference_description + " Values that should be excluded.",
        options=job_categories.get("formatted_work_type", []),
    ),
    # Experience level filters
    CategoryFilter(
        operator=job_schema.formatted_experience_level.in_,
        param_name="experience_levels_include",
        field_name="formatted_experience_level",
        description=experience_level_description + " Levels that should be included.",
        options=job_categories.get("formatted_experience_level", []),
    ),
    CategoryFilter(
        operator=job_schema.formatted_experience_level.not_in_,
        param_name="experience_levels_exclude",
        field_name="formatted_experience_level",
        description=experience_level_description + " Levels that should be excluded.",
        options=job_categories.get("formatted_experience_level", []),
    ),
    # Pay period filters
    CategoryFilter(
        operator=job_schema.pay_period.in_,
        param_name="pay_periods_include",
        field_name="pay_period",
        description="Pay periods that should be included (YEARLY, MONTHLY, HOURLY, etc.).",
        options=job_categories.get("pay_period", []),
    ),
    CategoryFilter(
        operator=job_schema.pay_period.not_in_,
        param_name="pay_periods_exclude",
        field_name="pay_period",
        description="Pay periods that should be excluded.",
        options=job_categories.get("pay_period", []),
    ),
    # Currency filters
    CategoryFilter(
        operator=job_schema.currency.in_,
        param_name="currencies_include",
        field_name="currency",
        description="Currencies that should be included (USD, CAD, EUR, etc.).",
        options=job_categories.get("currency", []),
    ),
    CategoryFilter(
        operator=job_schema.currency.not_in_,
        param_name="currencies_exclude",
        field_name="currency",
        description="Currencies that should be excluded.",
        options=job_categories.get("currency", []),
    ),
    # Compensation type filters
    CategoryFilter(
        operator=job_schema.compensation_type.in_,
        param_name="compensation_types_include",
        field_name="compensation_type",
        description="Compensation types that should be included (BASE_SALARY, etc.).",
        options=job_categories.get("compensation_type", []),
    ),
    CategoryFilter(
        operator=job_schema.compensation_type.not_in_,
        param_name="compensation_types_exclude",
        field_name="compensation_type",
        description="Compensation types that should be excluded.",
        options=job_categories.get("compensation_type", []),
    ),
]

for filter_item in filters:
    if filter_item.options:  # Only add filter if options are available
        param = sl.Param(
            filter_item.param_name,
            description=filter_item.description,
            options=filter_item.options,
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