import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia as MuiCardMedia,
  CardContent,
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
  AddCircleOutline,
  RemoveCircleOutline,
  DeleteOutline as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getAllDocuments } from '../../firestore/firestoreService.js';
import OrderDetailsModal from './OrderDetailsModal.js';
import ConfirmOrderModal from './ConfirmOrderModal.js';

import { useLocalCRUD } from '../../hooks/useLocalCRUD';
import { useModal } from '../../hooks/useModal';

// --- Estilos ---
const RootContainer = styled(Box)({
  display: 'flex',
  height: 'calc(100vh - 120px)',
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
  height: '160px',
  width: '160px',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  },
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  overflow: 'hidden',
});

const ProductImage = styled(MuiCardMedia)({
  height: '100px',
  width: '100%',
  objectFit: 'cover',
});

const CompactCardContent = styled(CardContent)({
  padding: '8px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const ManagementContainer = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
}));

// --- Datos de ejemplo ---
const sampleOrders = [
  { 
    id: '#1234', 
    customerName: 'Carlos Santana', 
    date: new Date(), 
    status: 'Completado', 
    total: 55.50, 
    items: [
      { id: 1, name: 'Hamburguesa Clásica', price: 12.50, quantity: 2 }, 
      { id: 4, name: 'Refresco de Cola', price: 2.50, quantity: 2 }
    ] 
  },
  { 
    id: '#1235', 
    customerName: 'Ana Torres', 
    date: new Date(), 
    status: 'Pendiente', 
    total: 32.00, 
    items: [
      { id: 2, name: 'Pizza Pepperoni', price: 15.00, quantity: 1 }, 
      { id: 3, name: 'Ensalada César', price: 9.75, quantity: 1 }, 
      { id: 5, name: 'Agua Mineral', price: 1.50, quantity: 1 }
    ] 
  },
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
  // --- Estados ---
  const { documents: managedOrders, add: addOrder, remove: removeOrder } = useLocalCRUD(sampleOrders);
  const { isOpen: isConfirmModalOpen, handleOpen: handleOpenConfirmModal, handleClose: handleCloseConfirmModal } = useModal();
  const { isOpen: isDetailsModalOpen, selectedItem: selectedOrderForDetails, handleOpen: handleOpenDetailsModal, handleClose: handleCloseDetailsModal } = useModal();
  const [currentOrder, setCurrentOrder] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [tempQuantity, setTempQuantity] = useState('');
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await getAllDocuments('products');
      setAllProducts(productsData);
    };
    fetchProducts();
  }, []);

  // --- Datos y Memoizations ---
  const categories = useMemo(() => ['Todos', ...new Set(allProducts.map(p => p.category))], [allProducts]);
  const filteredProducts = useMemo(() => 
    selectedCategory === 'Todos' 
      ? allProducts 
      : allProducts.filter(p => p.category === selectedCategory), 
  [selectedCategory, allProducts]);

  // --- Funciones de manejo de orden ---
  const handleAddToOrder = (product) => {
    setCurrentOrder(prevOrder => {
      const existingItem = prevOrder.find(item => item.id === product.id);
      if (existingItem) {
        return prevOrder.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevOrder, { 
        ...product, 
        quantity: 1,
        image: product.image || `https://via.placeholder.com/150/92c952/FFFFFF?text=${product.name.replace(/\s/g, "+")}`
      }];
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
    if (selectedOrderItem?.id === productId) {
      setSelectedOrderItem(null);
      setTempQuantity('');
    }
  };

  // --- Funciones adicionales ---
  const orderTotal = useMemo(() => 
    currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0), 
  [currentOrder]);

  const handleConfirmOrder = (orderDetails) => {
    const newOrder = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      ...orderDetails,
      date: new Date(),
      status: 'Pendiente',
      items: currentOrder,
      total: orderTotal,
    };
    addOrder(newOrder);
    setCurrentOrder([]);
    setSelectedOrderItem(null);
    setTempQuantity('');
    handleCloseConfirmModal();
  };

  const handleDeleteOrder = (id) => {
    removeOrder(id);
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

  // --- Manejador de teclado físico ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedOrderItem) return;

      // Tecla Enter para aplicar la cantidad
      if (e.key === 'Enter') {
        const newQuantity = parseInt(tempQuantity, 10);
        if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity <= 99) {
          setCurrentOrder(prevOrder =>
            prevOrder
              .map(item =>
                item.id === selectedOrderItem.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
              .filter(item => item.quantity > 0)
          );
        }
        setSelectedOrderItem(null);
        setTempQuantity('');
        return;
      }

      // Tecla Escape para deseleccionar
      if (e.key === 'Escape') {
        setSelectedOrderItem(null);
        setTempQuantity('');
        return;
      }

      // Teclas numéricas (0-9)
      if (e.key >= '0' && e.key <= '9') {
        const newValue = tempQuantity + e.key;
        if (newValue.length <= 2 && parseInt(newValue, 10) <= 99) {
          setTempQuantity(newValue);
        }
      }
      // Tecla retroceso (Backspace)
      else if (e.key === 'Backspace') {
        setTempQuantity(prev => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedOrderItem, tempQuantity, setCurrentOrder]);

  return (
    <>
      <Box sx={{ p: 2 }}>
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
            <Grid container spacing={2} justifyContent="center">
              {filteredProducts.map(product => (
                <Grid item key={product.id}>
                  <ProductCard onClick={() => handleAddToOrder(product)}>
                    <ProductImage
                      component="img"
                      image={product.image || `https://via.placeholder.com/150/92c952/FFFFFF?text=${product.name.replace(/\s/g, "+")}`}
                      alt={product.name}
                    />
                    <CompactCardContent>
                      <Typography gutterBottom variant="subtitle2" component="div" sx={{ fontSize: '0.8rem' }}>
                        {product.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Bs {product.price.toFixed(2)}
                      </Typography>
                    </CompactCardContent>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          </MenuContainer>

          {/* Columna Derecha: Orden del Cliente */}
          <OrderContainer>
            <Typography variant="h5" gutterBottom>Orden Actual</Typography>
            
            
            
            <OrderList>
              {currentOrder.length === 0 ? (
                <ListItem>
                  <ListItemText primary="Seleccione productos del menú" />
                </ListItem>
              ) : (
                currentOrder.map(item => (
                  <ListItem
                    key={item.id}
                    onClick={() => {
                      setSelectedOrderItem(item);
                      setTempQuantity('');
                    }}
                    sx={{
                      backgroundColor: selectedOrderItem?.id === item.id
                        ? 'rgba(25, 118, 210, 0.12)'
                        : 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                      py: 0.5, // Padding vertical reducido
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromOrder(item.id);
                          if (selectedOrderItem?.id === item.id) {
                            setSelectedOrderItem(null);
                            setTempQuantity('');
                          }
                        }}
                        color="error" // Icono de eliminar en rojo
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    {/* Contenedor principal para alinear nombre, precio y controles */}
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Nombre y Precio en una fila */}
                      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', minWidth: 0, pr: 2 }}>
                        <Typography
                          variant="body1"
                          noWrap
                          title={item.name}
                          sx={{
                            flexGrow: 1,
                            mr: 1,
                            color: (theme) => theme.palette.text.primary,
                            fontFamily: (theme) => theme.typography.fontFamily,
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'bold',
                            color: (theme) => theme.palette.text.secondary,
                            fontFamily: (theme) => theme.typography.fontFamily,
                          }}
                        >
                          Bs {item.price.toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Controles de Cantidad */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateQuantity(item.id, -1);
                          }}
                        >
                          <RemoveCircleOutline fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            mx: 1,
                            fontWeight: 'bold',
                            border: selectedOrderItem?.id === item.id ? '1px solid #1976d2' : 'none',
                            padding: '2px 5px',
                            borderRadius: '4px',
                            minWidth: '2ch',
                            textAlign: 'center',
                            color: (theme) => theme.palette.text.primary,
                            fontFamily: (theme) => theme.typography.fontFamily,
                          }}
                        >
                          {selectedOrderItem?.id === item.id && tempQuantity !== ''
                            ? tempQuantity
                            : item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateQuantity(item.id, 1);
                          }}
                        >
                          <AddCircleOutline fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                ))
              )}
            </OrderList>
            <OrderTotal>
              <Typography variant="h5">
                Total: Bs {orderTotal.toFixed(2)}
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
                                <TableCell align="right">Bs {order.total.toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Ver Detalles">
                                        <IconButton onClick={() => handleOpenDetailsModal(order)} color="primary">
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
          onClose={handleCloseDetailsModal}
          order={selectedOrderForDetails}
        />
      )}
    </>
  );
};

export default Orders;