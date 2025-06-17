from superlinked import framework as sl

from superlinked_app.index import job_schema, index
from superlinked_app.query import query, query_debug
from superlinked_app.config import settings

rest_source_speech = sl.RestSource(job_schema)

vector_database = sl.QdrantVectorDatabase(
    url=settings.qdrant_url, api_key=settings.qdrant_api_key
)

config = sl.DataLoaderConfig(
    path=settings.path_dataset,
    format=sl.DataFormat.CSV,
    name="job_postings",
    pandas_read_kwargs={"lines": True, "chunksize": settings.chunk_size},
)
loader_source_speech = sl.DataLoaderSource(job_schema, config)

executor = sl.RestExecutor(
    sources=[
        rest_source_speech,
        loader_source_speech,
    ],
    indices=[index],
    queries=[
        sl.RestQuery(sl.RestDescriptor("job"), query),
        sl.RestQuery(sl.RestDescriptor("job-debug"), query_debug),
    ],
    vector_database=vector_database,
)

sl.SuperlinkedRegistry.register(executor)