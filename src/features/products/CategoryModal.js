import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  styled,
  Box,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
}));

const CategoryModal = ({ open, onClose, onSave, category }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName || '');
      setDescription(category.description || '');
    } else {
      setCategoryName('');
      setDescription('');
    }
  }, [category, open]);

  useEffect(() => {
    setFormIsValid(categoryName.trim() !== '' && description.trim() !== '');
  }, [categoryName, description]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const categoryData = {
      categoryName: categoryName.trim(),
      description: description.trim(),
      createdAt: category?.createdAt || new Date(),
    };
    onSave(categoryData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <StyledDialogTitle>
        {category ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
        {category ? 'Editar Categoría' : 'Nueva Categoría'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'inherit',
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box component="form" onSubmit={handleSubmit} id="category-form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="categoryName"
            label="Nombre de la Categoría"
            name="categoryName"
            autoFocus
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Descripción"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="secondary"
          startIcon={<CloseIcon />}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          form="category-form" 
          variant="contained" 
          color="primary"
          startIcon={category ? <EditIcon /> : <AddIcon />}
          sx={{ ml: 1 }}
          disabled={!formIsValid && !category} 
        >
          {category ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;