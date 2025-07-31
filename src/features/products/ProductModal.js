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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Stack, // Import Stack for better spacing of chips
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Fastfood as ProductIcon,
  Category as CategoryIcon,
  AttachMoney as PriceIcon,
} from '@mui/icons-material';
import { getAllDocuments } from '../../firestore/firestoreService';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
}));

const ProductModal = ({ open, onClose, onSave, product }) => {
  const [name, setName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getAllDocuments('categories');
      setCategoriesList(fetchedCategories.map(cat => cat.categoryName));
    };

    if (open) {
      fetchCategories();
      if (product) {
        setName(product.name || '');
        setSelectedCategories(product.categories || []);
        setPrice(product.price || '');
      } else {
        setName('');
        setSelectedCategories([]);
        setPrice('');
      }
    }
  }, [product, open]);

  useEffect(() => {
    setFormIsValid(name.trim() !== '' && price !== '' && !isNaN(parseFloat(price)));
  }, [name, price]); // Removed selectedCategories.length > 0 from validation

  const handleSubmit = (event) => {
    event.preventDefault();
    const productData = {
      name: name.trim(),
      categories: selectedCategories, // Send array of categories
      price: parseFloat(price),
      createdAt: product?.createdAt || new Date(),
    };
    onSave(productData);
  };

  const handleDeleteCategory = (categoryToDelete) => () => {
    setSelectedCategories((categories) => categories.filter((category) => category !== categoryToDelete));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <StyledDialogTitle>
        {product ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
        {product ? 'Editar Producto' : 'Nuevo Producto'}
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
        <Box component="form" onSubmit={handleSubmit} id="product-form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nombre del Producto"
            name="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ProductIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {selectedCategories.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ my: 1, flexWrap: 'wrap' }}>
              {selectedCategories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onDelete={handleDeleteCategory(category)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Stack>
          )}

          <Autocomplete
            multiple
            id="categories"
            options={categoriesList}
            getOptionLabel={(option) => option}
            value={selectedCategories}
            onChange={(event, newValue) => {
              setSelectedCategories(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                fullWidth
                label="Categorías"
                placeholder="Seleccionar categorías"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Precio"
            name="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PriceIcon color="primary" />
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
          form="product-form" 
          variant="contained" 
          color="primary"
          startIcon={product ? <EditIcon /> : <AddIcon />}
          sx={{ ml: 1 }}
          disabled={!formIsValid && !product} // Deshabilitar solo si es un nuevo producto y el formulario no es válido
        >
          {product ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;