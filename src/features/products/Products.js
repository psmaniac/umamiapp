import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  styled,
  Snackbar,
  Alert,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LunchDining as LunchDiningIcon, // Import LunchDiningIcon
  Category as CategoryIcon,
  Settings as SettingsIcon,
  Flatware as FlatwareIcon, // Import FlatwareIcon
} from '@mui/icons-material';
import { Link, Routes, Route, useLocation } from 'react-router-dom';

import { useCRUD } from '../../hooks/useCRUD';
import { useModal } from '../../hooks/useModal';
import { useSnackbar } from '../../hooks/useSnackbar';
import ProductModal from './ProductModal';

// Import the new Categories component
import Categories from './Categories';
// Import the new CustomizeProducts component
import CustomizeProducts from './CustomizeProducts';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  minHeight: '48px !important',
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      backgroundColor: 'transparent',
      border: 'none',
      position: 'relative',
      boxShadow: 'none',
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': {
      ...closedMixin(theme),
      backgroundColor: 'transparent',
      border: 'none',
      position: 'relative',
      boxShadow: 'none',
    },
  }),
}));

const StyledMenuItem = styled(ListItem)(({ theme, selected, isDrawerOpen }) => ({
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  border: selected ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.action.hover,
    border: `1px solid ${theme.palette.primary.light}`,
  },
  ...(!isDrawerOpen && {
    minHeight: 48,
    justifyContent: 'initial',
    px: 2.5,
    '& .MuiListItemIcon-root': {
      marginRight: 'auto',
      justifyContent: 'center',
    },
    '& .MuiListItemText-root': {
      display: 'none',
    },
  }),
}));

const MenuIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  border: `1px solid ${theme.palette.primary.main}`,
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.dark,
    fontSize: 24,
  },
}));

const menuItems = [
  { id: 1, name: 'Platos', icon: <LunchDiningIcon />, path: '/products' }, // Changed icon to LunchDiningIcon
  { id: 2, name: 'Categorías', icon: <CategoryIcon />, path: '/products/categories' },
  { id: 3, name: 'Personalizar', icon: <FlatwareIcon />, path: '/products/customize' },
  { id: 4, name: 'Ajustes', icon: <SettingsIcon />, path: '/products/settings' },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
  flexGrow: 1,
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

const Products = () => {
  const theme = useTheme();
  const location = useLocation();
  const { documents: products, add, update, remove } = useCRUD('products');
  const { isOpen, selectedItem: currentProduct, handleOpen, handleClose } = useModal();
  const { snackbar, showSnackbar, handleCloseSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    await remove(id);
    showSnackbar('Producto eliminado correctamente', 'success');
  };

  const handleSave = async (productData) => {
    if (currentProduct) {
      await update(currentProduct.id, productData);
      showSnackbar('Producto actualizado correctamente', 'success');
    } else {
      await add(productData);
      showSnackbar('Producto creado correctamente', 'success');
    }
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <StyledPaper>
        <Routes>
          <Route path="/" element={(
            <>
              <Header>
                <Typography variant="h5">Gestión de Productos</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpen()}
                >
                  Nuevo Producto
                </Button>
              </Header>

              <TableContainer>
                <StyledTable>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>ID</StyledTableCell>
                      <StyledTableCell>Nombre</StyledTableCell>
                      <StyledTableCell>Categoría</StyledTableCell>
                      <StyledTableCell>Precio</StyledTableCell>
                      <StyledTableCell>Fecha Creación</StyledTableCell>
                      <StyledTableCell>Acciones</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.categories ? product.categories.join(', ') : 'N/A'}</TableCell>
                          <TableCell>Bs {product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.createdAt && product.createdAt.toDate ? product.createdAt.toDate().toISOString().split('T')[0] : product.createdAt}</TableCell>
                          <TableCell>
                            <IconButton color="primary" onClick={() => handleOpen(product)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(product.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </StyledTable>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/customize" element={<CustomizeProducts />} />
        </Routes>

        <ProductModal
          open={isOpen}
          onClose={handleClose}
          onSave={handleSave}
          product={currentProduct}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </StyledPaper>
      <Drawer variant="permanent" open={openDrawer} anchor="right">
        <DrawerHeader>
          <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
            {openDrawer ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          {menuItems.map((item) => (
            <StyledMenuItem 
              button 
              component={Link} 
              to={item.path} 
              key={item.id} 
              isDrawerOpen={openDrawer}
              selected={location.pathname === item.path}
            >
              <MenuIconContainer>
                {React.cloneElement(item.icon, { sx: { fontSize: 24, color: theme.palette.primary.dark } })}
              </MenuIconContainer>
              <ListItemText primary={item.name} sx={{ opacity: openDrawer ? 1 : 0, transition: 'opacity 0.3s ease', color: theme.palette.text.primary }} />
            </StyledMenuItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Products;