import React from 'react';
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
  styled
} from '@mui/material';
import { 
  AddCircleOutline as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Warning as WarningIcon 
} from '@mui/icons-material';
import { warehouseItems } from '../../data/warehouseItems.js';
import WarehouseItemModal from './WarehouseItemModal.js';

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

const Warehouse = () => {
  const { documents: items, add, update, remove } = useLocalCRUD(warehouseItems);
  const { isOpen, selectedItem, handleOpen, handleClose } = useModal();

  const handleSaveItem = (item) => {
    if (item.id) {
      update(item.id, item);
    } else {
      add({ ...item, id: new Date().getTime() });
    }
    handleClose();
  };

  const handleDeleteItem = (id) => {
    remove(id);
  };

  return (
    <StyledPaper>
      <Header>
        <Typography variant="h5">Gestión de Almacén</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
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
                    <IconButton onClick={() => handleOpen(item)} color="secondary">
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
        open={isOpen}
        onClose={handleClose}
        onSave={handleSaveItem}
        item={selectedItem}
      />
    </StyledPaper>
  );
};

export default Warehouse;