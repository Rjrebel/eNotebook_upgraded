import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, Chip, Box } from '@mui/material';
import { Edit, Delete, Bookmark } from '@mui/icons-material';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }
      }}
      elevation={3}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {note.title}
          </Typography>
          {note.category && (
            <Chip 
              size="small" 
              icon={<Bookmark fontSize="small" />} 
              label={note.category} 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {truncateContent(note.content)}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {note.tags && note.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" />
          ))}
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {formatDate(note.updatedAt)}
        </Typography>
        
        <Box>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => onEdit(note)}
            aria-label="edit note"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => onDelete(note._id)}
            aria-label="delete note"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default NoteCard; 