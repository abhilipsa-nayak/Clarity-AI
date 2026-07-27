# AWS Deployment Guide for Clarity AI

This guide documents the step-by-step process for deploying the **Clarity AI** FastAPI backend + Vanilla JS frontend stack to AWS.

We detail two popular deployment pathways:
1. **AWS Elastic Beanstalk (PaaS - Recommended for Python)**
2. **AWS App Runner (Containerized - Modern Serverless)**

---

## Method 1: AWS Elastic Beanstalk (Recommended)

AWS Elastic Beanstalk is the easiest way to deploy Python web applications on AWS. It handles provisioning, load balancing, auto-scaling, and health monitoring.

### Step 1: Prepare the Project
1. Elastic Beanstalk looks for a `requirements.txt` in the root folder to install dependencies.
2. Create a file named `application.py` at the root of the project to act as the entry point (Elastic Beanstalk Python platform defaults to looking for a file named `application.py` containing an object named `application`):

Create `application.py`:
```python
import os
import sys

# Add root folder to sys path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.main import app as application

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("application:application", host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
```

### Step 2: Initialize Elastic Beanstalk CLI
In your local command terminal:
1. Install the Elastic Beanstalk CLI:
   ```bash
   pip install awsebcli
   ```
2. Initialize your Beanstalk application:
   ```bash
   eb init -p python-3.11 clarity-ai --region us-east-1
   ```
3. (Optional) Set up SSH access for debugging:
   ```bash
   eb init
   ```

### Step 3: Create the Environment & Deploy
1. Create a load-balanced Elastic Beanstalk environment:
   ```bash
   eb create clarity-ai-env --single
   ```
   *(Note: Use `--single` for free-tier single-instance deployment, or omit it to set up a Load Balancer).*
2. Wait 3-5 minutes for AWS to deploy the EC2 instance, security groups, and DNS.

### Step 4: Configure Environment Variables
1. Go to the **AWS Console** -> **Elastic Beanstalk** -> **Clarity-ai-env** -> **Configuration** -> **Updates, monitoring, and logging (Edit)**.
2. Under **Environment properties**, add:
   - `GEMINI_API_KEY` = `[Your Gemini API Key]`
   - `JWT_SECRET` = `[Your Secure Token Secret]`
   - `DATABASE_URL` = `sqlite:///./clarity.db` *(or your AWS RDS PostgreSQL connection string)*
3. Click **Apply**. Beanstalk will restart the instance with the new keys.
4. Retrieve your live URL using:
   ```bash
   eb status
   ```

---

## Method 2: AWS App Runner (Serverless Containerized)

AWS App Runner is a modern serverless service that builds and runs containerized web applications directly from a GitHub repository or Amazon ECR.

### Step 1: Create a `Dockerfile`
Create a `Dockerfile` at the root of the project:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Expose port
EXPOSE 8080

# Run FastAPI using Uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Step 2: Deploy on AWS App Runner Console
1. Open the **AWS App Runner Console**.
2. Click **Create Service**.
3. Under **Source**:
   - Select **Source code repository**.
   - Connect your GitHub account and select the **Clarity-AI** repository.
   - Choose branch **main**.
4. Under **Deployment settings**, choose **Automatic** (so it deploys on every git push).
5. Under **Configure build**:
   - Choose **Use a Dockerfile** (since we created one).
6. Under **Configure service**:
   - Set **Port** = `8080`.
   - Add the **Environment Variables**:
     - `GEMINI_API_KEY` = `[Your Gemini API Key]`
     - `JWT_SECRET` = `[Your Secret]`
7. Click **Create & Deploy**. App Runner will build the image and serve the application on a public HTTPS URL.

---

## Connecting AWS RDS (PostgreSQL Database)

For production environments, do not store user sessions in local SQLite (`clarity.db`). Connect to a managed database:

1. Open the **AWS RDS Console** and click **Create Database**.
2. Choose **PostgreSQL** (Standard Create, Free Tier template).
3. Configure DB instance identifier, master username, and password.
4. In **Connectivity**, ensure it belongs to the same VPC security group as your Beanstalk/App Runner service, or enable **Publicly Accessible** if deploying separately.
5. Once created, copy the connection URL:
   `postgresql://username:password@rds-endpoint-url.amazonaws.com:5432/dbname`
6. Paste this URL into your environment variable:
   - `DATABASE_URL` = `postgresql://...`
   - Your backend will automatically migrate and create the tables upon start.
