import {Assessment,Context} from '../types/assessment';
const base=(process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/$/,'');
export async function predict(asset:{uri:string;mimeType?:string;fileName?:string|null}, context:Context):Promise<Assessment>{
 const data=new FormData();data.append('image',{uri:asset.uri,name:asset.fileName||'tomato.jpg',type:asset.mimeType||'image/jpeg'} as any);
 data.append('temperature_c',context.temperature);data.append('humidity_percent',context.humidity);data.append('storage_days',context.days);data.append('packaging',context.packaging);data.append('produce_type','tomato');
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),30000);
 try {const response=await fetch(`${base}/api/v1/quality/predict`,{method:'POST',body:data,signal:controller.signal});const body=await response.json();if(!response.ok) throw new Error(typeof body.detail==='string'?body.detail:'Assessment failed. Check inputs.');return body;}finally{clearTimeout(timeout);}
}
