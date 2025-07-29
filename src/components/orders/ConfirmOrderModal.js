import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  styled,
} from '@mui/material';

// --- Estilos ---
const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 24,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  gap: theme.spacing(3),
}));

const FormContainer = styled('div')({ flex: 1 });
const RightPanel = styled('div')({ flex: 1 });

const NumericKeypad = styled(Grid)({
  marginTop: '16px',
});

const KeypadButton = styled(Button)({
  height: '60px',
  fontSize: '1.5rem',
});

const TableMap = styled(Grid)({
  marginTop: '16px',
});

const TableButton = styled(Button)(({ theme, selected }) => ({
  height: '50px',
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.primary.light : 'transparent',
}));

const ConfirmOrderModal = ({ open, onClose, onConfirm, total }) => {
  const [razonSocial, setRazonSocial] = useState('');
  const [nit, setNit] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);

  const handleKeypadClick = (key) => {
    if (key === 'C') {
      setAmountPaid('');
    } else if (key === '←') {
      setAmountPaid(prev => prev.slice(0, -1));
    } else {
      setAmountPaid(prev => prev + key);
    }
  };

  const handleConfirm = () => {
    onConfirm({
      customerName: razonSocial || `Mesa ${selectedTable}` || 'Cliente',
      nit,
      amountPaid: parseFloat(amountPaid) || 0,
      table: selectedTable,
      isTakeaway: selectedTable === null,
    });
    // Reset state
    setRazonSocial('');
    setNit('');
    setAmountPaid('');
    setSelectedTable(null);
  };

  const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←', 'C'];
  const tables = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        {/* Panel Izquierdo: Formulario y Teclado */}
        <FormContainer>
          <Typography variant="h6" gutterBottom>Confirmar Pedido</Typography>
          <TextField
            label="Razón Social (Opcional)"
            fullWidth
            margin="normal"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
          />
          <TextField
            label="NIT/CI (Opcional)"
            fullWidth
            margin="normal"
            value={nit}
            onChange={(e) => setNit(e.target.value)}
          />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Total a Pagar: ${total.toFixed(2)}
          </Typography>
          <TextField
            label="Monto Recibido"
            fullWidth
            margin="normal"
            value={amountPaid}
            InputProps={{ readOnly: true }}
          />
          <NumericKeypad container spacing={1}>
            {keypadKeys.map(key => (
              <Grid item xs={4} key={key}>
                <KeypadButton fullWidth variant="outlined" onClick={() => handleKeypadClick(key)}>
                  {key}
                </KeypadButton>
              </Grid>
            ))}
          </NumericKeypad>
        </FormContainer>

        {/* Panel Derecho: Mesas y Acciones */}
        <RightPanel>
          <Typography variant="h6">Seleccionar Mesa</Typography>
          <TableMap container spacing={1}>
            {tables.map(tableNum => (
              <Grid item xs={4} key={tableNum}>
                <TableButton
                  fullWidth
                  variant={selectedTable === tableNum ? 'contained' : 'outlined'}
                  onClick={() => setSelectedTable(tableNum)}
                >
                  {`Mesa ${tableNum}`}
                </TableButton>
              </Grid>
            ))}
          </TableMap>
          <Button
            fullWidth
            variant={selectedTable === null ? 'contained' : 'outlined'}
            sx={{ mt: 2, height: '50px' }}
            onClick={() => setSelectedTable(null)}
          >
            Orden para Llevar
          </Button>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={onClose}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleConfirm}>Aceptar Pedido</Button>
          </Box>
        </RightPanel>
      </ModalContainer>
    </Modal>
  );
};

export default ConfirmOrderModal;
