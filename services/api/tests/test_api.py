from io import BytesIO
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)
def photo():
    buffer=BytesIO();Image.new('RGB',(20,20),'red').save(buffer,format='JPEG');return buffer.getvalue()
def request(**overrides):
    data=dict(temperature_c='8.5',humidity_percent='72',storage_days='4',packaging='open_crate');data.update(overrides)
    return client.post('/api/v1/quality/predict',files={'image':('tomato.jpg',photo(),'image/jpeg')},data=data)
def test_health(): assert client.get('/api/v1/health').status_code==200
def test_predict():
    r=request();assert r.status_code==200;assert r.json()['image_analyzed'] is False
def test_bounds(): assert request(humidity_percent='101').status_code==422
def test_produce(): assert request(produce_type='apple').status_code==400
def test_bad_image():
    r=client.post('/api/v1/quality/predict',files={'image':('x.jpg',b'bad','image/jpeg')},data=dict(temperature_c=8,humidity_percent=72,storage_days=4,packaging='open_crate'));assert r.status_code==400
