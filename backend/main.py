import uvicorn
from fastapi import FastAPI, websockets
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


class Item(BaseModel):
    name: str


class Items(BaseModel):
    items: List[Item]


app = FastAPI()

origins = [
    "http://localhost:3000"
]



app.add_middleware(
    CORSMiddleware,
    allow_origins=True,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.websocket("/ws")
async def websocket_endpoint(websocket: websockets):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"You sent: {data}")

 