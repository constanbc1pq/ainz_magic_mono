"""File-based logging system with rotation"""

import os
import json
from datetime import datetime, timedelta
from pathlib import Path
import threading
from typing import Optional, Dict, Any


class FileLogger:
    def __init__(self, log_dir: str = "logs", retention_days: int = 7):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        self.retention_days = retention_days
        self.lock = threading.Lock()
        self._clean_old_logs()
    
    def _get_log_file_path(self) -> Path:
        """Get current log file path based on date"""
        date_str = datetime.now().strftime("%Y-%m-%d")
        return self.log_dir / f"magic_proxy_{date_str}.log"
    
    def _clean_old_logs(self):
        """Remove log files older than retention_days"""
        cutoff_date = datetime.now() - timedelta(days=self.retention_days)
        
        for log_file in self.log_dir.glob("magic_proxy_*.log"):
            try:
                # Extract date from filename
                date_str = log_file.stem.replace("magic_proxy_", "")
                file_date = datetime.strptime(date_str, "%Y-%m-%d")
                
                if file_date < cutoff_date:
                    log_file.unlink()
                    print(f"Removed old log file: {log_file}")
            except Exception:
                # Skip files that don't match the expected format
                pass
    
    def log(self, level: str, message: str, data: Optional[Dict[str, Any]] = None):
        """Write a log entry to file"""
        with self.lock:
            try:
                log_entry = {
                    "timestamp": datetime.now().isoformat(),
                    "level": level,
                    "message": message,
                    "data": data or {}
                }
                
                log_file = self._get_log_file_path()
                
                # Append to log file
                with open(log_file, "a", encoding="utf-8") as f:
                    f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
                    
            except Exception as e:
                print(f"Failed to write log: {e}")
    
    def info(self, message: str, data: Optional[Dict[str, Any]] = None):
        """Log info level message"""
        self.log("INFO", message, data)
    
    def error(self, message: str, data: Optional[Dict[str, Any]] = None):
        """Log error level message"""
        self.log("ERROR", message, data)
    
    def warning(self, message: str, data: Optional[Dict[str, Any]] = None):
        """Log warning level message"""
        self.log("WARNING", message, data)
    
    def debug(self, message: str, data: Optional[Dict[str, Any]] = None):
        """Log debug level message"""
        self.log("DEBUG", message, data)


# Create global logger instance
file_logger = FileLogger()