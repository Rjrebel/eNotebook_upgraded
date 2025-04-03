import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import { getNotes, createNote, updateNote, deleteNote } from './services/api';
import { Box, Stack, Typography, Button, IconButton, Alert } from '@mui/material';
import { Add, LightMode, DarkMode } from '@mui/icons-material';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      setNotes([newNote, ...notes]);
      setShowNoteForm(false);
      setCurrentNote(null);
    } catch (err) {
      setError('Failed to create note');
    }
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setShowNoteForm(true);
  };

  const handleUpdateNote = async (noteData) => {
    try {
      const updatedNote = await updateNote(currentNote._id, noteData);
      setNotes(notes.map(note => 
        note._id === currentNote._id ? updatedNote : note
      ));
      setShowNoteForm(false);
      setCurrentNote(null);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
        setNotes(notes.filter(note => note._id !== noteId));
      } catch (err) {
        setError('Failed to delete note');
      }
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      const noteToUpdate = notes.find(note => note._id === noteId);
      const updatedNote = await updateNote(noteId, { ...noteToUpdate, isPinned: !noteToUpdate.isPinned });
      setNotes(notes.map(note => 
        note._id === noteId ? updatedNote : note
      ));
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h4" component="h1">
                        My Notes
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setShowNoteForm(true)}
                        startIcon={<Add />}
                      >
                        Add New Note
                      </Button>
                    </Stack>

                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    )}

                    <NoteList
                      notes={notes}
                      loading={loading}
                      error={error}
                      onEditNote={handleEditNote}
                      onDeleteNote={handleDeleteNote}
                      onTogglePin={handleTogglePin}
                    />

                    <NoteForm
                      note={currentNote}
                      onSubmit={currentNote ? handleUpdateNote : handleAddNote}
                      onCancel={() => {
                        setShowNoteForm(false);
                        setCurrentNote(null);
                      }}
                      open={showNoteForm}
                    />
                  </Box>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
