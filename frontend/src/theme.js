import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10b981', // Emerald/Teal
      light: '#34d399',
      dark: '#059669',
      contrastText: '#0f172a',
    },
    secondary: {
      main: '#f59e0b', // Amber/Gold
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#0f172a',
    },
    background: {
      default: '#0b0f19', // Deep navy black
      paper: '#111827',   // Dark grey/navy
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#10b981',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.021em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.018em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.25s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111827',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.25)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#10b981',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.1)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(11, 15, 25, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
