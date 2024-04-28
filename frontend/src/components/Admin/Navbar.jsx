import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, SettingsOutlined } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { setMode } from "../../state";
import profileImage from "../../assets/profile.jpeg";
import PropTypes from 'prop-types';

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile"); // Make sure this path matches your route configuration
  };

  return (
    <AppBar sx={{ position: "static", background: "none", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          <Box onClick={handleProfileClick} sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Box
              component="img"
              alt="profile"
              src={profileImage}
              height="32px"
              width="32px"
              borderRadius="50%"
              sx={{ objectFit: "cover", marginRight: "10px" }} // Added marginRight for spacing
            />
            <Box textAlign="left">
              <Typography fontWeight="bold" fontSize="0.85rem" color={theme.palette.secondary[100]}>
                {user.name}
              </Typography>
              <Typography fontSize="0.75rem" color={theme.palette.secondary[200]}>
                {user.occupation}
              </Typography>
            </Box>
          </Box>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    occupation: PropTypes.string.isRequired,
  }).isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
};

export default Navbar;
