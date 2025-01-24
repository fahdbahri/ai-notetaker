from fastapi import FastAPI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter



load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class TranscriptRequest(BaseModel):
    transcript: str

@app.post("/summarize")
async def summarize_transcript(request: TranscriptRequest):
    # Initialize the language model
    llm = ChatOpenAI(
        model="gpt-3.5-turbo", 
        temperature=0.3, 
        max_tokens=1000
    )

    # Split the transcript into chunks if it's too long
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=4000, 
        chunk_overlap=200
    )
    texts = text_splitter.split_text(request.transcript)

    # Create a summarization chain
    chain = load_summarize_chain(
        llm, 
        chain_type="map_reduce", 
        verbose=True
    )

    # Generate summary
    summary = chain.run(texts)

    return {"summary": summary}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)