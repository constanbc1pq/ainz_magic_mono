import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Logo from '../components/Logo/Logo';
import { debugLogger } from '../utils/debugLogger';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 忘记密码相关状态
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(0);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { login, loading, resetPassword } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('🔐 LoginPage: Form submitted');
    console.log('📧 LoginPage: Email:', email);
    console.log('🔒 LoginPage: Password length:', password.length);

    try {
      console.log('🚀 LoginPage: Calling login function...');
      debugLogger.log('🚀 LoginPage: Calling login function', { email });
      
      await login({ email, password });
      
      console.log('✅ LoginPage: Login successful, navigating to dashboard');
      debugLogger.log('✅ LoginPage: Login successful');
      
      // 检查token是否真的被存储
      const storedToken = localStorage.getItem('access_token');
      debugLogger.log('🔍 LoginPage: Token check after login', {
        hasToken: !!storedToken,
        tokenPreview: storedToken ? storedToken.substring(0, 30) + '...' : 'No token'
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ LoginPage: Login failed');
      console.error('🔍 LoginPage: Error object:', err);
      console.error('🔍 LoginPage: Error response:', err.response);
      console.error('🔍 LoginPage: Error response data:', err.response?.data);
      console.error('🔍 LoginPage: Error message:', err.response?.data?.message);
      setError(err.response?.data?.message || '登录失败，请检查邮箱和密码');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOpenForgotPassword = () => {
    setForgotPasswordOpen(true);
    setResetStep(0);
    setResetError(null);
    setResetSuccess(false);
    setResetEmail('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
  };

  const handleResetPassword = async () => {
    setResetError(null);
    setResetLoading(true);

    // 验证新密码
    if (newPassword !== confirmNewPassword) {
      setResetError(t('auth.passwordMismatch'));
      setResetLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setResetError(t('auth.passwordTooShort'));
      setResetLoading(false);
      return;
    }

    try {
      await resetPassword(resetEmail, newPassword);
      setResetSuccess(true);
      setResetStep(1);
      
      // 3秒后自动关闭对话框
      setTimeout(() => {
        handleCloseForgotPassword();
        // 自动填充邮箱
        setEmail(resetEmail);
        setPassword('');
      }, 3000);
    } catch (err: any) {
      setResetError(err.response?.data?.message || t('auth.resetError'));
    } finally {
      setResetLoading(false);
    }
  };

  const steps = [t('auth.resetDialog.step1'), t('auth.resetDialog.step2')];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Logo size={60} clickable={true} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {t('auth.loginTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('auth.subtitle')}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={handleOpenForgotPassword}
                sx={{ 
                  color: theme.palette.secondary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('auth.forgotPassword')}
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : t('auth.login')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                {t('auth.noAccount')}{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  variant="body2"
                  sx={{ 
                    color: 'secondary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'secondary.light'
                    }
                  }}
                >
                  {t('auth.registerNow')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* 忘记密码对话框 */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t('auth.resetDialog.title')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={resetStep} sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {resetStep === 0 && (
              <>
                {resetError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {resetError}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label={t('auth.resetDialog.emailLabel')}
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText={t('auth.resetDialog.emailHelper')}
                />

                <TextField
                  fullWidth
                  label={t('auth.resetDialog.newPasswordLabel')}
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText={t('auth.resetDialog.newPasswordHelper')}
                />

                <TextField
                  fullWidth
                  label={t('auth.resetDialog.confirmPasswordLabel')}
                  type={showPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}

            {resetStep === 1 && resetSuccess && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircleIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: theme.palette.success.main,
                    mb: 2,
                  }} 
                />
                <Typography variant="h6" gutterBottom>
                  {t('auth.resetDialog.successTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.resetDialog.successMessage')}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {resetStep === 0 && (
            <>
              <Button 
                onClick={handleCloseForgotPassword}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                {t('auth.resetDialog.cancelButton')}
              </Button>
              <Button 
                onClick={handleResetPassword} 
                variant="contained"
                disabled={resetLoading || !resetEmail || !newPassword || !confirmNewPassword}
              >
                {resetLoading ? <CircularProgress size={20} /> : t('auth.resetDialog.resetButton')}
              </Button>
            </>
          )}
          {resetStep === 1 && (
            <Button onClick={handleCloseForgotPassword} variant="contained">
              {t('auth.resetDialog.confirmButton')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginPage;