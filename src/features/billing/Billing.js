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
  IconButton,
  Tooltip,
  Chip,
  TextField,
  styled
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Search as SearchIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { invoices } from '../../data/invoices.js';
import InvoiceDetailsModal from './InvoiceDetailsModal.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { useLocalCRUD } from '../../hooks/useLocalCRUD';
import { useModal } from '../../hooks/useModal';

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

const Billing = () => {
  const { documents: filteredInvoices, setDocuments: setFilteredInvoices } = useLocalCRUD(invoices);
  const { isOpen, selectedItem: selectedInvoice, handleOpen, handleClose } = useModal();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = invoices.filter(invoice =>
      invoice.id.toLowerCase().includes(term) ||
      invoice.customerName.toLowerCase().includes(term)
    );
    setFilteredInvoices(filtered);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();

    doc.text("Reporte de Facturación", 14, 20);
    doc.setFontSize(10);
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, 14, 27);

    const tableColumn = ["ID Factura", "Cliente", "Fecha", "Estado", "Total"];
    const tableRows = [];

    filteredInvoices.forEach(invoice => {
      const invoiceData = [
        invoice.id,
        invoice.customerName,
        invoice.date,
        invoice.status,
        `Bs ${invoice.total.toFixed(2)}`,
      ];
      tableRows.push(invoiceData);
    });

    doc.autoTable(tableColumn, tableRows, {
      startY: 35,
      headStyles: { fillColor: [23, 162, 184] },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
    });

    doc.save('reporte_facturacion.pdf');
  };

  return (
    <StyledPaper>
      <Header>
        <Typography variant="h5">Facturación</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PdfIcon />}
          onClick={handleGenerateReport}
        >
          Generar Reporte
        </Button>
      </Header>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          label="Buscar Factura"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: <SearchIcon />
          }}
        />
      </Box>

      <TableContainer>
        <StyledTable aria-label="tabla de facturación">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID Factura</StyledTableCell>
              <StyledTableCell>Cliente</StyledTableCell>
              <StyledTableCell>Fecha</StyledTableCell>
              <StyledTableCell>Estado</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell component="th" scope="row">{invoice.id}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <Chip label={invoice.status} color={getStatusChipColor(invoice.status)} size="small" />
                </TableCell>
                <TableCell align="right">{`Bs ${invoice.total.toFixed(2)}`}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver Factura">
                    <IconButton onClick={() => handleOpen(invoice)} color="primary">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>

      <InvoiceDetailsModal
        open={isOpen}
        onClose={handleClose}
        invoice={selectedInvoice}
      />
    </StyledPaper>
  );
};

export default Billing;