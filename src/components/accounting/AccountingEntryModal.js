import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';

const AccountingEntryModal = ({ open, onClose, onSave, entry }) => {
  const [formData, setFormData] = useState({
    date: '',
    type: 'Ingreso',
    description: '',
    amount: '',
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        ...entry,
        amount: Math.abs(entry.amount).toString(), // Ensure positive for editing
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'Ingreso',
        description: '',
        amount: '',
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const newEntry = {
      ...formData,
      id: entry ? entry.id : `ACC-${Date.now()}`,
      amount: parseFloat(formData.amount) * (formData.type === 'Gasto' ? -1 : 1),
    };
    onSave(newEntry);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{entry ? 'Editar Registro Contable' : 'Añadir Registro Contable'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="date"
              label="Fecha"
              type="date"
              fullWidth
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Tipo"
                onChange={handleChange}
              >
                <MenuItem value="Ingreso">Ingreso</MenuItem>
                <MenuItem value="Gasto">Gasto</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Descripción"
              fullWidth
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="amount"
              label="Monto"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          {entry ? 'Guardar Cambios' : 'Añadir Registro'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountingEntryModal;