export type PackagingType =
  | 'open_crate'
  | 'sealed_bag'
  | 'ventilated_box';

export type QualityState =
  | 'fresh'
  | 'aging'
  | 'spoiled'
  | 'unknown';

export type InferenceMode = 'demo' | 'model';

export type Context = {
  temperature: string;
  humidity: string;
  days: string;
  packaging: PackagingType;
};

export type ContributingFactor = {
  name: string;
  weight: number;
};

export type VisualProbabilities = Record<string, number>;

export type Assessment = {
  readonly assessment_id: string;
  readonly produce_type: string;
  readonly quality_state: QualityState;
  readonly quality_score: number | null;
  readonly context_score: number | null;
  readonly visual_probabilities: VisualProbabilities;
  readonly contributing_factors: readonly ContributingFactor[];
  readonly recommendation: string;
  readonly confidence: number | null;
  readonly model_version: string | null;
  readonly inference_mode: InferenceMode;
  readonly image_analyzed: boolean;
  readonly created_at: string;
};

export type AssessmentRequest = {
  readonly context: Context;
};

export type AssessmentResponse = Assessment;