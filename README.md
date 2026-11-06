<div align="center">

# 🍅 AfterHarvest

### AI-Powered Post-Harvest Produce Quality Intelligence

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/izharahmaad/AfterHarvest?style=for-the-badge)](https://github.com/izharahmaad/AfterHarvest/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/izharahmaad/AfterHarvest?style=for-the-badge)](https://github.com/izharahmaad/AfterHarvest)
[![GitHub stars](https://img.shields.io/github/stars/izharahmaad/AfterHarvest?style=for-the-badge)](https://github.com/izharahmaad/AfterHarvest/stargazers)

**Preserve quality. Reduce loss.**

AfterHarvest is an AI-powered post-harvest intelligence platform that combines **PyTorch-based tomato image classification** with **storage-context analysis** to estimate visible quality risk and generate explainable handling recommendations.

</div>

---

## 📌 GitHub Description

```text
AfterHarvest is an AI-powered post-harvest intelligence platform that combines PyTorch tomato image classification with storage-context analysis to estimate visible quality risk and generate explainable recommendations.
```

## 🚀 Overview

AfterHarvest helps users assess the visible condition of tomatoes by combining a produce photo with real storage conditions.

Instead of relying only on an image, the system considers:

- Tomato image quality indicators
- Storage temperature
- Relative humidity
- Storage duration
- Packaging type

The backend processes these inputs, estimates a quality state and score, identifies important contributing factors, and returns a practical recommendation.

> **Important:** AfterHarvest is an educational decision-support prototype. It is not a food-safety certification system and should not be used as the only basis for deciding whether food is safe to eat.

## ✨ Key Features

- 📷 Capture or upload a tomato photo
- 🌡️ Enter temperature, humidity, storage duration, and packaging type
- 🧠 Receive an AI-based quality assessment
- 📊 View quality state, score, confidence, and contributing factors
- 💡 Get practical storage and handling recommendations
- 🕘 Review, search, and filter assessment history
- 📋 Use a daily tomato-quality checklist
- 📤 Copy or share assessment summaries
- 🔐 Firebase Authentication support
- ☁️ Firestore-based assessment metadata storage
- 🗄️ SQLite fallback for local backend development

## 🧠 AI / ML Approach

AfterHarvest uses a multimodal decision approach that combines computer vision with structured storage-context data.

```text
Tomato Image + Storage Context
              |
              v
      FastAPI Backend
              |
              +------------------+
              |                  |
              v                  v
     PyTorch Image Model   Context Risk Model
              |                  |
              +--------+---------+
                       |
                       v
              Decision Engine
                       |
                       v
       Quality State + Score + Recommendation
```

### Visual Model

The visual model analyzes a tomato image and estimates probabilities for:

| Class | Meaning |
|---|---|
| Fresh | Tomato appears visually healthy |
| Aging | Tomato shows early visible quality decline |
| Spoiled | Tomato shows clear visible spoilage indicators |

### Context Model

The context model evaluates storage conditions such as:

- Temperature
- Humidity
- Storage duration
- Packaging type

### Decision Engine

The prototype combines visual and contextual signals into a final result:

```text
quality_score = 0.65 × visual_quality + 0.35 × context_quality
```

This weighting is a prototype assumption and should be tuned using a validation dataset.

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Mobile application | React Native, Expo, TypeScript |
| Navigation | React Navigation |
| Backend API | Python, FastAPI, Uvicorn |
| Deep learning | PyTorch, torchvision |
| Classical ML | NumPy, scikit-learn |
| Image processing | Pillow |
| Local database | SQLite |
| Cloud database | Firebase Firestore |
| Authentication | Firebase Authentication |
| API documentation | Swagger UI / OpenAPI |

## 📱 Mobile Screens

| Screen | Description |
|---|---|
| Home | Overview, quick actions, storage risk checker, checklist, and guidance |
| Capture | Add a tomato photo and enter storage conditions |
| Result | View quality state, score, factors, recommendation, and action checklist |
| History | Review, search, and filter previous assessments |

## ⚙️ Backend API

### Health Check

```http
GET /api/v1/health
```

Example response:

```json
{
  "status": "ok",
  "service": "afterharvest-api"
}
```

### Quality Prediction

```http
POST /api/v1/quality/predict
Content-Type: multipart/form-data
```

### Request Fields

| Field | Type | Description |
|---|---|---|
| `image` | File | Tomato photo |
| `temperature` | Number | Storage temperature in Celsius |
| `humidity` | Number | Relative humidity percentage |
| `days` | Integer | Storage duration in days |
| `packaging` | String | Packaging type |

### Example Response

```json
{
  "assessment_id": 42,
  "produce_type": "tomato",
  "quality_state": "aging",
  "quality_score": 0.62,
  "visual_probabilities": {
    "fresh": 0.21,
    "aging": 0.68,
    "spoiled": 0.11
  },
  "context_score": 0.57,
  "estimated_usable_days": {
    "minimum": 1,
    "maximum": 2
  },
  "contributing_factors": [
    {
      "name": "visual_color_change",
      "weight": 0.42
    },
    {
      "name": "storage_duration",
      "weight": 0.31
    },
    {
      "name": "temperature",
      "weight": 0.18
    }
  ],
  "recommendation": "Prioritize this batch for use or sale soon.",
  "confidence": 0.74,
  "model_version": "afterharvest-tomato-v1"
}
```

## 🧪 Local Setup

### 1. Clone the repository

```powershell
git clone [https://github.com/izharahmaad/AfterHarvest.git](https://github.com/izharahmaad/AfterHarvest.git)
cd AfterHarvest
```

### 2. Create and activate a Python environment

```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

### 3. Install backend dependencies

```powershell
pip install -r backend/requirements.txt
```

### 4. Run the FastAPI backend

```powershell
uvicorn backend.app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Open Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Install mobile dependencies

Open a new terminal:

```powershell
cd apps/mobile
npm install
```

### 6. Start the Expo app

```powershell
npx expo start
```

Scan the QR code using the Expo Go app, or run the app on an Android emulator or iOS simulator.

## 🔐 Environment Variables

Create a `.env` file in the backend folder.

Do **not** commit `.env`, Firebase keys, API keys, or database files to GitHub.

Example:

```env
API_HOST=127.0.0.1
API_PORT=8000
```

## 📁 Repository Structure

```text
AfterHarvest/
├── apps/
│   └── mobile/
│       ├── src/
│       │   ├── components/
│       │   ├── screens/
│       │   ├── services/
│       │   ├── theme/
│       │   └── types/
│       ├── App.tsx
│       ├── app.json
│       ├── package.json
│       └── tsconfig.json
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── data/
│   └── requirements.txt
├── docs/
├── .gitignore
└── README.md
```

## 📊 Dataset Plan

The initial model focuses on tomatoes and three visible quality classes.

| Item | Target |
|---|---|
| Produce | Tomato |
| Classes | Fresh, Aging, Spoiled |
| Images per class | 150–250 |
| Total images | 450–750 |
| Training split | 70% |
| Validation split | 15% |
| Test split | 15% |

Recommended augmentation:

- Small rotation
- Random cropping
- Brightness adjustment
- Horizontal flipping

## 🔒 Privacy and Data Handling

- Uploaded images are validated before processing.
- Images are processed through the backend.
- The MVP does not permanently store uploaded images.
- Assessment metadata may be stored locally or in Firestore.
- Users should avoid uploading images containing personal information.

## 🚧 Future Improvements

- Train and deploy a production tomato classification model
- Improve explainability and confidence calibration
- Add multi-produce support
- Add batch-level inventory tracking
- Add storage-location management
- Add shelf-life estimation
- Add cloud image storage with access controls
- Add offline-first mobile support
- Add user roles and team collaboration
- Add model performance dashboards

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit and push
5. Open a pull request

## 📄 License

This project is intended for educational and portfolio purposes.

## 👤 Author

<div align="center">

**Izhar Ahmad**

[![GitHub](https://img.shields.io/badge/GitHub-izharahmaad-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/izharahmaad)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)

</div>