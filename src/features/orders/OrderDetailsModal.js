import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Divider
} from '@mui/material';

const OrderDetailsModal = ({ open, onClose, order }) => {
  if (!order) return null;

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Completado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'En Preparación':
        return 'info';
      case 'Cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles del Pedido - {order.id}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="text.secondary">Cliente:</Typography>
            <Typography variant="body1">{order.customerName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="text.secondary">Fecha:</Typography>
            <Typography variant="body1">{order.date}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="text.secondary">Estado:</Typography>
            <Chip label={order.status} color={getStatusChipColor(order.status)} size="small" />
          </Grid>
          <Grid item xs={12} sx={{ my: 2 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Productos</Typography>
            {order.items && order.items.map(item => (
              <Grid container key={item.id} justifyContent="space-between">
                <Grid item>
                  <Typography>{item.name} x {item.quantity}</Typography>
                </Grid>
                <Grid item>
                  <Typography>Bs {(item.price * item.quantity).toFixed(2)}</Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
            <Typography variant="h5" component="p">Total: Bs {order.total.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;