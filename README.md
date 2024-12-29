# Nest.js TypeORM Boilerplate

## Code Guidelines

### DTO (Data Transfer Object) Rules 

**All Responses via DTO** 
- Every API response must use a Data Transfer Object (DTO). Direct entity returns are not allowed. DTOs provide abstraction, ensuring the stability and security of external interfaces. 

**Inheritance from Base Entity DTO** 
- All response DTOs must extend from the `base-<entity-name>.dto`. This enforces consistency and includes shared properties like `id`, `createdAt`, and `updatedAt` across DTOs.

**Entities and DTOs**
- Every entity must have a corresponding Base DTO. The DTO should reflect the structure of the entity but expose only necessary fields, protecting sensitive or internal data.

## AWS Deployment Guide

### 1. Network and Storage Setup

#### Create VPC (Optional)
Set up a custom VPC if required.

#### Create ECR
Amazon Elastic Container Registry (ECR) for Docker images.

#### Create Security Group
Ensure necessary inbound and outbound rules for your EC2 and services.

#### Create S3 Bucket
Set up S3 for storage and artifact management.

### 2. Launch EC2 Instance

#### 1. Launch Ubuntu EC2 Instance
Select an Ubuntu for your EC2 instance.

#### 2. Connect to EC2
```
ssh -i /path/to/your-ssh-key.pem ubuntu@<EC2_PUBLIC_IP>
```

#### 3. Install Docker
```
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```
Verify Docker Installation:
```
docker --version
```
Add User to Docker Group (Optional):\
*By default, Docker creates a group called docker, which grants permissions to interact with the Docker daemon. To avoid running Docker commands as root, you can add your user to the Docker group.*

```
sudo usermod -aG docker $USER
```
Then log out and log back in to apply the group change, or you can run
```
newgrp docker
```

#### 4. Install AWS CLI
```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip
unzip awscliv2.zip
sudo ./aws/install
```
Verify AWS CLI Installation:
```
aws --version
```

#### 5. Install NGINX
```
sudo apt install nginx
```
Open Config:
```
sudo nano /etc/nginx/sites-available/default
```
NGINX Config:
```
server {
    listen 80;
    server_name <EC2_PUBLIC_IP>;

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-Prefix '/api';
    }

    location /docs/ {
        proxy_pass http://localhost:3000/docs/;
    }
}
```

Restart NGINX:
```
sudo systemctl restart nginx
```

### 3. Database Setup (RDS)

Create PostgreSQL database instance on Amazon RDS.

### 4. IAM Roles and Policies

#### 1. Create IAM Role for EC2 (ECR Access)
- **Trusted Entity Type:** AWS Service
- **Service or Use Case:** EC2
- **Permissions policies:** AmazonEC2ContainerRegistryReadOnly
- **Attach IAM Role to EC2 Instance:** Actions -> Security -> Modify IAM Role

#### 2. Create IAM User for CLI
- **Use Case:** Command Line Interface (CLI)
- **Permissions options:** Attach policies directly
- **Permissions policies:** AmazonEC2ContainerRegistryPowerUser, AmazonEC2FullAccess
- **Inline S3 Policy:**
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::bucket_name/*"
            ]
        }
    ]
}
```
- **Save Access Key ID and Secret Access Key**

### 5. GitHub Secrets Setup
Fill secrets from your `staging.yml`:
```
STAGING_AWS_ACCESS_KEY_ID: <IAM User Access Key>  
STAGING_AWS_SECRET_ACCESS_KEY: <IAM User Secret Key>  
STAGING_AWS_ECR_REGION: <AWS ECR Region>  
STAGING_AWS_ECR_REPOSITORY: <ECR Repository Name>  
STAGING_AWS_S3_REGION: <AWS S3 Region>  
STAGING_AWS_S3_BUCKET: <S3 Bucket Name>  
STAGING_DB_HOST: <Database Host>  
STAGING_DB_PASSWORD: <Database Password>  
STAGING_REDIS_HOST: redis  
STAGING_REDIS_PASSWORD: <Create Your Redis Password>  
STAGING_SMTP_HOST: <SMTP Host>  
STAGING_SMTP_USER: <SMTP Username>  
STAGING_SMTP_PASSWORD: <SMTP Password>  
STAGING_SMTP_PORT: <SMTP Port>    
STAGING_SMTP_FROM: <Sender Email Address>  
STAGING_FRONTEND_URL: <Frontend URL>  
STAGING_JWT_SECRET: <JWT Secret>  
STAGING_AWS_EC2_HOST: <EC2 Instance Host>  
STAGING_AWS_EC2_SSH_PORT: 22  
STAGING_AWS_EC2_USERNAME: ubuntu  
STAGING_AWS_EC2_SSH_KEY: <Base64 Encoded SSH Key>  

```

## Migrations

- To create an empty migration:  
  `npm run migration:create --name=<migration-name>`

- To generate a migration:  
  `npm run migration:generate --name=<migration-name>`

- To revert the last migration:  
  `npm run migration:revert`

- To run a migration:  
  `npm run migration:run`

  > **NOTE:** Migrations run automatically in both staging and production environments.
  