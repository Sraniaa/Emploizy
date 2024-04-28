import React from "react";
import FlexBetween from "../../components/Admin/FlexBetween";
import Header from "../../components/Admin/Header";
import { DownloadOutlined } from "@mui/icons-material";
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";


const Dashboard = () => {
    const theme = useTheme();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="DASHBOARD" subtitle="Bienvenue dans l'espace d'Administration" />

                <Box>
                    <Button
                        sx={{
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.background.alt,
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                    >
                        <DownloadOutlined sx={{ mr: "10px" }} />
                        Download Reports
                    </Button>
                </Box>
            </FlexBetween>
        </Box>
    );
};

export default Dashboard;
