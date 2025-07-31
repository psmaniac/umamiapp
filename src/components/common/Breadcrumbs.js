import React from 'react';
import { 
  Breadcrumbs as MuiBreadcrumbs, 
  Link, 
  Typography, 
  IconButton,
  styled,
  Box
} from '@mui/material';
import { 
  Home as HomeIcon, 
  ArrowBack as BackIcon,
  ChevronRight as ChevronIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const StyledBreadcrumbs = styled(MuiBreadcrumbs)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginLeft: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  '& .MuiBreadcrumbs-separator': {
    margin: theme.spacing(0, 0.5),
    color: theme.palette.text.secondary,
  },
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 400,
  fontSize: '0.8rem',
  '&:hover': {
    textDecoration: 'underline',
    color: theme.palette.primary.dark,
  },
}));

const BreadcrumbText = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.primary,
  fontWeight: 400,
  fontSize: '0.8rem',
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const BreadcrumbsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(0.5, 1),
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <BreadcrumbsContainer>
      <BackButton onClick={handleGoBack} size="small">
        <BackIcon fontSize="small" />
      </BackButton>
      
      <StyledBreadcrumbs separator={<ChevronIcon fontSize="small" />}>
        <BreadcrumbLink 
          color="inherit" 
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
          Home
        </BreadcrumbLink>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

          return isLast ? (
            <BreadcrumbText key={name}>
              {formattedName}
            </BreadcrumbText>
          ) : (
            <BreadcrumbLink 
              key={name} 
              color="inherit" 
              onClick={() => navigate(routeTo)}
              sx={{ cursor: 'pointer' }}
            >
              {formattedName}
            </BreadcrumbLink>
          );
        })}
      </StyledBreadcrumbs>
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs;