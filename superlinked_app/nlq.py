from superlinked import framework as sl
from superlinked_app.config import settings

openai_config = sl.OpenAIClientConfig(
    api_key=settings.openai_api_key.get_secret_value(),
    model=settings.openai_model,
)

# Consolidated descriptions for better maintainability
FIELD_DESCRIPTIONS = {
    "description": (
        "Extract 1-2 sentences describing job responsibilities and required qualifications. "
        "Focus on: technical skills, responsibilities, expertise areas. "
        "Exclude: salary, location, company, benefits. "
        "Leave empty if all requirements are captured by other parameters.\n"
        "Examples:\n"
        "• 'Data Analyst in CA with SQL' → 'Data analysis with SQL programming experience.'\n"
        "• 'Remote full-time entry level' → ''"
    ),
    
    "title": (
        "Extract the specific job title. Map common variations:\n"
        "• analyst, data analyst → Data Analyst\n"
        "• developer, programmer, software engineer → Software Engineer\n"
        "• ml engineer, data scientist → Data Scientist\n"
        "• etl developer, data engineer → Data Engineer"
    ),
    
    "location": (
        "Format: 'City, State' (US) or 'City, Country' (international).\n"
        "• US states: Use 2-letter codes (CA, TX, NY)\n"
        "• Countries: Use full names (United Kingdom, Canada)\n"
        "• Remote work: Use 'Remote'"
    ),
    
    "salary": (
        "Weight indicating salary preference (-1 to 1):\n"
        "• Positive: 'high salary', 'competitive', '$70K+', 'well-paid'\n"
        "• Negative: 'entry level pay', '$30-40K', 'budget position'\n"
        "• Zero: No salary preference mentioned"
    ),
    
    "experience_level": (
        "Map to dataset values:\n"
        "• Associate: entry level, junior, 1-3 years, associate\n"
        "• Mid Senior: experienced, senior, 3+ years, mid-level"
    ),
    
    "work_type": (
        "Work arrangement type:\n"
        "• Onsite: in-office, in-person, office-based\n"
        "• Hybrid: flexible, mixed, part remote\n"
        "• Remote: WFH, telecommute, fully remote"
    ),
    
    "skills": (
        "Extract all mentioned technical and soft skills from available list:\n"
        "Core: SQL, Python, AWS, Java, JavaScript, React, Docker, Kubernetes\n"
        "Data: Data Analysis, Machine Learning, Tableau, Power BI, Data Science\n"
        "Cloud: Azure, GCP, Snowflake\n"
        "Other: Git, Linux, Excel, Agile, Scrum, Communication, Problem Solving"
    )
}

# Simplified system prompt with clear structure
system_prompt = """Extract job search parameters from user queries using these rules:

## CORE PRINCIPLES
1. Only extract explicitly mentioned information - no assumptions
2. Use include filters for specific mentions, exclude filters for exclusions
3. When "in [country] but not [location]" → use country_include + location_exclude

## PARAMETER EXTRACTION

### Geographic Filters
- **search_countries_include**: Map UK→United Kingdom, US/USA→United States
- **states_include**: Use 2-letter codes (CA, TX) ONLY for explicit inclusions
- **states_exclude**: Use for "except/but not" mentions
- **cities_include**: Add specifically mentioned cities

### Job Filters
- **title**: See title mapping rules above
- **job_categories_include**: data_analyst, software_engineer, data_engineer, data_scientist
- **job_levels_include**: Associate (junior), Mid Senior (experienced)
- **job_types_include**: Onsite, Hybrid, Remote
- **companies_include**: Specific company names when mentioned

### Content Fields
- **description**: Job responsibilities and skills (1-2 sentences max)
- **skills**: Technical/soft skills from available list
- **salary**: Weight -1 to 1 based on salary preference

### Weights (defaults)
- title_weight: 1.0 (highest priority)
- skills_weight: 0.9 
- description_weight: 0.8

## EXAMPLES

Query: "Data Analyst jobs in California with SQL and Python"
→ title: "Data Analyst"
→ states_include: ["CA"]
→ skills: ["SQL", "Python"]
→ description: "Data analysis with SQL and Python programming experience."

Query: "Remote senior software engineer positions in US but not Texas"
→ title: "Software Engineer"
→ search_countries_include: ["United States"]
→ states_exclude: ["TX"]
→ job_types_include: ["Remote"]
→ job_levels_include: ["Mid Senior"]

Query: "Entry level data science roles with machine learning, high salary preferred"
→ job_categories_include: ["data_scientist"]
→ job_levels_include: ["Associate"]
→ skills: ["Machine Learning", "Data Science"]
→ salary: 0.8
"""

# If you need individual field descriptions, use the FIELD_DESCRIPTIONS dict
# Example: description_description = FIELD_DESCRIPTIONS["description"]