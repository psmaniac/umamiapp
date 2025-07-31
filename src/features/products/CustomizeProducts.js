import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  IconButton,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';

import { useCRUD } from '../../hooks/useCRUD';

const RootContainer = styled(Box)({
  display: 'flex',
  height: 'calc(100vh - 120px)',
  padding: '16px',
});

const ProductsListContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  marginRight: theme.spacing(2),
  padding: theme.spacing(2),
  overflowY: 'auto',
}));

const AttributesContainer = styled(Paper)(({ theme }) => ({
  flex: 2,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const CustomizeProducts = () => {
  const { documents: products, loading, error } = useCRUD('products');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]); // Select the first product by default
    }
  }, [products, selectedProduct]);

  if (loading) return <Typography>Cargando productos...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <RootContainer>
      {/* Columna Izquierda: Lista de Productos */}
      <ProductsListContainer>
        <Typography variant="h6" gutterBottom>Seleccionar Producto</Typography>
        <List>
          {products.map((product) => (
            <ListItem
              key={product.id}
              button
              selected={selectedProduct?.id === product.id}
              onClick={() => setSelectedProduct(product)}
            >
              <ListItemText primary={product.name} />
            </ListItem>
          ))}
        </List>
      </ProductsListContainer>

      {/* Columna Derecha: Atributos y Variantes */}
      <AttributesContainer>
        {selectedProduct ? (
          <>
            <Typography variant="h6" gutterBottom>Atributos y Variantes de {selectedProduct.name}</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Atributos:</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ width: '150px' }}
                >
                  Atributo
                </Button>
              </Box>
              {/* Aquí se renderizarán los atributos del producto */}
              <Typography variant="body2" color="text.secondary">No hay atributos definidos.</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="subtitle1">Variantes:</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ width: '150px' }}
                >
                  Variante
                </Button>
              </Box>
              {/* Aquí se renderizarán las variantes del producto */}
              <Typography variant="body2" color="text.secondary">No hay variantes definidas.</Typography>
            </Box>
          </>
        ) : (
          <Typography variant="h6">Seleccione un producto para gestionar sus atributos y variantes.</Typography>
        )}
      </AttributesContainer>
    </RootContainer>
  );
};

export default CustomizeProducts;