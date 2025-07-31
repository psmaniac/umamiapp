import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';
import {
  AddCircleOutline as AddIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { accountingEntries } from '../../data/accountingEntries.js';
import AccountingEntryModal from './AccountingEntryModal.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { useLocalCRUD } from '../../hooks/useLocalCRUD';
import { useModal } from '../../hooks/useModal';

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& .MuiTypography-root': {
    fontWeight: 700,
    color: theme.palette.primary.main,
  }
}));

const StyledTable = styled(Table)({
  minWidth: 650,
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const Accounting = () => {
  const { documents: entries, add, update, remove } = useLocalCRUD(accountingEntries);
  const { isOpen, selectedItem: selectedEntry, handleOpen, handleClose } = useModal();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = useMemo(() => {
    return entries.filter(entry =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [entries, searchTerm]);

  const totalIncome = useMemo(() => {
    return entries.filter(entry => entry.type === 'Ingreso')
                  .reduce((sum, entry) => sum + entry.amount, 0);
  }, [entries]);

  const totalExpense = useMemo(() => {
    return entries.filter(entry => entry.type === 'Gasto')
                  .reduce((sum, entry) => sum + entry.amount, 0);
  }, [entries]);

  const handleSaveEntry = (entry) => {
    if (entry.id) {
      update(entry.id, entry);
    } else {
      add({ ...entry, id: new Date().getTime() });
    }
    handleClose();
  };

  const handleDeleteEntry = (id) => {
    remove(id);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.text("Reporte Contable", 14, 20);
    doc.setFontSize(10);
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, 14, 27);

    const tableColumn = ["ID", "Fecha", "Tipo", "Descripción", "Monto"];
    const tableRows = [];

    filteredEntries.forEach(entry => {
      const entryData = [
        entry.id,
        entry.date,
        entry.type,
        entry.description,
        `${entry.type === 'Ingreso' ? '+' : '-'}Bs ${Math.abs(entry.amount).toFixed(2)}`,
      ];
      tableRows.push(entryData);
    });

    doc.autoTable(tableColumn, tableRows, {
      startY: 35,
      headStyles: { fillColor: [23, 162, 184] },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
    });

    doc.text(`Ingresos Totales: Bs ${totalIncome.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Gastos Totales: Bs ${Math.abs(totalExpense).toFixed(2)}`, 14, doc.autoTable.previous.finalY + 17);
    doc.text(`Balance: Bs ${(totalIncome + totalExpense).toFixed(2)}`, 14, doc.autoTable.previous.finalY + 24);

    doc.save('reporte_contable.pdf');
  };

  return (
    <StyledPaper>
      <Header>
        <Typography variant="h5">Contabilidad</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ mr: 2 }}
          >
            Añadir Registro
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PdfIcon />}
            onClick={handleGenerateReport}
          >
            Generar Reporte
          </Button>
        </Box>
      </Header>

      <Paper elevation={3} sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-around' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">Ingresos Totales</Typography>
          <Typography variant="h5">Bs {totalIncome.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="error.main">Gastos Totales</Typography>
          <Typography variant="h5">Bs {Math.abs(totalExpense).toFixed(2)}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary.main">Balance</Typography>
          <Typography variant="h5">Bs {(totalIncome + totalExpense).toFixed(2)}</Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          label="Buscar Registro"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <Chip label="Buscar" size="small" />
          }}
        />
      </Box>

      <TableContainer>
        <StyledTable aria-label="tabla de registros contables">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Fecha</StyledTableCell>
              <StyledTableCell>Tipo</StyledTableCell>
              <StyledTableCell>Descripción</StyledTableCell>
              <StyledTableCell align="right">Monto</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id} hover>
                <TableCell>{entry.id}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>
                  <Chip
                    label={entry.type}
                    color={entry.type === 'Ingreso' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell align="right" sx={{ color: entry.type === 'Ingreso' ? 'success.main' : 'error.main' }}>
                  {entry.type === 'Ingreso' ? '+' : '-'}Bs {Math.abs(entry.amount).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar Registro">
                    <IconButton onClick={() => handleOpen(entry)} color="secondary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Registro">
                    <IconButton onClick={() => handleDeleteEntry(entry.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>

      <AccountingEntryModal
        open={isOpen}
        onClose={handleClose}
        onSave={handleSaveEntry}
        entry={selectedEntry}
      />
    </StyledPaper>
  );
};

export default Accounting;