import type {
  Assessment,
  Context,
  InferenceMode,
  QualityState,
} from '../types/assessment';

// Android emulator uses 10.0.2.2 to reach localhost on your computer.
// For a real phone, use your computer's Wi-Fi IP address.
const API_BASE_URL = 'http://192.168.0.182:8000';

const PREDICT_ENDPOINT = `${API_BASE_URL}/api/quality/predict`;
const HISTORY_ENDPOINT = `${API_BASE_URL}/api/history`;

type BackendAssessment = {
  assessment_id?: string;
  id?: string;
  produce_type?: string;
  quality_state?: string;
  quality_score?: number | null;
  confidence?: number | null;
  recommendation?: string;
  model_version?: string | null;
  inference_mode?: string;
  created_at?: string;
  context_score?: number | null;
  visual_probabilities?: Record<string, number>;
  estimated_usable_days_min?: number;
  estimated_usable_days_max?: number;
  contributing_factors?: Array<{
    name?: string;
    weight?: number;
    value?: number;
    description?: string;
  }>;
};

type BackendHistoryResponse = {
  items?: BackendAssessment[];
};

const VALID_QUALITY_STATES: QualityState[] = [
  'fresh',
  'aging',
  'spoiled',
  'unknown',
];

const VALID_INFERENCE_MODES: InferenceMode[] = [
  'demo',
  'model',
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unable to connect to the AfterHarvest backend.';
}

function normalizeQualityState(
  value: string | undefined,
): QualityState {
  const state = (value ?? 'unknown').toLowerCase();

  return VALID_QUALITY_STATES.includes(
    state as QualityState,
  )
    ? (state as QualityState)
    : 'unknown';
}

function normalizeInferenceMode(
  value: string | undefined,
): InferenceMode {
  const mode = (value ?? 'demo').toLowerCase();

  return VALID_INFERENCE_MODES.includes(
    mode as InferenceMode,
  )
    ? (mode as InferenceMode)
    : 'demo';
}

function normalizeAssessment(
  data: BackendAssessment,
): Assessment {
  const assessmentId =
    data.assessment_id ??
    data.id ??
    `assessment-${Date.now()}`;

  const qualityScore =
    typeof data.quality_score === 'number'
      ? Math.round(data.quality_score * 100)
      : null;

  const confidence =
    typeof data.confidence === 'number'
      ? Math.round(data.confidence * 100)
      : null;

  const contextScore =
    typeof data.context_score === 'number'
      ? data.context_score
      : null;

  const visualProbabilities: Record<string, number> = {
    fresh: data.visual_probabilities?.fresh ?? 0,
    aging: data.visual_probabilities?.aging ?? 0,
    spoiled: data.visual_probabilities?.spoiled ?? 0,
  };

  const assessment: Assessment = {
    assessment_id: assessmentId,
    produce_type: data.produce_type ?? 'tomato',
    quality_state: normalizeQualityState(
      data.quality_state,
    ),
    quality_score: qualityScore,
    context_score: contextScore,
    visual_probabilities: visualProbabilities,
    contributing_factors: (data.contributing_factors ?? []).map(
      factor => ({
        name: factor.name ?? 'unknown_factor',
        weight:
          typeof factor.weight === 'number'
            ? factor.weight
            : typeof factor.value === 'number'
              ? factor.value
              : 0,
      }),
    ),
    recommendation:
      data.recommendation ??
      'Review the assessment result and inspect the produce manually.',
    confidence,
    model_version: data.model_version ?? null,
    inference_mode: normalizeInferenceMode(
      data.inference_mode,
    ),
    image_analyzed: false,
    created_at:
      data.created_at ?? new Date().toISOString(),
  };

  return assessment;
}

export async function predict(
  image: {
    uri: string;
    name?: string;
    mimeType?: string;
  },
  context: Context,
): Promise<Assessment> {
  const formData = new FormData();

  formData.append('produce_type', 'tomato');
  formData.append('temperature', context.temperature);
  formData.append('humidity', context.humidity);
  formData.append('storage_days', context.days);
  formData.append('packaging', context.packaging);

  formData.append('image', {
    uri: image.uri,
    name: image.name ?? 'tomato.jpg',
    type: image.mimeType ?? 'image/jpeg',
  } as unknown as Blob);

  try {
    const response = await fetch(PREDICT_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let detail = 'The backend rejected this assessment.';

      try {
        const errorData = await response.json();

        if (typeof errorData.detail === 'string') {
          detail = errorData.detail;
        }
      } catch {
        // Keep the default error message.
      }

      throw new Error(detail);
    }

    const data =
      (await response.json()) as BackendAssessment;

    return normalizeAssessment(data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getHistory(): Promise<Assessment[]> {
  try {
    const response = await fetch(HISTORY_ENDPOINT);

    if (!response.ok) {
      throw new Error('Unable to load assessment history.');
    }

    const data =
      (await response.json()) as BackendHistoryResponse;

    const items = Array.isArray(data.items)
      ? data.items
      : [];

    return items.map(item => normalizeAssessment(item));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}