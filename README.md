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
- OpenAI API Key
- curl (for data loading)
- jq (for JSON processing)
- Make (optional, for command convenience)

## 🚀 Installation and Setup

### Prerequisites
Before starting the installation, you need to:

1. **Download Required Datasets**: Download the following datasets from Kaggle and place them in the `data/` folder with correct naming:
   - `data_analyst_jobs.csv` - [Data Analyst Jobs](https://www.kaggle.com/datasets/asaniczka/data-analyst-job-postings)
   - `data_engineer_jobs.csv` - [Data Engineer Jobs](https://www.kaggle.com/datasets/asaniczka/linkedin-data-engineer-job-postings)
   - `data_scientist.csv` - [Data Scientist Jobs](https://www.kaggle.com/datasets/asaniczka/data-scientist-linkedin-job-postings)
   - `software_engineer_jobs.csv` - [Software Engineer Jobs](https://www.kaggle.com/datasets/asaniczka/software-engineer-job-postings-linkedin)

2. **Run Data Processing**: Execute the notebook to process and combine the datasets:
   ```bash
   # Navigate to notebook directory and run the EDA notebook
   jupyter notebook notebook/eda.ipynb
   ```
   Make sure to run all cells in the notebook to generate the `combined_jobs_dataset.csv` and `categories.json` files.

### Quick Start
```bash
# After completing prerequisites, install system and load data
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

### Dataset Features
Each dataset typically includes:
- Job titles and descriptions
- Company information
- Location and salary ranges
- Required skills and experience levels
- Application links and posting dates

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

