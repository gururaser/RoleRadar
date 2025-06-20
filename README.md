<div align="left">
  <img src="https://github.com/gururaser/RoleRadar/blob/main/frontend/public/roleradar_logo_github.png" alt="RoleRadar Logo" width="1200" height="600">
</div>

# RoleRadar

*Spot your next role in a heartbeat.*

RoleRadar allows job seekers to find the most relevant opportunities instantly by describing their dream position in everyday language. Powered by Superlinked and Qdrant, RoleRadar transforms queries like:

> "Data Analyst roles in New York with SQL experience."
>
> …into a precise blend of **structural filters** (location, salary, seniority) and **semantic similarity** across job descriptions, skill tags, and company culture notes.

# Demo
https://github.com/user-attachments/assets/4b88141d-50ff-430a-abe0-1b65e6a649ff



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
- Make (optional, for command convenience)
- For GPU mode: NVIDIA GPU with Docker GPU support

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
# You will be prompted to choose between CPU and GPU mode
make install

# Start all services
make run
```

### Installation Options

During installation, you will be prompted to select processing mode:

**CPU Mode (Recommended for most systems):**
- Works on all systems
- Uses CPU for embedding processing
- Slower but more compatible

**GPU Mode (For systems with NVIDIA GPU):**
- Requires NVIDIA GPU and Docker GPU support
- Faster embedding processing
- Better performance for large datasets

### Manual Installation
```bash
# Build and start services with CPU mode
docker compose -f docker-compose.cpu.yml up -d --build

# OR build and start services with GPU mode
docker compose -f docker-compose.gpu.yml up -d --build

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
make install       # Interactive installation with CPU/GPU selection
make run           # Start all services (smart mode detection)
make run-cpu       # Start all services with CPU mode
make run-gpu       # Start all services with GPU mode
make run-backend   # Start only backend services
make run-frontend  # Start only frontend service
make stop          # Stop all services
make clean         # Stop services and remove containers/volumes
make logs          # Show logs from all services
make status        # Check service status
```

### Smart Service Management

**Interactive `make run` Command:**
The `make run` command intelligently detects your current setup:
1. **If services are already running:** Restarts with the existing configuration (CPU or GPU)
2. **If no services are running:** Prompts you to choose between CPU and GPU mode
3. **Seamless switching:** You can easily switch between modes

**Direct Mode Commands:**
- `make run-cpu` - Force start with CPU processing mode
- `make run-gpu` - Force start with GPU processing mode

**Example Usage:**
```bash
# First time setup
make install        # Choose CPU or GPU during installation

# Smart restart (uses last configuration)
make run           

# Switch modes easily
make stop
make run-cpu       # Force CPU mode
# or
make run-gpu       # Force GPU mode
```

### Installation Process

The `make install` command will:
1. Prompt you to choose between CPU and GPU processing mode
2. Build and start the appropriate Docker containers
3. Wait for services to initialize
4. Automatically load the job data into the vector database
5. Verify that all services are running correctly

### Processing Modes

**CPU Mode:**
- Uses `docker-compose.cpu.yml` configuration
- Suitable for development and smaller datasets
- No special hardware requirements

**GPU Mode:**
- Uses `docker-compose.gpu.yml` configuration  
- Requires NVIDIA GPU with Docker GPU support
- Significantly faster for large-scale embedding processing

### Dataset Features
Each dataset typically includes:
- Job titles and descriptions
- Company information
- Location and salary ranges
- Required skills and experience levels
- Application links and posting dates

## ⚠️ Limitations

Please note the following limitations of the current demo version:

### Data Scope
- **Job Categories**: Only includes 4 job categories:
  - Data Analyst positions
  - Data Engineer positions  
  - Data Scientist positions
  - Software Engineer positions

### Geographic Coverage
- **Countries**: Limited to job postings from:
  - 🇺🇸 United States
  - 🇬🇧 United Kingdom
  - 🇦🇺 Australia
  - 🇨🇦 Canada

### Temporal Coverage
- **Data Currency**: Job postings are from **2023 only**
- Data may not reflect current market conditions or available positions

### Data Volume
- The demo dataset contains a subset of available job postings
- Results may be limited compared to comprehensive job search platforms

**Note**: This is a demonstration version. In a production environment, the system could be easily extended to include:
- Additional job categories and industries
- Global geographic coverage
- Real-time job posting updates
- Larger and more diverse datasets

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

### GPU Mode Issues
```bash
# Check if NVIDIA Docker is installed
docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi

# Check GPU availability in container
docker compose -f docker-compose.gpu.yml exec superlinked nvidia-smi
```

### Switching Between CPU and GPU Mode
```bash
# Simple mode switching (data is preserved)
make stop
make run-cpu   # Switch to CPU mode
# OR
make run-gpu   # Switch to GPU mode

# Alternative: Use interactive selection
make stop
make run       # Will prompt you to choose mode
```

**Note**: Your data is automatically preserved when switching between modes since both configurations use the same Qdrant volume.

### Port conflicts
Check the port settings in the Docker Compose files and modify them if necessary.

