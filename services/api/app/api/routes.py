from typing import Annotated
from io import BytesIO
from PIL import Image, UnidentifiedImageError
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from app.services.inference import DemoInferenceService
from app.schemas.assessment import Assessment
router=APIRouter()
service=DemoInferenceService()
@router.get('/health')
def health():
    return {'status':'ok','service':'afterharvest-api','inference_mode':'demo','auth_enabled':False}
@router.post('/quality/predict',response_model=Assessment)
async def predict(image:Annotated[UploadFile,File(...)],temperature_c:Annotated[float,Form(ge=-20,le=60)],humidity_percent:Annotated[float,Form(ge=0,le=100)],storage_days:Annotated[int,Form(ge=0,le=365)],packaging:Annotated[str,Form(...)],produce_type:Annotated[str,Form()]='tomato'):
    if produce_type!='tomato': raise HTTPException(400,'Tomato only in MVP')
    if packaging not in {'open_crate','sealed_bag','ventilated_box'}: raise HTTPException(400,'Unsupported packaging')
    try:
        data=await image.read(5*1024*1024+1)
        if len(data)>5*1024*1024: raise HTTPException(413,'Maximum image size is 5 MB')
        with Image.open(BytesIO(data)) as img:
            if img.format not in {'JPEG','PNG','WEBP'}: raise HTTPException(400,'JPEG, PNG or WebP required')
            if img.width*img.height>20000000: raise HTTPException(400,'Image resolution too large')
            img.verify()
    except (UnidentifiedImageError,OSError,Image.DecompressionBombError): raise HTTPException(400,'Invalid image')
    finally: await image.close()
    return service.predict(temperature_c,humidity_percent,storage_days,packaging)
@router.get('/history')
def history():
    return {'items':[],'persistence':'not_connected','message':'Use mobile session history in demo mode'}
