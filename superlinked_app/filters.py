from collections import namedtuple

from superlinked import framework as sl

from superlinked_app.index import job_schema, load_categories
from superlinked_app.nlq import (
    company_description,
    experience_level_description,
    location_description,
    work_type_description,
)

# Load job categories
job_categories = load_categories()

# Define namedtuple for category filter
CategoryFilter = namedtuple(
    "CategoryFilter", ["operator", "param_name", "field_name", "description", "options"]
)

# Define all filters
filters = [
    # Job location filters - dynamic values (many unique locations)
    # CategoryFilter(
    #     operator=job_schema.job_location.in_,
    #     param_name="job_locations_include",
    #     field_name="job_location",
    #     description=location_description + " Job locations that should be included.",
    #     options=job_categories.get("job_location", []),
    # ),
    # CategoryFilter(
    #     operator=job_schema.job_location.not_in_,
    #     param_name="job_locations_exclude",
    #     field_name="job_location",
    #     description=location_description + " Job locations that should be excluded.",
    #     options=job_categories.get("job_location", []),
    # ),
    # State filters - available in categories.json
    CategoryFilter(
        operator=job_schema.state.in_,
        param_name="states_include",
        field_name="state",
        description="States that should be included. Available: CA, TX, FL, NY, IL, etc.",
        options=job_categories.get("state", []),
    ),
    CategoryFilter(
        operator=job_schema.state.not_in_,
        param_name="states_exclude",
        field_name="state",
        description="States that should be excluded.",
        options=job_categories.get("state", []),
    ),
    # Search city filters - dynamic values (many unique search cities)
    CategoryFilter(
        operator=job_schema.search_city.in_,
        param_name="search_cities_include",
        field_name="search_city",
        description="Search cities that should be included.",
        options=job_categories.get("search_city", []),
    ),
    CategoryFilter(
        operator=job_schema.search_city.not_in_,
        param_name="search_cities_exclude",
        field_name="search_city",
        description="Search cities that should be excluded.",
        options=job_categories.get("search_city", []),
    ),
    # Search country filters - available in categories.json
    CategoryFilter(
        operator=job_schema.search_country.in_,
        param_name="search_countries_include",
        field_name="search_country",
        description="Search countries that should be included. Available: United States, United Kingdom, Canada, Australia.",
        options=job_categories.get("search_country", []),
    ),
    CategoryFilter(
        operator=job_schema.search_country.not_in_,
        param_name="search_countries_exclude",
        field_name="search_country",
        description="Search countries that should be excluded. Available: United States, United Kingdom, Canada, Australia.",
        options=job_categories.get("search_country", []),
    ),
    # Company filters - dynamic values (many unique companies)
    CategoryFilter(
        operator=job_schema.company.in_,
        param_name="companies_include",
        field_name="company",
        description=company_description + " Companies that should be included.",
        options=job_categories.get("company", []),
    ),
    CategoryFilter(
        operator=job_schema.company.not_in_,
        param_name="companies_exclude",
        field_name="company",
        description=company_description + " Companies that should be excluded.",
        options=job_categories.get("company", []),
    ),
    # Company filters
    CategoryFilter(
        operator=job_schema.company.in_,
        param_name="companies_include",
        field_name="company",
        description=company_description + " Companies that should be included.",
        options=job_categories.get("company", []),
    ),
    # Job level filters - available in categories.json
    CategoryFilter(
        operator=job_schema.job_level.in_,
        param_name="job_levels_include",
        field_name="job_level",
        description=experience_level_description + " Job levels that should be included. Available: Associate, Mid Senior.",
        options=job_categories.get("job_level", []),
    ),
    CategoryFilter(
        operator=job_schema.job_level.not_in_,
        param_name="job_levels_exclude",
        field_name="job_level",
        description=experience_level_description + " Job levels that should be excluded.",
        options=job_categories.get("job_level", []),
    ),
    # Job type filters - available in categories.json
    CategoryFilter(
        operator=job_schema.job_type.in_,
        param_name="job_types_include",
        field_name="job_type",
        description=work_type_description + " Job types that should be included. Available: Onsite, Hybrid, Remote.",
        options=job_categories.get("job_type", []),
    ),
    CategoryFilter(
        operator=job_schema.job_type.not_in_,
        param_name="job_types_exclude",
        field_name="job_type",
        description=work_type_description + " Job types that should be excluded.",
        options=job_categories.get("job_type", []),
    ),
    # Job category filters - available in categories.json
    CategoryFilter(
        operator=job_schema.job_category.in_,
        param_name="job_categories_include",
        field_name="job_category",
        description="Job categories that should be included. Available: data_analyst, software_engineer, data_engineer, data_scientist.",
        options=job_categories.get("job_category", []),
    ),
    CategoryFilter(
        operator=job_schema.job_category.not_in_,
        param_name="job_categories_exclude",
        field_name="job_category",
        description="Job categories that should be excluded.",
        options=job_categories.get("job_category", []),
    ),
]


def apply_filters(query):
    """Apply all category filters to the query"""
    for filter_item in filters:
        # For dynamic fields (city, company, job_location, search_city) options may be empty
        # but we still want to enable the filtering capability
        param = sl.Param(
            filter_item.param_name,
            description=filter_item.description,
            options=filter_item.options if filter_item.options else None,
        )
        query = query.filter(filter_item.operator(param))
    
    return query
