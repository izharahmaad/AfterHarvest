import type {Assessment, Context} from '../types/assessment';

// Android emulator uses 10.0.2.2 to reach localhost on your computer.
// For a real phone, replace this with your computer's Wi-Fi IP:
// Example: http://192.168.1.100:8000
const API_BASE_URL = 'http://192.168.0.182:8000';

const PREDICT_ENDPOINT = `${API_BASE_URL}/quality/predict`;
const HISTORY_ENDPOINT = `${API_BASE_URL}/history`;

type BackendAssessment = {
  assessment_id?: string;
  id?: string;
  produce_type?: string;
  quality_state?: string;
  quality_score?: number;
  confidence?: number | null;
  recommendation?: string;
  model_version?: string;
  inference_mode?: string;
  created_at?: string;
  context_score?: number;
  visual_probabilities?: {
    fresh?: number;
    aging?: number;
    spoiled?: number;
  };
  estimated_usable_days_min?: number;
  estimated_usable_days_max?: number;
  contributing_factors?: Array<{
    name?: string;
    weight?: number;
    value?: number;
    description?: string;
  }>;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unable to connect to the AfterHarvest backend.';
}

function normalizeAssessment(
  data: BackendAssessment,
): Assessment {
  const assessmentId =
    data.assessment_id ?? data.id ?? crypto.randomUUID();

  const qualityState = (data.quality_state ?? 'uncertain')
    .toLowerCase();

  const qualityScore =
    typeof data.quality_score === 'number'
      ? Math.round(data.quality_score)
      : 0;

  const confidence =
    typeof data.confidence === 'number'
      ? Math.round(data.confidence * 100)
      : null;

  return {
    assessment_id: assessmentId,
    produce_type: data.produce_type ?? 'tomato',
    quality_state: qualityState,
    quality_score: qualityScore,
    confidence,
    recommendation:
      data.recommendation ??
      'Review the assessment result and inspect the produce manually.',
    model_version: data.model_version ?? 'unavailable',
    inference_mode: data.inference_mode ?? 'demo',
    created_at: data.created_at ?? new Date().toISOString(),
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
  } as Assessment;
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

    const data = (await response.json()) as BackendAssessment;

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

    const data = await response.json();

    const items = Array.isArray(data.items) ? data.items : [];

    return items.map(item =>
      normalizeAssessment(item as BackendAssessment),
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}