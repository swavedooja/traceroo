import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Avatar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import MaterialList from './components/MaterialList';
import MaterialForm from './components/MaterialForm';
import MaterialCreate from './components/MaterialCreate';
import PackagingHierarchyEditor from './components/PackagingHierarchyEditor';
import Maintenance from './components/Maintenance';
import Footer from './components/Footer';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Inventory2Icon from '@mui/icons-material/Inventory2';

function NavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen(v => !v);
  return (
    <AppBar color="primary" position="sticky">
      <Toolbar sx={{ display: 'grid', gridTemplateColumns: '48px 1fr 48px', alignItems: 'center' }}>
        <IconButton color="inherit" onClick={toggle} aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {/* TCS logo placeholder */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ width: 28, height: 28, bgcolor: 'white', color: 'primary.main', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, mr: 1 }}>
              tcs
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
              Integrated Logistic Management System
            </Typography>
          </Box>
        </Box>

        <Avatar alt="User" sx={{ bgcolor: 'secondary.main', justifySelf: 'end' }}>IL</Avatar>
      </Toolbar>

      <Drawer anchor="left" open={open} onClose={toggle}>
        <Box sx={{ width: 260 }} role="presentation" onClick={toggle}>
          <List>
            <ListItemButton onClick={() => navigate('/materials/new')}>
              <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
              <ListItemText primary="New Material" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/packaging')}>
              <ListItemIcon><Inventory2Icon /></ListItemIcon>
              <ListItemText primary="Packaging Hierarchy" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Mini icon rail when drawer is closed (icons only) */}
      {!open && (
        <Box sx={{
          position: 'fixed',
          top: '64px',
          left: 5,
          width: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          py: 0.5,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.appBar - 1,
          borderRadius: 0,
        }}>
          <IconButton size="small" color="inherit" onClick={() => navigate('/materials/new')} aria-label="New Material" sx={{ width: 32, height: 32 }}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton size="small" color="inherit" onClick={() => navigate('/packaging')} aria-label="Packaging Hierarchy" sx={{ width: 32, height: 32 }}>
            <Inventory2Icon />
          </IconButton>
        </Box>
      )}
    </AppBar>
  );
}

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GlobalStyles styles={{
        '.css-zylse7-MuiButtonBase-root-MuiIconButton-root': {
          position: 'relative',
          left: '-25px',
        },
        '.css-a86c11': {
          position: 'fixed',
          top: '55px',
          left: '-4px',
          width: '52px',
        },
      }} />
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 6, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Maintenance />} />
          <Route path="/materials/new" element={<MaterialCreate />} />
          <Route path="/materials/:code" element={<MaterialForm />} />
          <Route path="/materials" element={<MaterialList />} />
          <Route path="/packaging" element={<PackagingHierarchyEditor />} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
}
