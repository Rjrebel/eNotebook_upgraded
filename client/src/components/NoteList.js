import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
  Typography,
  Tooltip
} from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';

const NoteList = ({ 
  notes, 
  loading, 
  error, 
  onEditNote, 
  onDeleteNote 
}) => {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Extract unique categories from notes
  const categories = ['All', ...new Set(notes.map(note => note.category))];

  // Sort notes
  useEffect(() => {
    let result = [...notes];
    
    // Filter by search term (title, content or tags)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(note => 
        note.title.toLowerCase().includes(lowerCaseSearchTerm) || 
        note.content.toLowerCase().includes(lowerCaseSearchTerm) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
      );
    }
    
    // Filter by category
    if (categoryFilter && categoryFilter !== 'All') {
      result = result.filter(note => note.category === categoryFilter);
    }

    setFilteredNotes(result);
  }, [notes, searchTerm, categoryFilter]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle category filter change
  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search notes..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
          }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={categoryFilter}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredNotes.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <Typography variant="h6" color="text.secondary">
            {notes.length === 0 
              ? "You don't have any notes yet. Create your first note!" 
              : "No notes match your search criteria."}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note._id}>
              <Card sx={{
                position: 'relative',
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" noWrap>
                      {note.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => onEditNote(note)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => onDeleteNote(note._id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {note.content}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Chip 
                      label={note.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    {note.tags.map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default NoteList; 