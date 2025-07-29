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

const InvoiceDetailsModal = ({ open, onClose, invoice }) => {
  if (!invoice) return null;

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Pagada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Vencida':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles de la Factura - {invoice.id}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="text.secondary">Cliente:</Typography>
            <Typography variant="body1">{invoice.customerName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="text.secondary">Fecha:</Typography>
            <Typography variant="body1">{invoice.date}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="text.secondary">Estado:</Typography>
            <Chip label={invoice.status} color={getStatusChipColor(invoice.status)} size="small" />
          </Grid>
          <Grid item xs={12} sx={{ my: 2 }}>
            <Divider />
          </Grid>
          {/* Aquí podrías añadir los ítems de la factura si los tuvieras en los datos de ejemplo */}
          <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
            <Typography variant="h5" component="p">Total: ${invoice.total.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDetailsModal;