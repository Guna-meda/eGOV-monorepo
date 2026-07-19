import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import { Outlet, useLocation, useNavigate } from "react-router";

const drawerWidth = 320;

const navItems = [
  {
    label: "Map",
    path: "/employee/map",
    icon: <MapOutlinedIcon />,
  },
  {
    label: "Complaints",
    path: "/employee/complaints",
    icon: <AssignmentOutlinedIcon />,
  },
];

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#fff",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Toolbar
          sx={{
            px: 3,
            minHeight: 84,
          }}
        >
          <BusinessCenterOutlinedIcon
            color="primary"
            sx={{
              fontSize: 34,
              mr: 2,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            Employee Portal
          </Typography>
        </Toolbar>

        <Divider />

        <List
          sx={{
            px: 2,
            py: 2,
          }}
        >
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                px: 2.5,
                py: 2,
                mb: 1,

                "& .MuiListItemIcon-root": {
                  minWidth: 52,
                  color: "text.secondary",
                },

                "& .MuiSvgIcon-root": {
                  fontSize: 28,
                },

                "& .MuiListItemText-primary": {
                  fontSize: "1.1rem",
                  fontWeight: 500,
                },

                "&:hover": {
                  bgcolor: "primary.light",

                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },

                  "& .MuiListItemText-primary": {
                    color: "primary.main",
                  },
                },

                "&.Mui-selected": {
                  bgcolor: "primary.light",

                  "& .MuiListItemIcon-root": {
                    color: "primary.main",
                  },

                  "& .MuiListItemText-primary": {
                    color: "primary.main",
                    fontWeight: 700,
                  },

                  "&:hover": {
                    bgcolor: "primary.light",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            height: "100vh",
            bgcolor: "#f7f8fa",
            p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}