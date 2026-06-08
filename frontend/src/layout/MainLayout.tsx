import {Outlet, Link, useLocation} from "react-router"
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function MainLayout() {
  const location = useLocation();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Smart Grievance Mapping
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        <Outlet />
      </Box>

      <BottomNavigation
        showLabels
        value={location.pathname}
      >
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<HomeIcon />}
          component={Link}
          to="/"
        />

        <BottomNavigationAction
          label="Map"
          value="/map"
          icon={<MapIcon />}
          component={Link}
          to="/map"
        />

        <BottomNavigationAction
          label="Raise"
          value="/raise"
          icon={<AddCircleIcon />}
          component={Link}
          to="/raise"
        />

        <BottomNavigationAction
          label="Updates"
          value="/updates"
          icon={<NotificationsNoneIcon />}
          component={Link}
          to="/updates"
        />

        <BottomNavigationAction
          label="Me"
          value="/profile"
          icon={<AccountCircleIcon />}
          component={Link}
          to="/profile"
        />
      </BottomNavigation>
    </Box>
  );
}
