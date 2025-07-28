import React, { useState, useEffect } from 'react';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  styled,
  Snackbar,
  Alert,
  InputAdornment,
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  VpnKey as PasswordIcon,
  Badge as NameIcon,
  Work as RoleIcon,
  AssignmentInd as SystemRoleIcon,
  ToggleOn as StatusIcon,
} from '@mui/icons-material';
import initialUsers from '../data/users'; 

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

const StatusActive = styled('span')(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
}));

const StatusInactive = styled('span')(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.dark,
}));

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cargar usuarios desde localStorage o datos iniciales
  useEffect(() => {
    const storedUsers = localStorage.getItem('umamiUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('umamiUsers', JSON.stringify(initialUsers));
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (user = null) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
    setShowPassword(false);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('umamiUsers', JSON.stringify(updatedUsers));
    setSnackbar({ open: true, message: 'Usuario eliminado correctamente', severity: 'success' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userData = {
      id: currentUser ? currentUser.id : Date.now(),
      username: formData.get('username'),
      password: formData.get('password'),
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      restaurantRole: formData.get('restaurantRole'),
      status: formData.get('status'),
      createdAt: currentUser ? currentUser.createdAt : new Date().toISOString().split('T')[0],
    };

    let updatedUsers;
    if (currentUser) {
      updatedUsers = users.map(user => user.id === currentUser.id ? userData : user);
    } else {
      updatedUsers = [...users, userData];
    }

    setUsers(updatedUsers);
    localStorage.setItem('umamiUsers', JSON.stringify(updatedUsers));
    handleClose();
    setSnackbar({ 
      open: true, 
      message: `Usuario ${currentUser ? 'actualizado' : 'creado'} correctamente`, 
      severity: 'success' 
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledPaper>
      <Header>
        <Typography variant="h5">Gestión de Usuarios</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Nuevo Usuario
        </Button>
      </Header>

      <TableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nombre</StyledTableCell>
              <StyledTableCell>Usuario</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Rol Sistema</StyledTableCell>
              <StyledTableCell>Rol Restaurante</StyledTableCell>
              <StyledTableCell>Estado</StyledTableCell>
              <StyledTableCell>Fecha Creación</StyledTableCell>
              <StyledTableCell>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === 'admin' && 'Administrador'}
                    {user.role === 'manager' && 'Gerente'}
                    {user.role === 'cashier' && 'Cajero'}
                    {user.role === 'waiter' && 'Mesero'}
                    {user.role === 'chef' && 'Cocinero'}
                  </TableCell>
                  <TableCell>{user.restaurantRole}</TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <StatusActive>Activo</StatusActive>
                    ) : (
                      <StatusInactive>Inactivo</StatusInactive>
                    )}
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
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
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal de creación/edición */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center'
        }}>
          {currentUser ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
          {currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'inherit',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box component="form" onSubmit={handleSubmit} id="user-form">
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre Completo"
              name="name"
              autoFocus
              defaultValue={currentUser?.name || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NameIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              defaultValue={currentUser?.username || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              defaultValue={currentUser?.email || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required={!currentUser}
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              defaultValue={currentUser?.password || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Rol en el Sistema</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                label="Rol en el Sistema"
                defaultValue={currentUser?.role || ''}
                required
                startAdornment={
                  <InputAdornment position="start">
                    <SystemRoleIcon color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="manager">Gerente</MenuItem>
                <MenuItem value="cashier">Cajero</MenuItem>
                <MenuItem value="waiter">Mesero</MenuItem>
                <MenuItem value="chef">Cocinero</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="restaurant-role-label">Rol en el Restaurante</InputLabel>
              <Select
                labelId="restaurant-role-label"
                id="restaurantRole"
                name="restaurantRole"
                label="Rol en el Restaurante"
                defaultValue={currentUser?.restaurantRole || ''}
                required
                startAdornment={
                  <InputAdornment position="start">
                    <RoleIcon color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="Gerente">Gerente</MenuItem>
                <MenuItem value="Subgerente">Subgerente</MenuItem>
                <MenuItem value="Cajero">Cajero</MenuItem>
                <MenuItem value="Mesero">Mesero</MenuItem>
                <MenuItem value="Cocinero">Cocinero</MenuItem>
                <MenuItem value="Ayudante de Cocina">Ayudante de Cocina</MenuItem>
                <MenuItem value="Host/Hostess">Host/Hostess</MenuItem>
                <MenuItem value="Bartender">Bartender</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                label="Estado"
                defaultValue={currentUser?.status || 'active'}
                required
                startAdornment={
                  <InputAdornment position="start">
                    <StatusIcon color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleClose} 
            variant="outlined" 
            color="secondary"
            startIcon={<CloseIcon />}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="user-form" 
            variant="contained" 
            color="primary"
            startIcon={currentUser ? <EditIcon /> : <AddIcon />}
            sx={{ ml: 1 }}
          >
            {currentUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

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
  );
};

export default Users;