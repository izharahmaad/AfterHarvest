# AfterHarvest

Preserve quality. Reduce loss.

Professional-structure mobile/API starter for a tomato-only post-harvest decision-support portfolio project, based on the supplied AfterHarvest notes.

## Status
Requested 70% foundation milestone: functional demo flow and engineering scaffold, not production readiness. Real AI and Firebase remain unimplemented. The image is validated but not analyzed, and demo scores are unvalidated context heuristics. No food-safety certification or remaining usable-days prediction is provided.

## Start
See `docs/SETUP.md` for backend and mobile commands. See `docs/COMPLETION_CHECKLIST.md` for implemented/remaining work.

## Structure
- apps/mobile/src/screens — Home, Capture, Result, History
- apps/mobile/src/components — reusable UI
- apps/mobile/src/services — API client
- apps/mobile/src/types — typed domain response
- apps/mobile/src/theme — theme constants
- services/api/app/api — endpoints
- services/api/app/schemas — validated response models
- services/api/app/services — replaceable inference boundary
- services/api/tests — API test suite
- infra/firebase — future Firestore rule template
- docs — architecture, setup, model limitations and roadmap
- packages/contracts — shared-contract placeholder
- .github/workflows — backend CI

History lives in mobile memory for this release. Backend history is an explicit stub. API has no authentication; use locally only. Do not treat scores as probabilities or safety assessments.
