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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import { useCRUD } from '../../hooks/useCRUD';
import { useModal } from '../../hooks/useModal';
import { useSnackbar } from '../../hooks/useSnackbar';
import CategoryModal from './CategoryModal';

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

const Categories = () => {
  const { documents: categories, add, update, remove } = useCRUD('categories');
  const { isOpen, selectedItem: currentCategory, handleOpen, handleClose } = useModal();
  const { snackbar, showSnackbar, handleCloseSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    await remove(id);
    showSnackbar('Categoría eliminada correctamente', 'success');
  };

  const handleSave = async (categoryData) => {
    if (currentCategory) {
      await update(currentCategory.id, categoryData);
      showSnackbar('Categoría actualizada correctamente', 'success');
    } else {
      await add(categoryData);
      showSnackbar('Categoría creada correctamente', 'success');
    }
    handleClose();
  };

  return (
    <>
      <Header>
        <Typography variant="h5">Gestión de Categorías</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nueva Categoría
        </Button>
      </Header>

      <TableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nombre de Categoría</StyledTableCell>
              <StyledTableCell>Descripción</StyledTableCell>
              <StyledTableCell>Fecha Creación</StyledTableCell>
              <StyledTableCell>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.createdAt && category.createdAt.toDate ? category.createdAt.toDate().toISOString().split('T')[0] : category.createdAt}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(category)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(category.id)}>
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
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <CategoryModal
        open={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        category={currentCategory}
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
    </>
  );
};

export default Categories;