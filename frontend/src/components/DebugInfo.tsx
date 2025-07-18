import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Collapse, Tabs, Tab } from '@mui/material';
import { debugLogger } from '../utils/debugLogger';

const DebugInfo: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const updateDebugInfo = () => {
      const info: any = {};
      
      // 获取所有以 debug_ 开头的 sessionStorage 项
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('debug_')) {
          const value = sessionStorage.getItem(key);
          try {
            info[key] = JSON.parse(value || '');
          } catch {
            info[key] = value;
          }
        }
      }
      
      setDebugInfo(info);
    };

    updateDebugInfo();
    const updateLogs = () => {
      setLogs(debugLogger.getLogs());
    };
    updateLogs();
    
    const interval = setInterval(() => {
      updateDebugInfo();
      updateLogs();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const clearDebugInfo = () => {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('debug_')) {
        sessionStorage.removeItem(key);
      }
    });
    setDebugInfo({});
    debugLogger.clear();
    setLogs([]);
  };

  return (
    <Box sx={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
      <Button 
        variant="contained" 
        color="error" 
        size="small"
        onClick={() => setOpen(!open)}
      >
        Debug Info
      </Button>
      <Collapse in={open}>
        <Paper sx={{ p: 2, mt: 1, maxWidth: 600, maxHeight: 400, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">Debug Info</Typography>
            <Button size="small" onClick={clearDebugInfo}>Clear All</Button>
          </Box>
          
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
            <Tab label="Session Storage" />
            <Tab label={`Logs (${logs.length})`} />
          </Tabs>
          
          {tabValue === 0 && (
            <Box>
              {Object.keys(debugInfo).length === 0 ? (
                <Typography variant="body2">No debug info available</Typography>
              ) : (
                Object.entries(debugInfo).map(([key, value]) => (
                  <Box key={key} sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {key.replace('debug_', '')}:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              {logs.length === 0 ? (
                <Typography variant="body2">No logs available</Typography>
              ) : (
                logs.slice().reverse().map((log, index) => (
                  <Box key={index} sx={{ mb: 1, p: 1, bgcolor: log.level === 'error' ? 'error.light' : 'background.default' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: log.level === 'error' ? 'bold' : 'normal' }}>
                      {log.message}
                    </Typography>
                    {log.data && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontFamily: 'monospace' }}>
                        {typeof log.data === 'object' ? JSON.stringify(log.data, null, 2) : String(log.data)}
                      </Typography>
                    )}
                  </Box>
                ))
              )}
            </Box>
          )}
        </Paper>
      </Collapse>
    </Box>
  );
};

export default DebugInfo;