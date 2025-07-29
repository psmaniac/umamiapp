import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  IconButton, 
  Typography, 
  Autocomplete 
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { products } from '../../data/products';

const OrderModal = ({ open, onClose, onSave, order }) => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName);
      setItems(order.items || []);
    } else {
      setCustomerName('');
      setItems([]);
    }
  }, [order]);

  const handleAddItem = (product) => {
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      setItems(items.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setItems([...items, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (productId) => {
    const existingItem = items.find(item => item.id === productId);
    if (existingItem.quantity === 1) {
      setItems(items.filter(item => item.id !== productId));
    } else {
      setItems(items.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleSave = () => {
    const newOrder = {
      id: order ? order.id : `#${Math.floor(Math.random() * 10000)}`,
      customerName,
      date: new Date().toISOString().split('T')[0],
      status: order ? order.status : 'Pendiente',
      items,
      total: parseFloat(calculateTotal()),
    };
    onSave(newOrder);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{order ? 'Editar Pedido' : 'Añadir Pedido'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Nombre del Cliente"
              fullWidth
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => `${option.name} - $${option.price.toFixed(2)}`}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleAddItem(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Añadir Producto" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Productos en el Pedido</Typography>
            {items.map(item => (
              <Grid container key={item.id} alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <Typography>{item.name}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <IconButton onClick={() => handleRemoveItem(item.id)} size="small">
                    <RemoveIcon />
                  </IconButton>
                  <Typography component="span" sx={{ px: 2 }}>{item.quantity}</Typography>
                  <IconButton onClick={() => handleAddItem(item)} size="small">
                    <AddIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
            <Typography variant="h5" component="p">Total: ${calculateTotal()}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">{order ? 'Guardar Cambios' : 'Crear Pedido'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderModal;