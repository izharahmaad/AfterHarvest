# Local setup

## API
```bash
cd services/api
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Tests: `pytest` from services/api. API docs: http://localhost:8000/docs.

## Mobile
```bash
cd apps/mobile
npm install
```
Copy `.env.example` to `.env` and replace YOUR_LAN_IP with your computer's local IP; phone and computer must be on the same network.
```bash
npx expo start
npm run typecheck
```
This pins an Expo 52-era starter; match the client/runtime to SDK 52 or upgrade with Expo tooling before using a newer Expo Go version. npm installation and device execution were not performed when generating this archive.

## Firebase
Rule template only. Do not deploy as production security policy before adding document validation. Do not put service-account credentials in the mobile app or repository.
