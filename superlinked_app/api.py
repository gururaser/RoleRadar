from superlinked import framework as sl

from superlinked_app.index import index, job_schema
from superlinked_app.query import query, query_debug, similar_jobs_query
from superlinked_app.config import settings

# Setup the executor
rest_source = sl.RestSource(job_schema)

vector_database = sl.QdrantVectorDatabase(
    url=settings.qdrant_url, 
    api_key=settings.qdrant_api_key,
    #search_algorithm=sl.SearchAlgorithm.HNSW,
    prefer_grpc=True
)

config = sl.DataLoaderConfig(
    path=settings.path_dataset,
    format=sl.DataFormat.CSV,
    name="job_postings",
    pandas_read_kwargs={"chunksize": settings.chunk_size},
)
loader_source = sl.DataLoaderSource(job_schema, config)

executor = sl.RestExecutor(
    sources=[
        rest_source,
        loader_source,
    ],
    indices=[index],
    queries=[
        sl.RestQuery(sl.RestDescriptor("job"), query),
        sl.RestQuery(sl.RestDescriptor("job-debug"), query_debug),
        sl.RestQuery(sl.RestDescriptor("similar-jobs"), similar_jobs_query),
    ],
    vector_database=vector_database,
)

sl.SuperlinkedRegistry.register(executor)
