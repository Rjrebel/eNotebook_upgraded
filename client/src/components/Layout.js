import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  CssBaseline,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { 
  NoteAlt as NoteIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <NoteIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            eNotebook
          </Typography>
          {user && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.name}
            </Typography>
          )}
          
          <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          {user && (
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
        {children}
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          mt: 'auto',
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} eNotebook - MERN Stack Application
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout; 