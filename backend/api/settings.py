from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from ..database.db import get_db
from ..database.models import User
from .auth import get_current_user, UserResponse

router = APIRouter(prefix="/api/settings", tags=["settings"])


# --- Pydantic Schemas ---
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    theme: Optional[str] = None
    ai_model: Optional[str] = None
    language: Optional[str] = None


# --- Routes ---

@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.name is not None:
        name_val = profile_data.name.strip()
        if not name_val:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name cannot be empty")
        current_user.name = name_val
        
    if profile_data.theme is not None:
        theme_val = profile_data.theme.strip()
        if theme_val in ["light", "dark"]:
            current_user.theme = theme_val
            
    if profile_data.ai_model is not None:
        model_val = profile_data.ai_model.strip()
        if model_val in ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-3.5-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"]:
            current_user.ai_model = model_val
            
    if profile_data.language is not None:
        lang_val = profile_data.language.strip()
        if lang_val in ["en", "es", "fr", "de"]:
            current_user.language = lang_val

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # This deletes the user and automatically cascades to conversations and messages
    db.delete(current_user)
    db.commit()
    return
