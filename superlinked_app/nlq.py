import json
import urllib.request
import os
from pathlib import Path

from superlinked import framework as sl

from superlinked_app.config import settings

openai_config = sl.OpenAIClientConfig(
    api_key=settings.openai_api_key.get_secret_value(),
    model=settings.openai_model,
)


def get_job_categories() -> dict:
    """Get job categories from the low_cardinality_categories.json file"""
    # Determine the path to the JSON file
    current_dir = Path(__file__).parent
    data_file = current_dir.parent / "data" / "low_cardinality_categories.json"
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            categories = json.load(f)
        
        # Return the original categories
        return categories
    except FileNotFoundError:
        # Return empty dict if file not found
        return {}
    except json.JSONDecodeError:
        # Return empty dict if JSON cannot be parsed
        return {}


description_description = (
    "'description' should be one or two normalized sentences that describe the desired job position.\n"
    "Don't include salary, location, and company mentions in the 'description'.\n"
    "Focus on job responsibilities, required skills, and qualifications.\n"
    "Some examples of what should be captured in 'description': "
    "graphic design experience, marketing coordination, customer service skills, "
    "therapeutic counseling, legal research, restaurant management, team leadership.\n"
    "In case all requirements are captured by other parameters (work type, experience level, etc.), "
    "description should be empty.\n"
    "Examples of 'description' generation: \n"
    "1. user_query: 'Marketing coordinator jobs in New Jersey with Adobe Creative Suite experience' "
    "-> description: 'Marketing coordinator with Adobe Creative Suite and graphic design experience.' \n"
    "2. user_query: 'Mental health therapist positions offering supervision and EMDR training' "
    "-> description: 'Mental health therapist with EMDR training and clinical supervision.' \n"
    "3. user_query: 'Restaurant manager roles in Cincinnati with team leadership' "
    "-> description: 'Restaurant management with team leadership and customer service experience.' \n"
    "4. user_query: 'Full-time entry level jobs with good benefits' "
    "-> description: '' \n"
)

title_description = (
    "'title' should capture the specific job title or role mentioned in the query.\n"
    "Examples from dataset: 'Marketing Coordinator', 'Mental Health Therapist', 'Assistant Restaurant Manager', "
    "'Senior Associate Attorney', 'Customer Service Representative', 'Graphic Designer'.\n"
    "Map common variations: "
    "'therapist', 'counselor' -> 'Mental Health Therapist'; "
    "'marketing coord' -> 'Marketing Coordinator'; "
    "'restaurant mgr' -> 'Restaurant Manager'.\n"
    "If no specific title is mentioned, use empty string.\n"
)

location_description = (
    "Name of the city and state like 'Princeton, NJ', 'Fort Collins, CO', 'Cincinnati, OH'.\n"
    "Common locations from dataset: Princeton NJ, Fort Collins CO, Cincinnati OH, New York NY.\n"
    "Handle variations: 'New Jersey' -> 'NJ', 'Colorado' -> 'CO', 'Ohio' -> 'OH'.\n"
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
    "Map to dataset values: 'Entry level', 'Mid-Senior level', 'Associate', 'Director', 'Internship', 'Executive'. "
    "Common mappings from job descriptions: "
    "'1-3 years experience', 'entry level', 'new grad' -> 'Entry level'; "
    "'experienced', 'senior', '3+ years', 'mid level' -> 'Mid-Senior level'; "
    "'associate level', 'junior senior' -> 'Associate'; "
    "'management', 'supervisor', 'lead', 'manager' -> 'Director'; "
    "'intern', 'student', 'internship program' -> 'Internship'; "
    "'executive', 'VP', 'C-level', 'senior leadership' -> 'Executive'."
)

work_type_description = (
    "Type of employment mentioned in the query. "
    "Options from dataset: 'Full-time', 'Internship', 'Contract', 'Part-time', 'Temporary', 'Volunteer', 'Other'. "
    "Most jobs in dataset are 'Full-time'. "
    "Map variations: 'FT' -> 'Full-time', 'PT' -> 'Part-time', 'contractor' -> 'Contract', "
    "'intern' -> 'Internship', 'temp' -> 'Temporary', 'volunteer work' -> 'Volunteer'."
)

remote_preference_description = (
    "Remote work preference mentioned in the query. "
    "Options: 'Remote', 'Hybrid', 'On-site', 'In-person'. "
    "Dataset shows mix of remote and in-person positions. "
    "Map common terms: "
    "'remote', 'work from home', 'WFH', 'telehealth' -> 'Remote'; "
    "'hybrid', 'flexible schedule' -> 'Hybrid'; "
    "'on-site', 'in-office', 'in person' -> 'On-site'."
)

company_description = (
    "Specific company name mentioned in the query. "
    "Examples from dataset: 'Corcoran Sawyer Smith', 'The National Exemplar', 'Abrams Fensterman LLP'. "
    "Include company types: 'real estate firm', 'law firm', 'restaurant', 'healthcare practice'. "
    "If no specific company is mentioned, use None."
)

skills_description = (
    "Technical skills or technologies mentioned in the query. "
    "Examples from dataset: 'Adobe Creative Cloud', 'Photoshop', 'Illustrator', 'InDesign', "
    "'Microsoft Office', 'EMDR', 'clinical supervision', 'graphic design', 'marketing', "
    "'customer service', 'team leadership', 'event planning'. "
    "Include both technical and soft skills. Extract all relevant skills mentioned."
)

system_prompt = (
    "Extract the job search parameters from the user query based on real job posting data.\n"
    "Guidelines based on actual dataset patterns:\n\n"
    "**'description' field**\n"
    "Focus on specific job responsibilities and required skills. "
    "Examples: 'graphic design and marketing coordination', 'mental health therapy with EMDR', "
    "'restaurant management with team leadership'.\n\n"
    "**'title' field**\n"
    "Extract specific job titles. Common dataset examples: "
    "'Marketing Coordinator', 'Mental Health Therapist', 'Assistant Restaurant Manager', "
    "'Senior Associate Attorney', 'Customer Service Representative'.\n\n"
    "**'location' field**\n"
    "Include city and state format like 'Princeton, NJ' or 'Fort Collins, CO'. "
    "Use 'Remote' for remote positions.\n\n"
    "**'experience_level' field**\n"
    "Map to: 'Entry level' (0-2 years), 'Mid-Senior level' (3+ years), 'Associate' (junior-mid level), "
    "'Director' (management), 'Internship' (students/interns), 'Executive' (C-level).\n\n"
    "**'work_type' field**\n"
    "Options: 'Full-time', 'Internship', 'Contract', 'Part-time', 'Temporary', 'Volunteer', 'Other'. "
    "Most common is 'Full-time'.\n\n"
    "**'salary' field**\n"
    "Consider pay periods: HOURLY, YEARLY, MONTHLY, WEEKLY, BIWEEKLY. "
    "Currencies: USD, CAD, BBD, EUR, AUD, GBP. Compensation type: BASE_SALARY. "
    "Positive weight for 'competitive', 'high salary'. Negative for 'entry level pay'.\n\n"
    "**'skills' field**\n"
    "Include both technical and soft skills: 'Adobe Creative Suite', 'Microsoft Office', "
    "'EMDR', 'customer service', 'team leadership', 'clinical documentation'.\n\n"
    "**'company' field**\n"
    "Include specific company names or types: 'real estate firm', 'mental health practice', "
    "'law firm', 'restaurant'.\n\n"
    "**'remote_preference' field**\n"
    "Options: 'Remote', 'Hybrid', 'On-site'. Many healthcare/legal jobs are 'On-site', "
    "while some offer 'telehealth' or 'flexible' options.\n"
)