// 调试日志收集器
interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  data?: any;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private addLog(level: LogEntry['level'], message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    
    this.logs.push(entry);
    
    // 保持最新的N条日志
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // 同时输出到console
    console[level](`[DEBUG] ${message}`, data || '');
    
    // 存储到sessionStorage
    sessionStorage.setItem('debug_logs', JSON.stringify(this.logs));
  }

  log(message: string, data?: any) {
    this.addLog('log', message, data);
  }

  error(message: string, data?: any) {
    this.addLog('error', message, data);
  }

  warn(message: string, data?: any) {
    this.addLog('warn', message, data);
  }

  info(message: string, data?: any) {
    this.addLog('info', message, data);
  }

  getLogs(): LogEntry[] {
    // 从sessionStorage恢复日志
    try {
      const stored = sessionStorage.getItem('debug_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      // ignore
    }
    return this.logs;
  }

  clear() {
    this.logs = [];
    sessionStorage.removeItem('debug_logs');
  }
}

export const debugLogger = new DebugLogger();