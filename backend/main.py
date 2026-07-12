import os
from dotenv import load_dotenv

# Load environment variables from .env file using absolute path relative to main.py
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import mimetypes
from .database.db import engine, Base
from .api import auth, chat, settings

# Ensure proper MIME types for ES module scripts on Windows
mimetypes.init()
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

# Perform database migration / initialization (creates SQLite tables automatically)
Base.metadata.create_all(bind=engine)

# Migration: check and add 'mode' column to 'messages' table if it does not already exist
from sqlalchemy import text
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE messages ADD COLUMN mode VARCHAR;"))
        conn.commit()
    except Exception:
        # Column already exists or table does not exist
        pass


app = FastAPI(
    title="Clarity AI API", 
    description="Backend server and thinking assistant engine for Clarity AI"
)

# Enable CORS for local developer tools and API testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def disable_cache_on_dev(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/js") or request.url.path.startswith("/css"):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    return response

# Include auth, chat, and settings API modules
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(settings.router)

# Locate and mount frontend files
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

if os.path.exists(frontend_dir):
    # Mount frontend subfolders if they exist (assets, css, js)
    css_path = os.path.join(frontend_dir, "css")
    js_path = os.path.join(frontend_dir, "js")
    assets_path = os.path.join(frontend_dir, "assets")

    # Create directories if they don't exist yet, to prevent mounting errors
    os.makedirs(css_path, exist_ok=True)
    os.makedirs(js_path, exist_ok=True)
    os.makedirs(assets_path, exist_ok=True)

    app.mount("/css", StaticFiles(directory=css_path), name="css")
    app.mount("/js", StaticFiles(directory=js_path), name="js")
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    # Serve index.html at root route
    @app.get("/")
    async def serve_index():
        index_file = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Clarity AI Frontend is ready. Please write your index.html file."}
else:
    @app.get("/")
    async def root_fallback():
        return {"message": "Clarity AI API is running. Frontend directory not found."}
