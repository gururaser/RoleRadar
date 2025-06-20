<div align="left">
  <img src="https://github.com/gururaser/RoleRadar/blob/main/frontend/public/roleradar_logo_github.png" alt="RoleRadar Logo" width="1200" height="600">
</div>

# RoleRadar

*Spot your next role in a heartbeat.*

RoleRadar allows job seekers to find the most relevant opportunities instantly by describing their dream position in everyday language. Powered by Superlinked and Qdrant, RoleRadar transforms queries like:

> "Data Analyst roles in New York with SQL experience."
>
> …into a precise blend of **structural filters** (location, salary, seniority) and **semantic similarity** across job descriptions, skill tags, and company culture notes.

## 🚀 Features

- **Natural Language Queries**: Describe job positions in everyday language
- **Semantic Search**: Vector-based similarity analysis
- **Smart Filters**: Automatically detected structural filters
- **Modern UI**: User-friendly interface built with Next.js and Tailwind CSS
- **Real-time Results**: Fast and instant search results
- **Similar Job Recommendations**: Job opportunities similar to your selected position

## 🏗️ Technology Stack

### Backend
- **Superlinked**: Vector search engine
- **Qdrant**: Vector database
- **Python**: API and data processing
- **Docker**: Containerization

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling
- **React Hooks**: State management

### Data
- Comprehensive job position dataset
- Data Analyst, Data Engineer, Data Scientist, and Software Engineer positions
- JSON-based category system

## 📋 Requirements

- Docker and Docker Compose
- curl (for data loading)
- jq (for JSON processing)
- Make (optional, for command convenience)

## 🚀 Installation and Setup

### Quick Start
```bash
# Install system and load data
make install

# Start all services
make run
```

### Manual Installation
```bash
# Build and start services
docker compose up -d --build

# Manually perform data loading
# (Details available in Makefile)
```

## 🎯 Usage

After installation is complete, you can access the following addresses:

- **Frontend Application**: http://localhost:3000
- **Superlinked API**: http://localhost:8080
- **Qdrant API**: http://localhost:6333

### Search Examples

RoleRadar understands natural, conversational queries. You can search using various styles:

1. **Simple Search**: "Python developer"
2. **Detailed Search**: "Senior data scientist with machine learning experience in San Francisco"
3. **Skill-focused**: "Fullstack developer with React, Node.js, and AWS skills"
4. **Conversational Style**: "I need Data Analyst job, I'm skilled in SQL and Data Analysis, I live in UK, Remote if possible"
5. **Location-specific**: "Remote Python jobs or positions in New York City"
6. **Experience-based**: "Entry level software engineer positions, fresh graduate with Java background"

## 🛠️ Make Commands

```bash
make help          # Display all commands
make install       # Install system and load data
make run           # Start all services
make run-backend   # Start only backend services
make run-frontend  # Start only frontend service
make stop          # Stop all services
make clean         # Stop services and remove containers/volumes
make logs          # Show logs from all services
make status        # Check service status
```

## 📊 Data Structure

The project includes the following datasets from Kaggle:

- **Data Analyst Jobs** - [Kaggle Dataset](https://www.kaggle.com/datasets/asaniczka/data-analyst-job-postings)
  - File: `data_analyst_jobs.csv`
  - Contains comprehensive data analyst job postings from LinkedIn

- **Data Engineer Jobs** - [Kaggle Dataset](https://www.kaggle.com/datasets/asaniczka/linkedin-data-engineer-job-postings)
  - File: `data_engineer_jobs.csv`
  - LinkedIn data engineer job postings with detailed requirements

- **Data Scientist Jobs** - [Kaggle Dataset](https://www.kaggle.com/datasets/asaniczka/data-scientist-linkedin-job-postings)
  - File: `data_scientist.csv`
  - Data scientist positions from LinkedIn with skill requirements

- **Software Engineer Jobs** - [Kaggle Dataset](https://www.kaggle.com/datasets/asaniczka/software-engineer-job-postings-linkedin)
  - File: `software_engineer_jobs.csv`
  - Software engineering roles from LinkedIn

- **Categories Configuration**
  - File: `categories.json`
  - Job categories and filter configurations

### Dataset Features
Each dataset typically includes:
- Job titles and descriptions
- Company information
- Location and salary ranges
- Required skills and experience levels
- Application links and posting dates

## 🔧 Development

### Cloning the Project
```bash
git clone <repository-url>
cd RoleRadar
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd superlinked_app
pip install -r requirements.txt
python api.py
```

## 📁 Project Structure

```
RoleRadar/
├── data/                   # Data files
├── frontend/              # Next.js frontend application
│   ├── app/              # App router
│   ├── components/       # React components
│   └── types/           # TypeScript types
├── superlinked_app/      # Python backend API
├── notebook/            # Data analysis and EDA
├── docker-compose.yml   # Docker services
└── Makefile            # Automated commands
```

## 🚀 Future Enhancements

RoleRadar is continuously evolving. Here are some exciting features planned for future releases:

### 🎯 Personalized Search
- **CV/Resume Upload**: Upload your resume and get personalized job recommendations based on your experience and skills
- **Skill Gap Analysis**: Identify missing skills for desired positions and get learning recommendations
- **Career Path Suggestions**: Get insights on potential career progression paths

### 🤖 AI-Powered Features
- **Interview Preparation**: AI-generated interview questions based on job requirements
- **Salary Negotiation Insights**: Data-driven salary range suggestions
- **Company Culture Matching**: Match personal preferences with company culture descriptions

### 📊 Advanced Analytics
- **Market Trends**: Job market trends and demand forecasting
- **Skill Demand Analysis**: Most in-demand skills by location and role
- **Application Tracking**: Track your job applications and success rates

### 🔔 Smart Notifications
- **Job Alerts**: Customizable notifications for new matching positions
- **Application Deadlines**: Reminders for important application dates
- **Market Updates**: Weekly insights on job market changes

### 🌐 Enhanced Integration
- **LinkedIn Integration**: Direct application through LinkedIn
- **Calendar Integration**: Schedule interviews directly from the platform
- **Portfolio Showcase**: Display your projects and achievements

## 🤝 Contributing

1. Fork this project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push your branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Services not starting
```bash
# Check Docker status
make status

# Review logs
make logs
```

### Data not loading
```bash
# Check Qdrant connection
curl http://localhost:6333/collections

# Check Superlinked API
curl http://localhost:8080/health
```

### Port conflicts
Check the port settings in the Docker Compose file and modify them if necessary.

