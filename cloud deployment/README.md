# Cloud Deployment - Zero to Hero (Hinglish Learning Repo)

> Ye repo mera personal learning notes hai - Cloud Deployment ko bilkul scratch se samajhne ke liye. Language Hinglish rakhi hai taaki concept dimaag me ghuse, ratta na lage.

## Table of Contents

1. [Cloud Deployment Intro - Deep Me Samjho](#1-cloud-deployment-intro---deep-me-samjho)
2. [AWS Kya Hai? Core Concepts](#2-aws-kya-hai-core-concepts)
3. [EC2 Step-by-Step - Node App Live Karna](#3-ec2-step-by-step---node-app-live-karna)
4. [S3 Step-by-Step - File Storage Ka Baadshah](#4-s3-step-by-step---file-storage-ka-baadshah)
5. [ECR + ECS Step-by-Step - Docker Ko Production Me Chalana](#5-ecr--ecs-step-by-step---docker-ko-production-me-chalana)
6. [CI/CD Step-by-Step - Push Karte Hi Deploy](#6-cicd-step-by-step---push-karte-hi-deploy)
7. [Diagram Explanations](#7-diagram-explanations)
8. [Real-Life Usages](#8-real-life-usages)
9. [Extra Topics - Interview + Production Ke Liye](#9-extra-topics---interview--production-ke-liye)
10. [Cheat Commands](#10-cheat-commands)

---

## 1. Cloud Deployment Intro - Deep Me Samjho

### Deployment hota kya hai?

Socho tumne Express.js me ek API banayi jo `localhost:5000` pe chal rahi hai. Ye sirf tumhare laptop pe hai. Deployment ka matlab hai - is code ko kisi public server pe chalana taaki duniya me koi bhi `http://tumhari-site.com/api` se access kar sake.

Purane time me companies khud ke physical server kharidti thi, AC wale room me rakhti thi, koi banda raat ko 3 baje restart karta tha. Isse bolte the **On-Premise**.

Cloud ne game badal diya.

### Cloud kya hai?

Cloud ka simple matlab hai - **kisi aur ka computer jo rent pe le rahe ho, internet ke through.**

AWS, Azure, GCP ne bade-bade data centers bana rakhe hai. Tumhe server kharidna nahi padta, bas click karke rent pe le lo. 5 minute me server ready, kaam khatam to band kar do, paise sirf utne ka jitna use kiya. Isko bolte hai **Pay-as-you-go**.

### Kyu Cloud? 5 Solid Reasons:

1.  **Scalability:** Diwali sale me traffic 10x badh gaya? Auto me naye server add ho jayenge. Normal din wapas 1 server.
2.  **No Hardware Tension:** RAM jal gayi, hard disk crash - ye sab AWS ka headache. Tum sirf code pe focus karo.
3.  **Global Reach:** Tum Delhi me ho, user USA me. AWS ka Mumbai + US region dono me deploy karo. Speed fast.
4.  **Security + Backup:** Data auto-replicate hota hai 3 jagah. Ek data center doob bhi jaye to data safe.
5.  **Speed:** Pehle server setup me 2 week lagte the. Ab EC2 instance 2 minute me ready.

### Deployment ke 4 Models:

```text
1. IaaS (Infrastructure as a Service) - Example: EC2
   -> AWS dega khaali server, OS, RAM. Uske andar Node install karna, Nginx lagana sab tumhara kaam.
   -> Control sabse zyada.

2. PaaS (Platform as a Service) - Example: Elastic Beanstalk, Render, Railway
   -> Tum bas code push karo, server setup, scaling wo khud karega.
   -> Beginner / fast launch ke liye best.

3. CaaS (Container as a Service) - Example: ECS, Kubernetes (EKS)
   -> Tum Docker image do, wo usko chalake scaling, load balancing karega.

4. SaaS (Software as a Service) - Example: Gmail, S3 (almost)
   -> Bana banaya software use karo. Tumhe kuch setup nahi karna.
```

> Interview line: "Hum IaaS isliye use karte hai kyuki hume full control chahiye, PaaS isliye kyuki hume speed chahiye."

---

## 2. AWS Kya Hai? Core Concepts

AWS = Amazon Web Services. Cloud ka sabse bada player (~30% market). 200+ services hai, par backend dev ko starting me sirf 10 chahiye.

### Region aur Availability Zone (AZ) - Bahut Important

```text
Region = Ek city ka bada data-center cluster
  Example: ap-south-1 (Mumbai), us-east-1 (N. Virginia)

Availability Zone = Usi city me 2-3 km door alag-alag building
  Example: ap-south-1a, ap-south-1b, ap-south-1c

Logic: Agar 1a me aag lag jaye to 1b se app chalti rahe.
```

Hamesha Mumbai region choose karo agar users India me hai - latency 20ms vs Singapore 80ms ka fark padta hai.

### IAM - Pehla Kaam Ye Karo

EC2 launch karne se pehle IAM samjho. IAM = Identity and Access Management. Matlab kaun kya kar sakta hai.

Golden Rule: **Kabhi root user se daily kaam mat karo.** Root se ek IAM user banao admin access ke saath + MFA on karo.

```bash
# Concept samjho code nahi:
# User  = ek insan / app (ex: neeraj-dev)
# Group = team (ex: backend-team)
# Role  = temporary power (ex: EC2 ko S3 access dene ke liye Role)
# Policy = permission ka paper (JSON me likha hota hai)
```

Example Policy (S3 read-only):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::meri-bucket/*"]
    }
  ]
}
```

### VPC - Apna Private Mohalla

VPC = Virtual Private Cloud. AWS ke andar tumhara apna isolated network.

Simple me samjho:

```text
VPC (10.0.0.0/16) - Tumhari colony
 |
 |-- Public Subnet (10.0.1.0/24) - Main gate wala road, Internet aata hai
 |    -> Yaha EC2 + Load Balancer rakho
 |
 |-- Private Subnet (10.0.2.0/24) - Andar wali gali, Internet direct nahi
      -> Yaha Database (RDS) rakho, safe rahega
```

Beginner ho to default VPC use karo, par production me hamesha custom VPC + Private subnet me DB rakho.

---

## 3. EC2 Step-by-Step - Node App Live Karna

EC2 = Elastic Compute Cloud. Matlab rent pe liya hua virtual laptop/server jo 24x7 on rehta hai.

### Step 0: Kya Banayenge?

```text
User -> Internet -> EC2 (Ubuntu + Node + PM2 + Nginx) -> Port 80 pe Live API
```

### Step 1: Instance Launch Karna (Console se)

1. AWS Console -> EC2 -> Launch Instance
2. Name do: `my-backend-server`
3. AMI: `Ubuntu 22.04 LTS` (free tier eligible)
4. Instance type: `t2.micro` (1 CPU, 1GB RAM - free tier, learning ke liye best)
5. Key pair: `Create new key pair` -> Name `my-key` -> `.pem` download karke safe rakho. Ye tumhari chaabi hai.
6. Network: Allow SSH (22), HTTP (80), HTTPS (443). Custom port 5000 ko abhi mat kholo, Nginx se handle karenge.
7. Storage: 8GB gp3 (free hai)
8. Launch Instance -> Public IP note karo, ex: `13.232.10.50`

### Step 2: SSH Se Connect Karna

```bash
# key file ki permission fix karo (ek baar)
chmod 400 my-key.pem

# connect karo - Ubuntu user se
ssh -i "my-key.pem" ubuntu@13.232.10.50

# Agar Windows + PuTTY hai to .pem ko .ppk me convert karna padta hai, par Git Bash se upar wala command direct chalega
```

### Step 3: Server Pe Node Setup (Copy-Paste Series)

Server ke andar ye sab ek-ek karke chalao:

```bash
# 1. System update
sudo apt update && sudo apt upgrade -y

# 2. Node 20 install (NodeSource se - apt wala purana hota hai)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

node -v  # v20.x aana chahiye
npm -v

# 3. Git + PM2 + Nginx install
sudo apt install git nginx -y
sudo npm install -g pm2

# 4. App clone karo
git clone https://github.com/tumhara-username/tumhara-backend.git
cd tumhara-backend
npm install
# .env file banana mat bhulo!
nano .env
# PORT=5000
# MONGO_URI=mongodb+srv://...

# 5. PM2 se chalao (server restart pe bhi zinda rahega)
pm2 start server.js --name backend
pm2 startup
pm2 save
pm2 logs backend # log dekhne ke liye
```

Abhi app `localhost:5000` pe server ke andar chal rahi hai. Bahar se kholne ke liye Nginx chahiye.

### Step 4: Nginx Reverse Proxy (Asli Game Yahi Hai)

Bina Nginx ke user ko `http://13.232.10.50:5000` dena padega - ganda + insecure. Nginx port 80 pe sunega aur request ko andar 5000 pe bhej dega.

```bash
sudo nano /etc/nginx/sites-available/default
```

Andar ka content ye kar do:

```nginx
server {
    listen 80;
    server_name 13.232.10.50; # baad me yaha domain aayega ex: api.meristartup.com

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# test + restart
sudo nginx -t
sudo systemctl restart nginx

# Ab browser me kholo:
# http://13.232.10.50/ -> tumhari API live!
```

### Step 5: Domain + HTTPS (Production Wala Feel)

1. Route53 ya GoDaddy se domain lo.
2. `A record` banao: `api.tumharidomain.com -> 13.232.10.50`
3. Server pe SSL lagao (free - Let's Encrypt):

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.tumharidomain.com
# email puchhega, de do. Auto-renew ho jayega.
# Ab https://api.tumharidomain.com live with green lock!
```

### EC2 Deep Knowledge (Interview me kaam aayega)

- **Security Group = Server ka Darban.** Ye firewall hai. Sirf 80, 443, 22 kholo. 5000, 27017 (mongo) ko duniya ke liye kabhi mat kholo.
- **Elastic IP:** EC2 restart hone pe public IP badal jata hai. Elastic IP ek fixed IP hai jo chipak jata hai. Par dhyaan - chalu instance se attach hai to free, bekar me rakha to paisa katega.
- **User Data Script:** Instance launch hote hi auto-setup. Console me `Advanced details -> User data` me ye daal do:

```bash
#!/bin/bash
apt update -y
apt install nginx -y
systemctl start nginx
echo "Hello from User-Data" > /var/www/html/index.html
```

- **t2.micro kyu slow hai?** 1GB RAM hai. `npm install` pe atak sakta hai. Swap memory add karo ya `t3.small` lo production me.

---

## 4. S3 Step-by-Step - File Storage Ka Baadshah

S3 = Simple Storage Service. Unlimited file dabba. Image, video, pdf, backup - sab yahi rakho. EC2 ki disk me user image mat rakho - EC2 ud gaya to image gayab.

### Concept: Bucket + Object + Key

```text
Bucket = Ek folder jaisa (globally unique naam chahiye)
  ex: meri-app-uploads-2026

Object = Ek file
Key = File ka path + naam
  ex: profile-pics/user123.jpg

URL banega: https://meri-app-uploads-2026.s3.ap-south-1.amazonaws.com/profile-pics/user123.jpg
```

### Step 1: Bucket Banana

1. S3 -> Create Bucket
2. Name: `meri-app-uploads-neeraj-123` (unique hona chahiye)
3. Region: `ap-south-1` (Mumbai - app ke paas rakho)
4. **Block all public access = ON rakho** (security ke liye). Image public chahiye to CloudFront se denge, direct public mat karo starting me.
5. Versioning: ON (galti se delete/overwrite ho to wapas lao)

### Step 2: AWS CLI Se Upload (Server se)

```bash
# local me ya EC2 pe CLI setup
aws configure
# AWS Access Key ID: tumhari IAM key
# Secret: tumhara secret
# Region: ap-south-1

# upload
aws s3 cp ./photo.jpg s3://meri-app-uploads-neeraj-123/profile-pics/photo.jpg

# folder sync (bahut kaam ka)
aws s3 sync ./build s3://meri-app-uploads-neeraj-123/frontend-build --delete

# list
aws s3 ls s3://meri-app-uploads-neeraj-123/ --recursive
```

### Step 3: Node.js Se S3 Pe Upload (Presigned URL Pattern - Best Practice)

Galat tarika: Frontend se direct AWS secret key bhej dena.
Sahi tarika: Backend presigned URL banake dega (5 min valid), frontend us URL pe direct upload karega. Tumhare server pe load nahi.

```javascript
// backend - s3Upload.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Frontend bolega: "mujhe neeraj.jpg upload karni hai"
async function getUploadUrl(filename, fileType) {
  const command = new PutObjectCommand({
    Bucket: "meri-app-uploads-neeraj-123",
    Key: `uploads/${Date.now()}-${filename}`,
    ContentType: fileType, // image/jpeg
  });
  // 5 min ke liye valid URL
  const url = await getSignedUrl(s3, command, { expiresIn: 300 });
  return url;
}

// route
// app.get("/api/upload-url?filename=a.jpg&fileType=image/jpeg", ...)
```

```javascript
// frontend - direct S3 pe upload, backend free
async function uploadFile(file) {
  // 1. backend se URL lo
  const res = await fetch(`/api/upload-url?filename=${file.name}&fileType=${file.type}`);
  const { url, key } = await res.json();

  // 2. direct S3 pe PUT karo
  await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  console.log("Upload done, key:", key);
}
```

### Step 4: Static Website Host Karna (React Build Free Me Host)

```bash
# React ka build S3 pe host karna - paisa almost zero
npm run build
aws s3 sync ./dist s3://meri-frontend-site --delete

# Fir S3 -> Properties -> Static website hosting -> Enable
# Index document: index.html
# Fir CloudFront lagao HTTPS ke liye
```

### S3 Deep Knowledge

- **Storage Classes (Paisa Bachao):** Standard (daily use) -> Intelligent-Tiering (auto) -> Glacier (backup, sasta, nikalne me time lagta hai). Interview me puchte hai.
- **CORS:** Agar frontend `localhost:3000` se S3 pe direct upload kar raha aur error aaye to Bucket -> Permissions -> CORS me ye add karo:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["http://localhost:3000", "https://tumharidomain.com"],
    "ExposeHeaders": []
  }
]
```

- **Lifecycle Rule:** `uploads/temp/*` wali files 7 din baad auto-delete. Paisa bachta hai.

---

## 5. ECR + ECS Step-by-Step - Docker Ko Production Me Chalana

EC2 me humne manually Node install kiya. Socho 5 server hai, har pe ye karna? Pagal ho jaoge. Solution = Docker.

- **Docker Image =** Tumhari app + Node + OS ka pack dabba.
- **ECR =** Dabba rakhne ki almari (private DockerHub by AWS).
- **ECS =** Wo waiter jo dabba uthake chalata hai, scaling karta hai.

### Flow:

```text
Laptop pe Dockerfile -> Image Build -> ECR me Push -> ECS Service us Image ko chalayegi -> ALB se public karegi
```

### Step 1: Node App Ka Dockerfile (Production Grade)

```dockerfile
# Dockerfile - root me rakho
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Agar typescript hai to: RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app ./
EXPOSE 5000
CMD ["node", "server.js"]
```

```dockerignore
# .dockerignore - image halka rakhne ke liye MUST
node_modules
.git
.env
npm-debug.log
```

Test local pe:

```bash
docker build -t my-backend .
docker run -p 5000:5000 --env-file .env my-backend
# http://localhost:5000 check karo
```

### Step 2: ECR Me Push Karna

```bash
# 1. ECR repo banao (console se ya CLI se)
aws ecr create-repository --repository-name my-backend --region ap-south-1
# Output me URI milega: 123456789012.dkr.ecr.ap-south-1.amazonaws.com/my-backend

# 2. Login karo
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-south-1.amazonaws.com

# 3. Tag + Push
docker tag my-backend:latest 123456789012.dkr.ecr.ap-south-1.amazonaws.com/my-backend:latest
docker push 123456789012.dkr.ecr.ap-south-1.amazonaws.com/my-backend:latest
```

### Step 3: ECS Pe Chalana (Fargate - Serverless, EC2 Sambhalna Nahi Padta)

1. ECS -> Create Cluster -> `Fargate` + Name `my-cluster`
2. Task Definition banao:
   - Launch type: Fargate, CPU: 0.5 vCPU, Memory: 1GB
   - Container: Name `backend`, Image URI: upar wali ECR URI, Port mapping: 5000
   - Env variables: `MONGO_URI`, `JWT_SECRET` yaha add karo (Secrets Manager best hai)
   - Log: CloudWatch auto on rakho
3. Service banao:
   - Desired tasks: 2 (2 copy chalegi, ek mari to dusri zinda)
   - Load Balancer: Application Load Balancer + New Target Group port 5000 + Health check path `/health`
4. Security Group me ALB ka 80 open, ECS ka sirf ALB se traffic allow.

Health route app me hona chahiye, warna ECS container ko unhealthy bolke marti rahegi:

```javascript
// server.js me ye route pakka rakho
app.get("/health", (req, res) => res.status(200).json({ status: "ok", uptime: process.uptime() }));
```

### ECS Deep Knowledge

- **EC2 Launch Type vs Fargate:** EC2 sasta par tumhe server manage karna padta. Fargate mehanda par zero tension. Learning/startup ke liye Fargate best.
- **Auto Scaling:** ECS Service -> Auto Scaling -> CPU 70% se upar jaye to task 2 se 4 kar do. Policy ka naam `TargetTracking`.
- **Rolling Update:** Nayi image push karo, ECS purane container ko ek-ek karke maregi, naye layegi. Zero downtime.

---

## 6. CI/CD Step-by-Step - Push Karte Hi Deploy

CI = Continuous Integration (code merge hote hi test/build auto).
CD = Continuous Deployment (build pass hote hi server pe auto-deploy).

Bina CI/CD: Laptop pe `npm run build` karo, zip banao, EC2 pe `scp` karo, SSH karke restart karo. 20 min waste + human error.

CI/CD ke saath: `git push origin main` karo, 3 min me live. Bas.

### Option A: GitHub Actions -> EC2 (Sabse Easy, Free)

`.github/workflows/deploy.yml` file banao repo me:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install + Test + Build
        run: |
          npm ci
          npm test
          npm run build --if-present

      - name: Deploy to EC2 via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }} # 13.232.10.50
          username: ubuntu
          key: ${{ secrets.EC2_KEY }} # .pem ka content
          script: |
            cd ~/tumhara-backend
            git pull origin main
            npm ci --omit=dev
            pm2 restart backend
```

GitHub repo -> Settings -> Secrets me `EC2_HOST` aur `EC2_KEY` add karo. Ab push karte hi deploy.

### Option B: GitHub Actions -> ECR -> ECS (Pro Level)

```yaml
name: Deploy to ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and Push
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: my-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster my-cluster --service my-backend-service --force-new-deployment --region ap-south-1
```

Iska matlab: Code push -> Docker image bani -> ECR gayi -> ECS ne nayi image utha li. Full automatic.

### Option C: AWS Native (CodePipeline)

GitHub -> CodePipeline -> CodeBuild (test) -> CodeDeploy (EC2/ECS pe deploy). Bank/enterprise me yahi use hota hai kyuki sab AWS ke andar, permission easy. Par beginner ke liye GitHub Actions simple hai.

### CI/CD Deep Knowledge

- Secrets ko kabhi code me mat likho. Hamesha GitHub Secrets / AWS Secrets Manager.
- `main` branch pe direct push mat karo. PR + `npm test` pass hone ke baad hi merge. Isko **Branch Protection** bolte hai.
- Rollback: ECS me purani image ka tag (`IMAGE_TAG: github.sha`) rakho taaki fail hua to `aws ecs update-service` se pichli image pe wapas jao.

---

## 7. Diagram Explanations

### Diagram 1: Simple EC2 Deployment

```text
            Internet
               |
               v
     +------------------+
     |  Route53 (DNS)   |  api.merishop.com -> 13.232.10.50
     +------------------+
               |
               v
     +------------------+
     | EC2 t2.micro     |
     |  +------------+  |
     |  | Nginx :80  |--+--> :5000
     |  +------------+  |      |
     |  | Node + PM2 |<-+      |
     |  +------------+  |  /health check
     +------------------+
               |
               v
     +------------------+
     | MongoDB Atlas /  |
     | RDS (Private)    |
     +------------------+
```

Samjhao: User domain hit karta hai, DNS IP deta hai, Nginx request pakadke Node ko deta hai, Node DB se baat karta hai.

### Diagram 2: S3 Presigned Upload

```text
Frontend  --(1. mujhe upload URL do)--> Backend (Node)
Frontend  <--(2. ye lo 5min URL)------ Backend
Frontend  --(3. direct PUT file)-----> S3 Bucket
Backend   --(4. key DB me save)------> MongoDB
```

Fayda: 100MB video bhi server se nahi guzrega, direct S3 jayega. Server halka rahega.

### Diagram 3: Production ECS + ALB + Auto Scaling

```text
                    Internet
                       |
                       v
              +----------------+
              | ALB (:80/:443) |  <- SSL yahi terminate hota hai
              +-------+--------+
                      |
        +-------------+-------------+
        |                           |
        v                           v
 +-------------+             +-------------+
 | ECS Task 1  |             | ECS Task 2  |  <- Docker container, Fargate
 | backend:5000|             | backend:5000|
 +------+------+             +------+------+
        |                           |
        +-------------+-------------+
                      |
                      v
              +---------------+
              | RDS Private   |
              | + ElastiCache |
              +---------------+

CloudWatch Alarm: CPU > 70% for 2 min => Task 2 se 4 karo (Auto Scaling)
```

### Diagram 4: Full CI/CD Pipeline

```text
git push main
    |
    v
GitHub Actions (CI)
  - npm ci
  - npm test (fail? -> ruk jao, deploy mat karo)
  - docker build
    |
    v
ECR (Image Store, tag: a1b2c3d)
    |
    v
ECS Service Update (CD)
  - Task 3 (new) start -> health OK?
  - Yes -> Task 1 (old) kill, Task 2 kill
  - No -> Rollback to old
```

---

## 8. Real-Life Usages

Ye sab theory nahi, asli startup me aise hi hota hai:

1.  **Food Delivery App (Zomato jaisi):**
    - Food images S3 me. 10 million images EC2 me rakhoge to disk full + slow.
    - Order API ECS pe. Lunch time (1-2pm) Auto Scaling 5 se 20 task. Raat ko wapas 5. Paisa bacha.
    - Payment webhook ke liye ALB + HTTPS must, warna Razorpay reject kar dega.

2.  **Coaching App (Video Course):**
    - Video S3 + CloudFront. User Delhi se dekhe to Mumbai edge se aayega, buffering kam.
    - Presigned URL: Sirf paid user ko 1 hour valid video URL do. Free me share nahi kar payega.

3.  **SaaS Startup (Mera Backend):**
    - Frontend React build S3 + CloudFront pe (cost ~50 Rs/month).
    - Backend ECS Fargate pe (cost ~1500 Rs/month).
    - DB RDS Private subnet me, backup 7 din ka auto.
    - GitHub Actions se push-to-live. Founder raat ko 2 baje fix push karke so jata hai, subah client ko live milta hai.

4.  **College Project Se Interview Crack Karna:**
    - Interviewer: "Project deploy kiya hai?"
    - Tum: "Ha sir, EC2 + Nginx + SSL + GitHub Actions CI/CD + Docker image ECR me hai." -> Selection chance 3x. Kyuki 90% fresher sirf localhost dikhate hai.

---

## 9. Extra Topics - Interview + Production Ke Liye

### A. CloudFront (CDN) - Speed Ka Jaadu

S3 Mumbai me hai, user USA me. Har image 300ms legi. CloudFront duniya me 400+ edge location pe copy rakhta hai. User ko nearest edge se image milti hai - 20ms.

```bash
# Setup: CloudFront -> Origin = tumhari S3 bucket -> Enable -> CNAME = cdn.tumharidomain.com
# Frontend me bas URL badlo:
# Pehle: https://bucket.s3.ap-south-1.amazonaws.com/img.jpg (slow USA me)
# Ab: https://cdn.tumharidomain.com/img.jpg (fast everywhere)
```

### B. RDS vs Atlas - DB Kaha Rakhu?

- Atlas (MongoDB Cloud): Setup 2 min, free tier, beginner best.
- RDS (AWS): VPC private me rehta hai, secure, backup auto, par thoda mehanga + setup time.
- Rule: Security Group me DB port (5432/27017) ko `0.0.0.0/0` kabhi mat kholo. Sirf EC2/ECS security group se allow karo.

### C. Environment Variables Ka Sahi Tarika

```bash
# Galat: .env file ko GitHub pe push kar dena
# Sahi EC2 pe:
nano ~/app/.env # manually banao, git me mat daalo
# .gitignore me pakka rakho:
# .env
# *.pem

# Sahi ECS pe: Task Definition -> Secrets -> AWS Secrets Manager se lao
# arn:aws:secretsmanager:ap-south-1:123:secret:MONGO_URI
```

### D. Cost Control - Bill Shock Se Bacho

- Billing Alarm lagao: AWS Budgets -> 500 Rs cross hote hi email.
- Free tier ke baad `t2.micro` ke paise lagte hai. Sikhne ke baad instance **Stop** kar do, Terminate mat karo agar data chahiye.
- NAT Gateway sabse bada chor hai (~2500 Rs/month). Learning me public subnet use karo, NAT mat banao.
- S3 me purane version + temp file lifecycle se delete karo.

### E. Logs Kaha Dekhu? (Production Debugging)

```bash
# EC2 + PM2
pm2 logs backend --lines 100
sudo tail -f /var/log/nginx/error.log

# ECS Fargate - EC2 pe file nahi hai!
# CloudWatch -> Log groups -> /ecs/my-backend -> error search karo
aws logs tail /ecs/my-backend --follow --region ap-south-1
```

### F. Top 10 Interview Questions (Is Repo Se Taiyaar Ho Jayenge)

1. EC2 aur S3 me fark? (Compute vs Storage)
2. Security Group vs NACL? (Instance level stateful vs Subnet level stateless)
3. ALB vs Nginx? (AWS managed scaler vs khud ka server)
4. Docker image ko ECR me kyu? ECS kya karta hai?
5. CI/CD me test fail ho to kya hoga?
6. Presigned URL kyu use karte hai direct upload se?
7. Blue-Green vs Rolling deployment?
8. Fargate vs EC2 launch type?
9. S3 versioning + lifecycle kyu?
10. CloudFront se cost/speed pe kya asar?

---

## 10. Cheat Commands

```bash
# EC2 SSH
chmod 400 my-key.pem
ssh -i "my-key.pem" ubuntu@<PUBLIC-IP>

# PM2
pm2 start server.js --name backend
pm2 restart backend
pm2 logs backend
pm2 save

# Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx

# Docker + ECR
docker build -t my-backend .
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ACCOUNT>.dkr.ecr.ap-south-1.amazonaws.com
docker tag my-backend:latest <ACCOUNT>.dkr.ecr.ap-south-1.amazonaws.com/my-backend:latest
docker push <ACCOUNT>.dkr.ecr.ap-south-1.amazonaws.com/my-backend:latest

# S3
aws s3 cp file.jpg s3://my-bucket/folder/
aws s3 sync ./dist s3://my-bucket --delete

# ECS deploy trigger
aws ecs update-service --cluster my-cluster --service my-backend-service --force-new-deployment --region ap-south-1

# Logs
aws logs tail /ecs/my-backend --follow --region ap-south-1
```

---

### Agla Step Mere Liye (TODO)

- [ ] EC2 pe khud ka ek Node API live karna + screenshot
- [ ] S3 presigned upload wala code khud likhke test karna
- [ ] Docker image banake ECR push karna
- [ ] GitHub Actions se auto-deploy lagana
- [ ] Is repo me `diagrams/` folder me apne haath ke architecture diagram add karna

> Note: Ye notes learning ke liye hai. Production me hamesha IAM least-privilege, Secrets Manager, Private subnet DB, WAF + Backup follow karo. Happy deploying!
