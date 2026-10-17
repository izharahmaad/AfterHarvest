export type Context = {
  temperature: string;
  humidity: string;
  days: string;
  packaging: string;
};

export type ContributingFactor = {
  name: string;
  weight: number;
};

export type Assessment = {
  assessment_id: string;
  produce_type: string;
  quality_state: string;
  quality_score: number;
  context_score: number;
  visual_probabilities: Record<string, number>;
  contributing_factors: ContributingFactor[];
  recommendation: string;
  confidence: number;
  model_version: string;
  inference_mode: 'demo' | 'model';
  image_analyzed: boolean;
  created_at: string;
};