export type Context = {temperature: string; humidity: string; days: string; packaging: string};
export type Assessment = {assessment_id:string; quality_state:string; quality_score:number; confidence:number; inference_mode:string; recommendation:string; context_score:number; visual_probabilities:Record<string,number>; contributing_factors:{name:string;weight:number}[]; created_at:string};
