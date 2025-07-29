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
  Visibility as ViewIcon 
} from '@mui/icons-material';
import OrderModal from './orders/OrderModal';
import OrderDetailsModal from './orders/OrderDetailsModal';

// Datos de ejemplo
const sampleOrders = [
  { id: '#1234', customerName: 'Carlos Santana', date: '2024-07-28', status: 'Completado', total: 55.50, items: [{ id: 1, name: 'Hamburguesa Clásica', price: 12.50, quantity: 2 }, { id: 4, name: 'Refresco de Cola', price: 2.50, quantity: 2 }] },
  { id: '#1235', customerName: 'Ana Torres', date: '2024-07-28', status: 'Pendiente', total: 32.00, items: [{ id: 2, name: 'Pizza Pepperoni', price: 15.00, quantity: 1 }, { id: 3, name: 'Ensalada César', price: 9.75, quantity: 1 }, { id: 5, name: 'Agua Mineral', price: 1.50, quantity: 1 }] },
];

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

const Orders = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenOrderModal = (order = null) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setSelectedOrder(null);
    setOrderModalOpen(false);
  };

  const handleOpenDetailsModal = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedOrder(null);
    setDetailsModalOpen(false);
  };

  const handleSaveOrder = (order) => {
    const isNewOrder = !orders.find(o => o.id === order.id);
    if (isNewOrder) {
      setOrders([order, ...orders]);
    } else {
      setOrders(orders.map(o => o.id === order.id ? order : o));
    }
  };

  const handleDeleteOrder = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <StyledPaper>
      <Header>
        <Typography variant="h5">Gestión de Pedidos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenOrderModal()}
        >
          Añadir Pedido
        </Button>
      </Header>

      <TableContainer>
        <StyledTable aria-label="tabla de pedidos">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID Pedido</StyledTableCell>
              <StyledTableCell>Cliente</StyledTableCell>
              <StyledTableCell>Fecha</StyledTableCell>
              <StyledTableCell>Estado</StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="center">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell component="th" scope="row">
                  {order.id}
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Chip label={order.status} color={getStatusChipColor(order.status)} size="small" />
                </TableCell>
                <TableCell align="right">{`${order.total.toFixed(2)}`}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Ver Detalles">
                    <IconButton onClick={() => handleOpenDetailsModal(order)} color="primary">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar Pedido">
                    <IconButton onClick={() => handleOpenOrderModal(order)} color="secondary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar Pedido">
                    <IconButton onClick={() => handleDeleteOrder(order.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>

      <OrderModal 
        open={isOrderModalOpen} 
        onClose={handleCloseOrderModal} 
        onSave={handleSaveOrder} 
        order={selectedOrder} 
      />

      <OrderDetailsModal
        open={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        order={selectedOrder}
      />
    </StyledPaper>
  );
};

export default Orders;