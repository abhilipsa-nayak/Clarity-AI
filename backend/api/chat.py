import os
from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
import google.generativeai as genai

from ..database.db import get_db
from ..database.models import User, Conversation, Message
from .auth import get_current_user

router = APIRouter(prefix="/api/conversations", tags=["chat"])

# Configure Gemini AI if key is set
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_INSTRUCTION = (
    "You are Clarity AI, a premium, thoughtful, and highly intelligent thinking coach and mentor. "
    "Your objective is to guide users through structured reflection and critical thinking to help them "
    "arrive at their own conclusions and decisions. "
    "NEVER solve the user's problem directly. NEVER give them a direct answer or tell them what to do. "
    "Instead, your response MUST be structured strictly into three parts using markdown headings, as follows:\n\n"
    "### 1. Reflect\n"
    "Ask 2-3 deep, open-ended, and clarifying questions that prompt the user to inspect the underlying context, "
    "emotional state, or root cause of their situation.\n\n"
    "### 2. Focus\n"
    "Identify their core priority. Highlight any potential assumptions they are making, or blind spots "
    "they might have overlooked, in a gentle but analytical way.\n\n"
    "### 3. Take Action\n"
    "Suggest exactly ONE (1) concrete, manageable, and immediate micro-step they can take next. "
    "Do NOT offer a list or multiple options. Keep it extremely simple and actionable.\n\n"
    "Maintain a calm, spacious, modern, and professional tone. Avoid clutter and wordiness."
)

# --- Pydantic Schemas ---
class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: str

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    is_favorite: Optional[bool] = None

class ConversationResponse(BaseModel):
    id: str
    title: str
    is_favorite: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    user_message: MessageResponse
    assistant_message: MessageResponse


# --- Streak Update Logic ---
def update_user_streak(user: User, db: Session):
    today = date.today().strftime("%Y-%m-%d")
    if user.last_session_date == today:
        return
    
    if user.last_session_date:
        try:
            last_date = datetime.strptime(user.last_session_date, "%Y-%m-%d").date()
            delta = date.today() - last_date
            if delta.days == 1:
                user.streak += 1
            else:
                user.streak = 1
        except Exception:
            user.streak = 1
    else:
        user.streak = 1
        
    user.last_session_date = today
    db.add(user)
    db.commit()


# --- Mock AI Coach Fallback Generator ---
def generate_mock_coach_response(user_input: str) -> str:
    user_input_lower = user_input.lower()
    
    if any(k in user_input_lower for k in ["career", "job", "work", "boss", "promotion", "business", "company"]):
        reflect = (
            "What does success in this specific career scenario look like for you, beyond the immediate outcome?\n"
            "If you look at this situation from the perspective of a mentor who wants the best for you, what would they notice?"
        )
        focus = (
            "You seem to be prioritizing the external expectations of your role or business. "
            "A potential blind spot is how this decision impacts your long-term energy reserves and personal boundaries."
        )
        action = "Write down a list of your top 3 professional values, and check which one aligns best with this decision."
    elif any(k in user_input_lower for k in ["relationship", "friend", "partner", "love", "family", "parent", "colleague"]):
        reflect = (
            "What unspoken expectations might you be holding for the other person in this dynamic?\n"
            "How does this situation reflect your own values or personal boundaries?"
        )
        focus = (
            "You are focusing on how to change or manage the other person's reaction. "
            "The key blind spot is the parts of this situation that are fully within your control versus what belongs to them."
        )
        action = "Draft a single, honest sentence summarizing your feelings to share with them, but do not send it yet. Read it aloud to yourself first."
    elif any(k in user_input_lower for k in ["health", "fitness", "tired", "sleep", "burnout", "stress", "anxious"]):
        reflect = (
            "When did you first notice this physical or mental friction, and what was happening in your life at that time?\n"
            "What is your body trying to tell you through this stress or discomfort?"
        )
        focus = (
            "You are treating this as a problem to be solved with more discipline. "
            "A blind spot may be that your body is requesting rest, not more optimization or restructuring."
        )
        action = "Set a timer for 10 minutes, turn off all screens, and do nothing but sit or lay down in silence."
    else:
        reflect = (
            "What is the most critical question you are avoiding asking yourself regarding this situation?\n"
            "If you had absolute clarity on this problem, what is the very first thing that would change?"
        )
        focus = (
            "You are treating all components of this issue with equal importance, which is causing cognitive fatigue. "
            "The blind spot is identifying the single leverage point that would make the rest of the problem easier or irrelevant."
        )
        action = "Write down a single sentence that clearly defines the problem, and circle the one word that represents the core challenge."
        
    return f"### 1. Reflect\n{reflect}\n\n### 2. Focus\n{focus}\n\n### 3. Take Action\n**Next Step:** {action}"


# --- Routes ---

@router.get("", response_model=List[ConversationResponse])
def get_conversations(
    search: Optional[str] = None,
    favorites_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Conversation).filter(Conversation.user_id == current_user.id)
    
    if favorites_only:
        query = query.filter(Conversation.is_favorite == True)
        
    if search:
        query = query.filter(Conversation.title.ilike(f"%{search}%"))
        
    return query.order_by(Conversation.updated_at.desc()).all()


@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    conv_data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_conv = Conversation(
        user_id=current_user.id,
        title=conv_data.title.strip() or "Thinking Session"
    )
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)
    return new_conv


@router.patch("/{id}", response_model=ConversationResponse)
def update_conversation(
    id: str,
    conv_data: ConversationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.id == id, Conversation.user_id == current_user.id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    
    if conv_data.title is not None:
        conv.title = conv_data.title.strip() or "Thinking Session"
    if conv_data.is_favorite is not None:
        conv.is_favorite = conv_data.is_favorite
        
    conv.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(conv)
    return conv


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.id == id, Conversation.user_id == current_user.id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
        
    db.delete(conv)
    db.commit()
    return


@router.get("/{id}/messages", response_model=List[MessageResponse])
def get_messages(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.id == id, Conversation.user_id == current_user.id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
        
    return conv.messages


@router.post("/{id}/messages", response_model=ChatResponse)
def send_message(
    id: str,
    msg_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.id == id, Conversation.user_id == current_user.id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    
    user_content = msg_data.content.strip()
    if not user_content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message content cannot be empty")
        
    # 1. Save user message to database
    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        content=user_content
    )
    db.add(user_msg)
    
    # Update conversation updated_at time
    conv.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user_msg)
    
    # 2. Generate AI Coach Response
    ai_response_content = ""
    
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    load_dotenv(dotenv_path=env_path)
    active_key = os.getenv("GEMINI_API_KEY")
    
    if active_key:
        try:
            genai.configure(api_key=active_key)
            # Build chat history for Gemini
            chat_history = []
            # Fetch previous messages (excluding the current one to append manually if needed, or use history)
            # Fetch all except the one we just added to send as current message
            prev_messages = db.query(Message).filter(
                Message.conversation_id == conv.id,
                Message.id != user_msg.id
            ).order_by(Message.created_at).all()
            
            # Map database roles to Gemini api roles (user, model)
            for prev in prev_messages:
                gemini_role = "user" if prev.role == "user" else "model"
                chat_history.append({
                    "role": gemini_role,
                    "parts": [prev.content]
                })
            
            # Use requested model (e.g. gemini-3.5-flash)
            model_name = current_user.ai_model or "gemini-3.5-flash"
            # Map legacy or quota-depleted models to the active gemini-3.5-flash model
            if model_name in ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-flash"]:
                model_name = "gemini-3.5-flash"
                
            model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=SYSTEM_INSTRUCTION
            )
            
            chat = model.start_chat(history=chat_history)
            response = chat.send_message(user_content)
            ai_response_content = response.text
            
        except Exception as e:
            # Log error and fallback to mock coach responses if API call fails
            print(f"Gemini API Error: {str(e)}")
            ai_response_content = generate_mock_coach_response(user_content) + "\n\n*(Note: Running in offline/fallback mode due to API error)*"
    else:
        # Fallback to local structured coach response if no key is set
        ai_response_content = generate_mock_coach_response(user_content)
        
    # 3. Save AI message to database
    assistant_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=ai_response_content
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    
    # 4. Update user streak info
    update_user_streak(current_user, db)
    
    return {
        "user_message": user_msg,
        "assistant_message": assistant_msg
    }
