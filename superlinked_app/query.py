from superlinked import framework as sl

from superlinked_app.filters import apply_filters
from superlinked_app.index import (
    description_space,
    index,
    job_schema,
    skills_space,
    title_space,
)
from superlinked_app.nlq import (
    description_description,
    openai_config,
    skills_description,
    system_prompt,
    title_description,
)

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
        sl.Param("description", description=description_description),
        weight=sl.Param("similar_description_weight", default=0.8),
    )
    .similar(
        title_space.text,
        sl.Param("title", description=title_description),
        weight=sl.Param("similar_title_weight", default=1.0),
    )
    .similar(
        skills_space.category,
        sl.Param("skills", description=skills_description),
        weight=sl.Param("similar_skills_weight", default=0.9),
    )
)

# We can specify number of retrieved results like this:
query = query.limit(sl.Param("limit", default=10))

# We want all fields to be returned
query = query.select_all()

# .. and all the metadata including knn_params and partial_scores
query = query.include_metadata()

# Apply filters
query = apply_filters(query)

# And finally, let's add natural language interface on top
# that will call LLM to parse user natural query
# into structured superlinked query, i.e. suggest parameters values.
query = query.with_natural_query(
    natural_query=sl.Param("natural_query"),
    client_config=openai_config,
    system_prompt=system_prompt,
)