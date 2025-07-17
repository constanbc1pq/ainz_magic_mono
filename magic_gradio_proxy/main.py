#!/usr/bin/env python3
"""Main entry point for Magic Gradio Proxy"""

import uvicorn
from src.config import settings
from src.file_logger import file_logger


def main():
    """Run the FastAPI application"""
    file_logger.info(f"Starting server on {settings.service_host}:{settings.service_port}")
    
    uvicorn.run(
        "src.app:app",
        host=settings.service_host,
        port=settings.service_port,
        reload=settings.environment == "development",
        log_level=settings.log_level.lower()
    )


if __name__ == "__main__":
    main()