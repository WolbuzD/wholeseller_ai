# 🏡 Wholesaler AI – Property Prospector

A full-stack web application that helps real estate wholesalers **identify motivated sellers** and generate **AI-powered personalized outreach messages**.

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/wholeseller-ai)  
![GitHub issues](https://img.shields.io/github/issues/your-username/wholeseller-ai)  
![GitHub stars](https://img.shields.io/github/stars/your-username/wholeseller-ai?style=social)

---

## 🚀 Live Demo

- **Frontend**: [wholeseller-ai.vercel.app](https://wholeseller-ai.vercel.app)  
- **Backend API**: [wholesellerai-production.up.railway.app](https://wholesellerai-production.up.railway.app)

---

## ❌ Problem Statement

Real estate wholesalers spend **15+ hours per week** manually searching for distressed properties and crafting outreach messages.  
This process is **time-consuming, inconsistent,** and often yields poor response rates due to generic messaging.

---

## ✅ Solution

Wholesaler AI streamlines the entire lead generation process by:

- 🔍 Identifying motivated sellers with **equity & distress indicators**  
- 📊 Providing detailed **property analysis with motivation scoring**  
- 🤖 Generating **personalized, compliant outreach messages** using AI  
- 💡 Collecting **community feedback** to drive product development  

---

## ✨ Key Features

### 🔎 Property Search & Analysis
- Real-time integration with **Fulton County property records**  
- **Motivation scoring algorithm** (equity, liens, situations)  
- Advanced filtering by **zip code, equity %, motivation score**  
- Support for multiple property types  

### 🤖 AI-Powered Messaging
- Personalized message generation with **Anthropic Claude**  
- Situation-aware content (pre-foreclosure, probate, distressed, etc.)  
- Compliant messaging, optimized for **SMS outreach**  

### 👥 Community Feedback System
- In-app **suggestion collection** (features, bugs, improvements)  
- Real-time feedback display for **product validation**  

---

## 🛠️ Tech Stack

**Frontend**
- React 19
- Tailwind CSS
- Axios
- Vercel (hosting)

**Backend**
- FastAPI (Python)
- Anthropic Claude API
- Fulton County qPublic API
- Railway (deployment)

**Data Sources**
- Fulton County Property Records  
- Mock NYC Data (for demos)  
- JSON file storage for feedback  

---

## 🏗️ Architecture

Frontend (React) ───► Backend (FastAPI) ───► AI (Claude)
│ │ │
│ ├──► Property APIs │
│ │ │
└──► User Interface ─┴──► Feedback System ───┘


---

## 🔌 API Endpoints

### Property Management
- `POST /api/properties/search` → Search properties with filters  
- `GET /api/properties/{id}` → Get specific property details  
- `GET /api/situation-types` → List available situation types  

### AI Messaging
- `POST /api/generate-message` → Generate personalized outreach  

### Community Feedback
- `POST /api/feedback` → Submit feedback  
- `GET /api/feedback` → Retrieve all feedback  
- `GET /api/feedback/stats` → Get feedback statistics  

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+  
- Python 3.9+  
- Anthropic API key  

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # add ANTHROPIC_API_KEY
uvicorn main:app --reload
```

## 📖 Usage Guide

1. **Search Properties** → Enter a zip code (e.g., `30309` for Atlanta or `10001` for NYC demo data)  
2. **Apply Filters** → Adjust equity %, motivation score, and situation type  
3. **Analyze Results** → Review property details, equity analysis, and motivation scores  
4. **Generate Messages** → Click **"Generate Message"** for AI-powered outreach content  
5. **Submit Feedback** → Share your suggestions directly in the app  

## 🎯 Real Estate Market Focus

### 🏚️ Target Situations
- **Pre-foreclosure** – Behind on mortgage payments  
- **Probate (inherited)** – Properties needing quick liquidation  
- **Distressed properties** – Poor condition, high repair costs  
- **Tired landlords** – Looking to exit rental business  
- **Tax delinquent** – Behind on property taxes  

### 🌍 Geographic Coverage
- **Primary**: Atlanta, GA (Fulton County) – Real data integration  
- **Demo**: New York City – Mock dataset for testing  
- **Expandable**: Supports additional counties and states  

## 📊 Performance Metrics
- **Search speed**: <3s for real data  
- **AI message generation**: <5s per message  
- **Accuracy**: Direct county record integration  
- **Engagement**: Built-in feedback loop  

---

## 🛤️ Roadmap  
_Based on community feedback:_  
- 📇 **CRM integration & contact tracking**  
- 📂 **Export functionality** (CSV/PDF)  
- 📧 **Email campaign automation**  
- 📱 **Mobile app version**  
- 🌎 **Expand county/state coverage**  

## 🤝 Contributing  
- 🍴 **Fork** this repo  
- 🌱 **Create** a feature branch  
- 📝 **Submit** feedback through the app  
- 🔀 **Open** a detailed pull request  

---

## 📜 License  
This project is built for **BOOM NETFLIX IMMO COMMUNITY**.  
[Join the Skool Community](https://www.skool.com/immobilier-creatif-mamadou-129)


---

## 📬 Contact  
_Built as a portfolio project demonstrating:_  
- 💻 **Full-stack development**  
- 🤖 **AI integration**  
- 📊 **Product management skills**  

