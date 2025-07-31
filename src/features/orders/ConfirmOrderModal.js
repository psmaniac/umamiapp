import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  styled,
} from '@mui/material';

// --- Estilos ---
const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 1400,
  height: '90vh',
  backgroundColor: theme.palette.background.paper,
  boxShadow: 24,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
}));

const Section = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const KeypadButton = styled(Button)({
  fontSize: '1.8rem',
  width: '70px', // Ancho fijo para botones normales
  height: '70px', // Altura fija para que sea cuadrado
});

const TableButton = styled(Button)(({ theme, selected }) => ({
  height: '60px',
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.primary.light : 'transparent',
}));

const ConfirmOrderModal = ({ open, onClose, onConfirm, total }) => {
  const [razonSocial, setRazonSocial] = useState('');
  const [nit, setNit] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [isTakeaway, setIsTakeaway] = useState(false);
  

  const razonSocialRef = useRef(null);
  const nitRef = useRef(null);
  const amountPaidRef = useRef(null);

  const change = parseFloat(amountPaid) - total;
  const displayChange = change >= 0 ? change.toFixed(2) : '0.00';
  const isConfirmDisabled = selectedTable === null && !isTakeaway;

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (razonSocialRef.current) {
          razonSocialRef.current.focus();
          razonSocialRef.current.select();
        }
      }, 100);
      setRazonSocial('');
      setNit('');
      setAmountPaid('');
      setSelectedTable(null);
      setIsTakeaway(false);
    }
  }, [open]);

  const handleKeypadClick = (key) => {
    if (key === 'Enter') {
      if (!isConfirmDisabled) handleConfirm();
    } else if (key === '←') {
      setAmountPaid((prev) => prev.slice(0, -1));
    } else {
      setAmountPaid((prev) => prev + key);
    }
  };

  const handleEnterNavigation = (e, nextFieldRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldRef?.current) {
        nextFieldRef.current.focus();
        nextFieldRef.current.select();
      }
    }
  };

  const handleConfirm = () => {
    onConfirm({
      customerName: razonSocial.trim() || 'Sin Razon Social',
      nit: nit.trim() || 'Sin NIT/CI',
      amountPaid: parseFloat(amountPaid) || 0,
      table: selectedTable,
      isTakeaway,
    });
    onClose();
  };

  const handleSelectTable = (tableNum) => {
    setSelectedTable(tableNum);
    setIsTakeaway(false);
  };

  const handleSelectTakeaway = () => {
    setSelectedTable(null);
    setIsTakeaway(true);
  };

  const keypadLayout = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['←', '0', '.'],
    ['Enter'],
  ];

  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <Grid container spacing={2} sx={{ flexWrap: 'nowrap', width: '100%' }}>

          {/* Sección 1: Teclado Numérico */}
          <Grid item sx={{ flex: 1, minWidth: 0, borderRight: '1px solid #e0e0e0', pr: 2 }}>
            <Section sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: 350 }}>
                <Typography variant="h6" align="center" gutterBottom>
                  Teclado Virtual
                </Typography>
                <Grid container spacing={1} justifyContent="center">
                  {keypadLayout.map((row, rowIndex) => (
                    <Grid container item spacing={1} key={rowIndex} justifyContent="center">
                      {row.map((key) => {
                        const isEnter = key === 'Enter';
                        const buttonWidth = isEnter ? '242px' : '70px'; // Ancho fijo para Enter
                        const itemWidth = isEnter ? '246px' : '78px'; // Ancho del Grid item (botón + espaciado)

                        return (
                          <Grid item key={key} sx={{ width: itemWidth }}>
                            <KeypadButton
                              variant="outlined"
                              onClick={() => handleKeypadClick(key)}
                                                            disabled={false}
                              sx={{ width: buttonWidth }} // Aplicar ancho específico al botón
                            >
                              {key}
                            </KeypadButton>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Section>
          </Grid>

          {/* Sección 2: Datos del Cliente */}
          <Grid item sx={{ flex: 1, minWidth: 0, borderRight: '1px solid #e0e0e0', px: 2 }}>
            <Section>
              <Typography variant="h6" align="center" gutterBottom>Datos del Cliente</Typography>
              <TextField
                inputRef={razonSocialRef}
                label="Razón Social (Opcional)"
                fullWidth
                margin="normal"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
                onKeyDown={(e) => handleEnterNavigation(e, nitRef)}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
              <TextField
                inputRef={nitRef}
                label="NIT/CI (Opcional)"
                fullWidth
                margin="normal"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                onKeyDown={(e) => handleEnterNavigation(e, amountPaidRef)}
                onFocus={(e) => e.target.select()}
              />
              <Typography variant="h4" align="center" sx={{ my: 2 }}>
                Total: Bs {total.toFixed(2)}
              </Typography>
              <TextField
                inputRef={amountPaidRef}
                label="Monto Recibido"
                fullWidth
                margin="normal"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value.replace(/[^\d.]/g, ''))}
                onFocus={(e) => e.target.select()}
                type="number"
                inputProps={{ step: "0.01" }}
              />
              <Typography variant="h5" align="center" sx={{ mt: 1 }}>
                Cambio: Bs {displayChange}
              </Typography>
            </Section>
          </Grid>

          {/* Sección 3: Selección de Mesa y Acciones */}
          <Grid item sx={{ flex: 1, minWidth: 0, pl: 2 }}>
            <Section>
              <Typography variant="h6" align="center" gutterBottom>Seleccionar Opción</Typography>
              <Grid container spacing={1} sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                {tables.map((tableNum) => (
                  <Grid item xs={4} key={tableNum}>
                    <TableButton
                      fullWidth
                      selected={selectedTable === tableNum}
                      onClick={() => handleSelectTable(tableNum)}
                    >
                      {`Mesa ${tableNum}`}
                    </TableButton>
                  </Grid>
                ))}
              </Grid>
              <Button
                fullWidth
                variant={isTakeaway ? 'contained' : 'outlined'}
                sx={{ mt: 2, height: '60px' }}
                onClick={handleSelectTakeaway}
              >
                Orden para Llevar
              </Button>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button variant="outlined" color="secondary" onClick={onClose} sx={{ flex: 1, height: '60px' }}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                  sx={{ flex: 1, height: '60px' }}
                >
                  Aceptar Pedido
                </Button>
              </Box>
            </Section>
          </Grid>

        </Grid>
      </ModalContainer>
    </Modal>
  );
};

export default ConfirmOrderModal;