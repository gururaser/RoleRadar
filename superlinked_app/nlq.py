from superlinked import framework as sl

from superlinked_app.config import settings
from superlinked_app.index import load_categories

openai_config = sl.OpenAIClientConfig(
    api_key=settings.openai_api_key.get_secret_value(),
    model=settings.openai_model,
)


description_description = (
    "'description' should be one or two normalized sentences that describe the desired job position.\n"
    "Don't include salary, location, and company mentions in the 'description'.\n"
    "Focus on job responsibilities, required skills, and qualifications.\n"
    "Some examples of what should be captured in 'description': "
    "data analysis experience, software development skills, machine learning expertise, "
    "SQL database management, Python programming, cloud computing with AWS.\n"
    "In case all requirements are captured by other parameters (work type, experience level, etc.), "
    "description should be empty.\n"
    "Examples of 'description' generation: \n"
    "1. user_query: 'Data Analyst jobs in California with SQL and Python experience' "
    "-> description: 'Data analysis with SQL and Python programming experience.' \n"
    "2. user_query: 'Software Engineer positions with AWS and Docker skills' "
    "-> description: 'Software engineering with AWS cloud computing and Docker containerization.' \n"
    "3. user_query: 'Data Scientist roles with machine learning and statistics background' "
    "-> description: 'Data science with machine learning and statistical analysis expertise.' \n"
    "4. user_query: 'Remote full-time entry level jobs with good benefits' "
    "-> description: '' \n"
)

title_description = (
    "'title' should capture the specific job title or role mentioned in the query.\n"
    "Examples from dataset: 'Data Analyst', 'Software Engineer', 'Data Scientist', 'Data Engineer', "
    "'Senior Data Analyst', 'Junior Software Engineer', 'Machine Learning Engineer', 'DevOps Engineer'.\n"
    "Map common variations: "
    "'data analyst', 'analyst' -> 'Data Analyst'; "
    "'software engineer', 'developer', 'programmer' -> 'Software Engineer'; "
    "'data scientist', 'ml engineer' -> 'Data Scientist'; "
    "'data engineer', 'etl developer' -> 'Data Engineer'.\n"
    "If no specific title is mentioned, use empty string.\n"
)

location_description = (
    "Name of the city and state like 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA'.\n"
    "Common locations from dataset: California, Texas, Florida, New York, Illinois, Virginia, Pennsylvania.\n"
    "Handle variations: 'California' -> 'CA', 'Texas' -> 'TX', 'Florida' -> 'FL', 'New York' -> 'NY'.\n"
    "If remote work is mentioned, use 'Remote'.\n"
    "If location can't be determined, use None for 'location'.\n"
)

salary_description = (
    "Weight of the salary preference. "
    "Higher value means preference for higher salaries, "
    "lower value means preference for lower salaries. "
    "Pay periods available in dataset: HOURLY, YEARLY, MONTHLY, WEEKLY, BIWEEKLY. "
    "Currency options: USD, CAD, BBD, EUR, AUD, GBP. "
    "Compensation type: BASE_SALARY. "
    "Weight depends on salary-related terms: "
    "positive weight: 'high salary', 'well-paid', 'competitive pay', '$50+ hour', '$70K+', 'top salary'; "
    "negative weight: 'entry level pay', 'starting salary', '$15-20 hour', '$30K-40K', 'budget position'; "
    "0 should be used if no salary preference is mentioned."
)

experience_level_description = (
    "Experience level requirement mentioned in the query. "
    "Map to dataset values: 'Mid Senior', 'Associate'. "
    "Common mappings from job descriptions: "
    "'1-3 years experience', 'associate level', 'junior' -> 'Associate'; "
    "'experienced', 'senior', '3+ years', 'mid level', 'mid-senior' -> 'Mid Senior'. "
    "If no experience level is specified, use None."
)

work_type_description = (
    "Type of work arrangement mentioned in the query. "
    "Options from dataset: 'Onsite', 'Hybrid', 'Remote'. "
    "Map variations: 'on-site', 'in-office', 'in-person' -> 'Onsite'; "
    "'hybrid', 'flexible', 'mixed' -> 'Hybrid'; "
    "'remote', 'work from home', 'WFH', 'telecommute' -> 'Remote'. "
    "If no work type is specified, use None."
)

remote_preference_description = (
    "Remote work preference mentioned in the query. "
    "Options: 'Remote', 'Hybrid', 'Onsite'. "
    "Map common terms: "
    "'remote', 'work from home', 'WFH', 'telecommute' -> 'Remote'; "
    "'hybrid', 'flexible schedule', 'mixed' -> 'Hybrid'; "
    "'on-site', 'in-office', 'in person', 'onsite' -> 'Onsite'. "
    "If no preference is mentioned, use None."
)

company_description = (
    "Specific company name mentioned in the query. "
    "Examples could include: 'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Netflix', "
    "'Tesla', 'Uber', 'Airbnb', or any specific company name mentioned. "
    "Include company types: 'tech company', 'startup', 'consulting firm', 'financial services'. "
    "If no specific company is mentioned, use None."
)

skills_description = (
    "Technical skills or technologies mentioned in the query. "
    "Available skills from dataset: 'SQL', 'Python', 'AWS', 'Java', 'Data Analysis', 'Communication', "
    "'Tableau', 'Agile', 'JavaScript', 'Power BI', 'Data Visualization', 'Machine Learning', 'Azure', "
    "'Excel', 'Git', 'Kubernetes', 'Docker', 'C#', 'Project Management', 'ETL', 'C++', 'Spark', "
    "'Linux', 'Data Science', 'Reporting', 'Snowflake', 'Problem Solving', 'Statistics', "
    "'Data Engineering', 'Teamwork', 'React', 'Kafka', 'DevOps', 'Collaboration', 'Software Development', "
    "'Software Engineering', 'Scrum', 'Business Intelligence', 'Data Modeling', 'Scala', 'GCP', "
    "'Business Analysis', 'Computer Science', 'NoSQL', 'HTML', 'Data Warehousing'. "
    "Extract all relevant technical and soft skills mentioned in the query."
)

system_prompt = (
    "Extract the job search parameters from the user query based on real job posting data.\n"
    "Guidelines based on actual dataset patterns:\n\n"
    "**'description' field**\n"
    "Focus on specific job responsibilities and required skills. "
    "Examples: 'data analysis and SQL programming', 'software development with Python and AWS', "
    "'machine learning and statistical analysis'.\n\n"
    "**'title' field**\n"
    "Extract specific job titles. Common dataset examples: "
    "'Data Analyst', 'Software Engineer', 'Data Scientist', 'Data Engineer', "
    "'Senior Data Analyst', 'Machine Learning Engineer'.\n\n"
    "**'location' field**\n"
    "Include city and state format like 'San Francisco, CA' or 'New York, NY'. "
    "Use 'Remote' for remote positions.\n\n"
    "**'experience_level' field**\n"
    "Map to: 'Associate' (junior-mid level), 'Mid Senior' (3+ years experience). "
    "If not specified, use None.\n\n"
    "**'work_type' field**\n"
    "Options: 'Onsite', 'Hybrid', 'Remote'. "
    "Map variations appropriately.\n\n"
    "**'salary' field**\n"
    "Consider pay periods: HOURLY, YEARLY, MONTHLY, WEEKLY, BIWEEKLY. "
    "Currencies: USD, CAD, EUR, AUD, GBP. Compensation type: BASE_SALARY. "
    "Positive weight for 'competitive', 'high salary'. Negative for 'entry level pay'.\n\n"
    "**'skills' field**\n"
    "Include technical and soft skills from available list: 'SQL', 'Python', 'AWS', 'Java', "
    "'Data Analysis', 'Machine Learning', 'Tableau', 'JavaScript', 'Docker', 'React', etc.\n\n"
    "**'company' field**\n"
    "Include specific company names or types: 'Google', 'Microsoft', 'tech startup', "
    "'consulting firm', 'financial services'.\n\n"
    "**'remote_preference' field**\n"
    "Options: 'Remote', 'Hybrid', 'Onsite'. "
    "Many tech jobs offer remote/hybrid options.\n\n"
    "**'job_category' field**\n"
    "Available categories: 'data_analyst', 'software_engineer', 'data_engineer', 'data_scientist'. "
    "Map job titles to appropriate categories.\n"
)