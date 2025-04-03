import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';

// Initial state
const initialState = {
  notes: [],
  loading: false,
  error: null,
  currentNote: null,
};

// Create context
const NoteContext = createContext(initialState);

// Reducer
const noteReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_NOTES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_NOTES_SUCCESS':
      return {
        ...state,
        loading: false,
        notes: action.payload,
      };
    case 'FETCH_NOTES_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SET_CURRENT_NOTE':
      return {
        ...state,
        currentNote: action.payload,
      };
    case 'CREATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      };
    case 'UPDATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.map(note => 
          note._id === action.payload._id ? action.payload : note
        ),
        currentNote: action.payload,
      };
    case 'DELETE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.filter(note => note._id !== action.payload),
        currentNote: state.currentNote && state.currentNote._id === action.payload ? null : state.currentNote,
      };
    default:
      return state;
  }
};

// Provider component
export const NoteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch all notes
  const fetchNotes = async () => {
    dispatch({ type: 'FETCH_NOTES_REQUEST' });
    try {
      const data = await getNotes();
      dispatch({ type: 'FETCH_NOTES_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_NOTES_FAILURE', payload: error.message });
    }
  };

  // Set current note
  const setCurrentNote = (note) => {
    dispatch({ type: 'SET_CURRENT_NOTE', payload: note });
  };

  // Add a new note
  const addNote = async (noteData) => {
    try {
      const newNote = await createNote(noteData);
      dispatch({ type: 'CREATE_NOTE_SUCCESS', payload: newNote });
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  // Update a note
  const editNote = async (id, noteData) => {
    try {
      const updatedNote = await updateNote(id, noteData);
      dispatch({ type: 'UPDATE_NOTE_SUCCESS', payload: updatedNote });
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  // Delete a note
  const removeNote = async (id) => {
    try {
      await deleteNote(id);
      dispatch({ type: 'DELETE_NOTE_SUCCESS', payload: id });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes: state.notes,
        loading: state.loading,
        error: state.error,
        currentNote: state.currentNote,
        fetchNotes,
        setCurrentNote,
        addNote,
        editNote,
        removeNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

// Custom hook to use the note context
export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
}; 