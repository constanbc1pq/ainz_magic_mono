import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Collapse } from '@mui/material';

const DebugInfo: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [open, setOpen] = useState(false);

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
    const interval = setInterval(updateDebugInfo, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const clearDebugInfo = () => {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('debug_')) {
        sessionStorage.removeItem(key);
      }
    });
    setDebugInfo({});
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
        <Paper sx={{ p: 2, mt: 1, maxWidth: 400, maxHeight: 300, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">Debug Info</Typography>
            <Button size="small" onClick={clearDebugInfo}>Clear</Button>
          </Box>
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
        </Paper>
      </Collapse>
    </Box>
  );
};

export default DebugInfo;