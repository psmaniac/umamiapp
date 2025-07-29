import React, { useState } from 'react';
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
  styled
} from '@mui/material';
import { 
  AddCircleOutline as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Warning as WarningIcon 
} from '@mui/icons-material';
import { warehouseItems } from '../data/warehouseItems';
import WarehouseItemModal from './warehouse/WarehouseItemModal';

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

const Warehouse = () => {
  const [items, setItems] = useState(warehouseItems);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenModal = (item = null) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setModalOpen(false);
  };

  const handleSaveItem = (item) => {
    const isNewItem = !items.find(i => i.id === item.id);
    if (isNewItem) {
      setItems([item, ...items]);
    } else {
      setItems(items.map(i => i.id === item.id ? item : i));
    }
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <StyledPaper>
      <Header>
        <Typography variant="h5">Gestión de Almacén</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Añadir Artículo
        </Button>
      </Header>

      <TableContainer>
        <StyledTable aria-label="tabla de almacén">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nombre del Artículo</StyledTableCell>
              <StyledTableCell>Categoría</StyledTableCell>
              <StyledTableCell align="right">Stock Actual</StyledTableCell>
              <StyledTableCell align="right">Stock Mínimo</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} hover sx={{ backgroundColor: item.stock < item.minStock ? 'rgba(255, 165, 0, 0.1)' : 'inherit' }}>
                <TableCell>{item.id}</TableCell>
                <TableCell component="th" scope="row">
                  {item.name}
                  {item.stock < item.minStock && (
                    <Tooltip title="Stock bajo">
                      <WarningIcon color="warning" sx={{ ml: 1, verticalAlign: 'middle' }} />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">{item.stock}</TableCell>
                <TableCell align="right">{item.minStock}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar Artículo">
                    <IconButton onClick={() => handleOpenModal(item)} color="secondary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Artículo">
                    <IconButton onClick={() => handleDeleteItem(item.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>

      <WarehouseItemModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        item={selectedItem}
      />
    </StyledPaper>
  );
};

export default Warehouse;