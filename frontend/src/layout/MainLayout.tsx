import { Outlet, Link, useLocation } from "react-router";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0F6E56",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#D85A30",
    },
    background: {
      default: "#F5F4F0",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "none", borderBottom: "1px solid #e0e0e0" },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: { borderTop: "1px solid #e0e0e0" },
      },
    },
  },
});

export default function MainLayout() {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
              Smart Grievance Mapping
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 2, maxWidth: 600, width: "100%", mx: "auto" }}>
          <Outlet />
        </Box>

        <BottomNavigation
          showLabels
          value={location.pathname}
          sx={{ position: "sticky", bottom: 0, zIndex: "appBar" }}
        >
          <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} component={Link} to="/" />
          <BottomNavigationAction label="Map" value="/map" icon={<MapIcon />} component={Link} to="/map" />
          <BottomNavigationAction label="Raise" value="/raise" icon={<AddCircleIcon />} component={Link} to="/raise" />
          <BottomNavigationAction label="Updates" value="/updates" icon={<NotificationsNoneIcon />} component={Link} to="/updates" />
          <BottomNavigationAction label="Me" value="/profile" icon={<AccountCircleIcon />} component={Link} to="/profile" />
        </BottomNavigation>

      </Box>
    </ThemeProvider>
  );
}