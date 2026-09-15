from typing import List, Optional
from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    question: str = Field(..., example="Explain normalization in DBMS and why BCNF is preferred.")
    subject_id: Optional[str] = None
    doc_id: Optional[str] = None
    is_beginner: bool = False
    is_viva_mode: bool = False

class Citation(BaseModel):
    document_id: str
    document_title: str
    unit_number: int
    subject_name: str
    quote: str
    relevance_score: float

class QueryResponse(BaseModel):
    question: str
    answer: str
    citations: List[Citation]
    mode: str
    key_takeaways: List[str]

class SummarizeRequest(BaseModel):
    content: str
    title: Optional[str] = None
    is_beginner: bool = False

class SummarizeResponse(BaseModel):
    title: str
    summary: str
    key_points: List[str]
    potential_exam_questions: List[str]
