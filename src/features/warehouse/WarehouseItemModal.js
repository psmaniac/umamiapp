import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid 
} from '@mui/material';

const WarehouseItemModal = ({ open, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    minStock: '',
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        category: '',
        stock: '',
        minStock: '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const newItem = {
      ...formData,
      id: item ? item.id : Date.now(), // Simple ID generation
      stock: parseInt(formData.stock, 10) || 0,
      minStock: parseInt(formData.minStock, 10) || 0,
    };
    onSave(newItem);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? 'Editar Artículo' : 'Añadir Artículo'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Nombre del Artículo"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="category"
              label="Categoría"
              fullWidth
              value={formData.category}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="stock"
              label="Stock Actual"
              type="number"
              fullWidth
              value={formData.stock}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="minStock"
              label="Stock Mínimo"
              type="number"
              fullWidth
              value={formData.minStock}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          {item ? 'Guardar Cambios' : 'Añadir Artículo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarehouseItemModal;