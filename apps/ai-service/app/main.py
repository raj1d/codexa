from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import QueryRequest, QueryResponse, SummarizeRequest, SummarizeResponse
from .rag_engine import RAGEngine

app = FastAPI(
    title="CODEXA AI Study Assistant API",
    description="Syllabus-grounded RAG Q&A service with citations for IT/CSE students",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag_engine = RAGEngine()

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "codexa-ai-service",
        "version": "0.1.0"
    }

@app.post("/query", response_model=QueryResponse)
def query_ai(req: QueryRequest):
    if not req.question or len(req.question.strip()) == 0:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    return rag_engine.answer_query(req)

@app.post("/summarize", response_model=SummarizeResponse)
def summarize_doc(req: SummarizeRequest):
    if not req.content or len(req.content.strip()) == 0:
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    
    title = req.title or "Uploaded Study Notes"
    summary = f"Summary for {title}: Covers fundamental concepts with definitions, formulas, and operational steps tailored for GTU syllabus review."
    
    key_points = [
        "Core theoretical concepts and architectural layers explained",
        "Practical implementation trade-offs and complexity notes",
        "Frequently tested university exam questions and viva pointers"
    ]
    
    potential_questions = [
        f"Explain the primary architecture and significance of {title} (7 Marks)",
        f"Differentiate between the key techniques discussed in this module (4 Marks)",
        "Write a short algorithm or implementation example illustrating this concept."
    ]
    
    return SummarizeResponse(
        title=title,
        summary=summary,
        key_points=key_points,
        potential_exam_questions=potential_questions
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
