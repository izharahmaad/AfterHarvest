# AfterHarvest

**AfterHarvest** is a multimodal post-harvest intelligence prototype that helps assess visible tomato quality using a produce photo and storage context.

It combines image-based classification with storage conditions such as temperature, humidity, storage duration, and packaging type to generate a quality state, score, contributing factors, and a practical recommendation.

> **Preserve quality. Reduce loss.**

## GitHub Description

```text
AfterHarvest is a React Native + FastAPI AI prototype for tomato post-harvest quality assessment using produce images and storage context.
```

## Important Limitation

AfterHarvest is an **educational decision-support prototype**, not a food-safety certification system.

It does not guarantee that produce is safe to eat. Users should always inspect produce manually before consumption, sale, or distribution.

## Features

- Capture or select a tomato photo
- Enter storage temperature, humidity, storage duration, and packaging type
- Receive a quality state: fresh, aging, spoiled, or uncertain
- View an illustrative quality score from 0 to 100
- Review contributing context indicators
- Receive practical storage and handling recommendations
- Save assessment metadata during the current session
- Search and filter previous assessments
- Copy or share an assessment summary
- Daily quality checklist for tomato storage

## Technology Stack

| Layer | Technology |
|---|---|
| Mobile app | React Native, Expo, TypeScript |
| Navigation | React Navigation |
| Backend | Python, FastAPI, Uvicorn |
| AI / ML | PyTorch, torchvision, scikit-learn |
| Image processing | Pillow |
| Database | SQLite for local development |
| Cloud services | Firebase Authentication and Firestore |
| Icons | Expo Vector Icons |

## Project Architecture

```text
React Native + Expo Mobile App
                |
                | Photo + storage context
                v
            FastAPI Backend
                |
                +-- Request validation
                +-- Image preprocessing
                +-- Visual quality model
                +-- Context risk model
                +-- Decision engine
                +-- Explanation builder
                |
                v
        Assessment result
                |
                v
Mobile Result Screen + Session History
```

## Mobile Screens

| Screen | Purpose |
|---|---|
| Home | Project overview, quick actions, storage risk checker, checklist, and guidance |
| Capture | Add a tomato photo and enter storage conditions |
| Result | View quality state, score, factors, recommendation, and action checklist |
| History | Review, search, and filter assessments from the current session |

## Backend API

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

Request fields:

- `image`: Tomato photo
- `temperature`: Storage temperature in Celsius
- `humidity`: Relative humidity percentage
- `days`: Storage duration in days
- `packaging`: Packaging type

Example response:

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

## Local Setup

### 1. Clone the repository

```powershell
git clone [https://github.com/izharahmaad/AfterHarvest.git](https://github.com/izharahmaad/AfterHarvest.git)
cd AfterHarvest
```

### 2. Create a Python virtual environment

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

The API will usually be available at:

```text
http://127.0.0.1:8000
```

### 5. Install mobile dependencies

Open a new terminal and run:

```powershell
cd apps/mobile
npm install
```

### 6. Start the Expo mobile app

```powershell
npx expo start
```

Scan the QR code using the Expo Go app, or run the app on an Android emulator or iOS simulator.

## Environment Variables

Create a `.env` file in the backend folder and add the required configuration values.

Do not commit `.env` files, API keys, Firebase credentials, or database files to GitHub.

Example:

```env
API_HOST=127.0.0.1
API_PORT=8000
```

## Repository Structure

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

## AI Approach

AfterHarvest uses a simple multimodal decision approach:

1. The mobile app sends a tomato image and storage context to the backend.
2. The backend validates the request and preprocesses the image.
3. The visual model estimates probabilities for fresh, aging, and spoiled states.
4. The context model evaluates storage conditions.
5. The decision engine combines both signals into a final quality score and recommendation.

Prototype weighting:

```text
quality_score = 0.65 × visual_quality + 0.35 × context_quality
```

This weighting is a prototype assumption and should be evaluated and tuned using a validation dataset.

## Dataset Plan

The initial model focuses on tomatoes and three visible quality classes:

| Class | Description |
|---|---|
| Fresh | Tomato appears visually healthy and suitable for normal storage |
| Aging | Tomato shows early visible quality decline |
| Spoiled | Tomato shows clear visible spoilage indicators |

Initial target:

- 150 to 250 images per class
- 450 to 750 total images
- 70% training data
- 15% validation data
- 15% test data

## Privacy and Data Handling

- Images are validated before upload.
- Images are processed through the backend.
- The MVP does not permanently store uploaded images.
- Assessment metadata may be stored locally or in Firestore.
- Users should avoid uploading images containing personal information.

## Future Improvements

- Add a trained tomato image-classification model
- Improve model explainability
- Add multi-produce support
- Add batch-level inventory tracking
- Add storage-location management
- Add shelf-life estimation
- Add cloud image storage with access controls
- Add offline support
- Add user accounts and team roles
- Add real model performance metrics

## License

This project is for educational and portfolio purposes.

## Author

**Izhar Ahmad**  
GitHub: [izharahmaad](https://github.com/izharahmaad)