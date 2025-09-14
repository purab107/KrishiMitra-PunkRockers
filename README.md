# 🌾 Crop Recommendation System – PUNKROCKERS

This project was developed as part of the **Smart India Hackathon 2025** under the theme **Digital Agriculture**.  
It empowers farmers with **AI-driven crop recommendations** using soil, weather, and market data.  

---

## 📑 Table of Contents

1. [Problem Statement Details](#problem-statement-details)  
2. [Technology Stack](#technology-stack)  
3. [Main Idea](#main-idea)  
   - [Features](#features)  
   - [Workflow Diagram](#workflow-diagram)  
4. [Installation & Usage](#installation--usage)  
   - [Prerequisites](#prerequisites)  
   - [Clone Repository](#clone-repository)  
   - [Backend Setup (Node.js + Express)](#backend-setup-nodejs--express)  
   - [Frontend Setup (React Native)](#frontend-setup-react-native)  
   - [ML Service Setup (Python)](#ml-service-setup-python)  
   - [Database Setup (SQL)](#database-setup-sql)  
   - [Run the Application](#run-the-application)  
5. [Modules](#modules)  
   - [Farmer Module](#farmer-module)  
   - [Crop Prediction Module](#crop-prediction-module)  
   - [Market & Schemes Module](#market--schemes-module)  
   - [Offline Mode](#offline-mode)  

---

## 📝 Problem Statement Details

| Field                        | Details |
|------------------------------|---------|
| **Problem Statement ID**     | SIH25029 |
| **Problem Statement Title**  | AI-Based Crop Recommendation for Farmers |
| **Description**              | Farmers often rely on guesswork for crop selection, leading to crop failures and low yields. This system integrates soil, weather, and market data to recommend suitable crops along with explanations and government schemes. |
| **Organization**             | Smart India Hackathon (SIH 2025) |
| **Category**                 | Software |
| **Domain Bucket**            | Digital Agriculture |

---

## 🛠 Technology Stack

| Layer            | Technology |
|------------------|------------|
| **Frontend**     | React Native |
| **Backend**      | Node.js + Express.js |
| **Database**     | MySQL / PostgreSQL |
| **Machine Learning** | Python (Scikit-learn, SHAP, Random Forest, XGBoost) |
| **External APIs**| OpenWeatherMap API, NASA POWER API, Agmarknet API, Bhuvan API |

---

## 💡 Main Idea

- The system recommends **top 3 crops** based on soil (N, P, K, pH), location, and season.  
- Uses **Random Forest + XGBoost ensemble model** for accurate predictions.  
- Provides transparency with **SHAP** (so farmers understand why a crop is suggested).  
- Displays **real-time market prices** and relevant **government schemes**.  
- Works in **offline mode** using cached data for rural areas with poor connectivity.  

---

### ✨ Features
- ✅ AI-powered crop recommendations  
- ✅ Weather-integrated predictions (OpenWeatherMap + NASA POWER)  
- ✅ Market price analysis (Agmarknet API)  
- ✅ Explainability with SHAP  
- ✅ Intuitive mobile UI (React Native)  
- ✅ Offline Mode for rural usage  

---

### 🔄 Workflow Diagram
```
👨‍🌾 Farmer (React Native App)
   ↓
📡 Node.js + Express (Backend API)
   ↓
🌦 External APIs (Weather + Market)
   ↓
🧠 Python ML Service (Random Forest + XGBoost + SHAP)
   ↓
💾 SQL Database (Storage + Schemes + Cache)
   ↓
📱 Results shown in React Native (Top Crops + Prices + Schemes)
```

---

## ⚙️ Installation & Usage

### Prerequisites
- Node.js v16+  
- Python 3.8+  
- MySQL/PostgreSQL  
- React Native CLI  

---

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YourUsername/Crop-Recommendation-SIH
cd Crop-Recommendation-SIH
```

---

### 2️⃣ Backend Setup (Node.js + Express)
```bash
cd backend
npm install
npm start
```
Runs on: `http://localhost:5000`

---

### 3️⃣ Frontend Setup (React Native)
```bash
cd frontend
npm install
npx react-native run-android   # for Android
npx react-native run-ios       # for iOS
```

---

### 4️⃣ ML Service Setup (Python)
```bash
cd ml-service
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Runs on: `http://localhost:8000`

---

### 5️⃣ Database Setup (SQL)
- Create database `cropdb` in MySQL/PostgreSQL.  
- Import schema from `/database/schema.sql`.  
- Update `.env` file with DB credentials.  

---

### 6️⃣ Run the Application
1. Start **ML service** → `python app.py`  
2. Start **backend** → `npm start`  
3. Run **frontend app** → `npx react-native run-android`  
4. Open the app → Enter soil/location details → Get predictions!  

---

## 📦 Modules

### 👨‍🌾 Farmer Module
- Input soil (pH, N, P, K), location, season  
- View history of previous predictions  

### 🌱 Crop Prediction Module
- AI model predicts top 3 crops  
- SHAP explains key influencing factors  

### 💰 Market & Schemes Module
- Market price trends (Agmarknet API)  
- Relevant government schemes with apply links  

### 📴 Offline Mode
- Predictions and cached market data available without internet  

---

🚀 Developed with ❤️ by **Algo Alliance** for **Smart India Hackathon 2025**
