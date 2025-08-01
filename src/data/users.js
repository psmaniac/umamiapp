// Datos iniciales de usuarios
const initialUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123', // En una aplicación real, esto debería estar encriptado
    name: 'Administrador',
    email: 'admin@umamiapp.com',
    role: 'admin',
    status: 'active',
    restaurantRole: 'Gerente',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    username: 'gerente1',
    password: 'gerente123',
    name: 'Carlos Mendoza',
    email: 'gerente@umamiapp.com',
    role: 'manager',
    status: 'active',
    restaurantRole: 'Gerente',
    createdAt: '2023-02-20',
  },
  {
    id: 3,
    username: 'cajero1',
    password: 'cajero123',
    name: 'Laura Ramírez',
    email: 'cajero@umamiapp.com',
    role: 'cashier',
    status: 'active',
    restaurantRole: 'Cajero',
    createdAt: '2023-03-10',
  },
  {
    id: 4,
    username: 'mesero1',
    password: 'mesero123',
    name: 'Pedro Gómez',
    email: 'mesero@umamiapp.com',
    role: 'waiter',
    status: 'active',
    restaurantRole: 'Mesero',
    createdAt: '2023-04-05',
  },
  {
    id: 5,
    username: 'cocinero1',
    password: 'cocinero123',
    name: 'Ana Torres',
    email: 'chef@umamiapp.com',
    role: 'chef',
    status: 'active',
    restaurantRole: 'Cocinero',
    createdAt: '2023-05-12',
  },
];

export default initialUsers;