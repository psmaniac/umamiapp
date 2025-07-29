import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Breadcrumbs,
  Link,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { products as allProducts } from '../data/products';
import OrderDetailsModal from './orders/OrderDetailsModal';
import ConfirmOrderModal from './orders/ConfirmOrderModal'; // Se creará a continuación

// --- Estilos ---
const RootContainer = styled(Box)({
  display: 'flex',
  height: 'calc(100vh - 120px)', // Ajustar altura según el layout general
  padding: '16px',
});

const MenuContainer = styled(Paper)(({ theme }) => ({
  flex: 2,
  marginRight: theme.spacing(2),
  padding: theme.spacing(2),
  overflowY: 'auto',
}));

const OrderContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const OrderList = styled(List)({
  flexGrow: 1,
  overflowY: 'auto',
});

const OrderTotal = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  marginTop: 'auto',
}));

const ProductCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  },
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
});

const ManagementContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
}));

// --- Datos de ejemplo ---
const sampleOrders = [
  { id: '#1234', customerName: 'Carlos Santana', date: new Date(), status: 'Completado', total: 55.50, items: [{ id: 1, name: 'Hamburguesa Clásica', price: 12.50, quantity: 2 }, { id: 4, name: 'Refresco de Cola', price: 2.50, quantity: 2 }] },
  { id: '#1235', customerName: 'Ana Torres', date: new Date(), status: 'Pendiente', total: 32.00, items: [{ id: 2, name: 'Pizza Pepperoni', price: 15.00, quantity: 1 }, { id: 3, name: 'Ensalada César', price: 9.75, quantity: 1 }, { id: 5, name: 'Agua Mineral', price: 1.50, quantity: 1 }] },
];

const getStatusChipColor = (status) => {
  switch (status) {
    case 'Completado': return 'success';
    case 'Pendiente': return 'warning';
    case 'Cancelado': return 'error';
    default: return 'default';
  }
};

const Orders = () => {
  const [currentOrder, setCurrentOrder] = useState([]);
  const [managedOrders, setManagedOrders] = useState(sampleOrders);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

  const categories = useMemo(() => ['Todos', ...new Set(allProducts.map(p => p.category))], []);
  const filteredProducts = useMemo(() =>
    selectedCategory === 'Todos'
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory)
  , [selectedCategory]);

  const handleAddToOrder = (product) => {
    setCurrentOrder(prevOrder => {
      const existingItem = prevOrder.find(item => item.id === product.id);
      if (existingItem) {
        return prevOrder.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevOrder, { ...product, quantity: 1, image: product.image || `https://via.placeholder.com/150/92c952/FFFFFF?text=${product.name.replace(/\s/g, "+")}` }];
    });
  };

  const handleUpdateQuantity = (productId, amount) => {
    setCurrentOrder(prevOrder => {
      return prevOrder.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item
      ).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromOrder = (productId) => {
    setCurrentOrder(prevOrder => prevOrder.filter(item => item.id !== productId));
  };

  const orderTotal = useMemo(() =>
    currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0)
  , [currentOrder]);

  const handleOpenConfirmModal = () => {
    if (currentOrder.length > 0) {
      setConfirmModalOpen(true);
    }
  };

  const handleCloseConfirmModal = () => setConfirmModalOpen(false);

  const handleConfirmOrder = (orderDetails) => {
    const newOrder = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      ...orderDetails,
      date: new Date(),
      status: 'Pendiente',
      items: currentOrder,
      total: orderTotal,
    };
    setManagedOrders(prev => [newOrder, ...prev]);
    setCurrentOrder([]);
    handleCloseConfirmModal();
  };

  const handleViewDetails = (order) => {
    setSelectedOrderForDetails(order);
    setDetailsModalOpen(true);
  };
  
  const handleDeleteOrder = (id) => {
    setManagedOrders(orders => orders.filter(order => order.id !== id));
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " años";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " días";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return Math.floor(seconds) + " segundos";
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Crear Pedido</Typography>
        <RootContainer>
          {/* Columna Izquierda: Menú de Platos */}
          <MenuContainer>
            <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ mb: 2 }}>
              {categories.map(category => (
                <Link
                  component="button"
                  underline="hover"
                  key={category}
                  color={selectedCategory === category ? "text.primary" : "inherit"}
                  onClick={() => setSelectedCategory(category)}
                  sx={{ fontWeight: selectedCategory === category ? 'bold' : 'normal' }}
                >
                  {category}
                </Link>
              ))}
            </Breadcrumbs>
            <Grid container spacing={2}>
              {filteredProducts.map(product => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard onClick={() => handleAddToOrder(product)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.image || `https://via.placeholder.com/150/92c952/FFFFFF?text=${product.name.replace(/\s/g, "+")}`}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          </MenuContainer>

          {/* Columna Derecha: Orden del Cliente */}
          <OrderContainer>
            <Typography variant="h5" gutterBottom>Orden Actual</Typography>
            <OrderList>
              {currentOrder.length === 0 && (
                <ListItem>
                  <ListItemText primary="Seleccione productos del menú" />
                </ListItem>
              )}
              {currentOrder.map(item => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromOrder(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price.toFixed(2)}`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, -1)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </OrderList>
            <OrderTotal>
              <Typography variant="h5">
                Total: ${orderTotal.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleOpenConfirmModal}
                disabled={currentOrder.length === 0}
              >
                Aceptar Pedido
              </Button>
            </OrderTotal>
          </OrderContainer>
        </RootContainer>

        {/* Sección Inferior: Gestión de Pedidos */}
        <ManagementContainer>
            <Typography variant="h5" gutterBottom>Gestión de Pedidos</Typography>
            <TableContainer>
                <Table stickyHeader aria-label="tabla de pedidos gestionados">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Pedido</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Hace</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {managedOrders.map((order) => (
                            <TableRow key={order.id} hover>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.customerName || 'N/A'}</TableCell>
                                <TableCell>{formatTimeAgo(order.date)}</TableCell>
                                <TableCell>
                                    <Chip label={order.status} color={getStatusChipColor(order.status)} size="small" />
                                </TableCell>
                                <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Ver Detalles">
                                        <IconButton onClick={() => handleViewDetails(order)} color="primary">
                                            <ViewIcon />
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
                </Table>
            </TableContainer>
        </ManagementContainer>
      </Box>

      <ConfirmOrderModal
        open={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmOrder}
        total={orderTotal}
      />

      {selectedOrderForDetails && (
        <OrderDetailsModal
          open={isDetailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          order={selectedOrderForDetails}
        />
      )}
    </>
  );
};

export default Orders;
