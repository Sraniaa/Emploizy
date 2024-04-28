import { useState } from "react";
import { Box, useMediaQuery, CssBaseline , ThemeProvider  } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/Admin/Navbar";
import Sidebar from "../../components/Admin/Sidebar";
import { useGetUserQuery } from "../../state/api";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { themeSettings } from "../../theme";
const Layout = () => {

    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const userId = useSelector((state) => state.global.userId);
    const { data } = useGetUserQuery(userId);
    const mode = useSelector((state) => state.global.mode);

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
   
    return (
        <ThemeProvider theme={theme}>

        <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
             <CssBaseline />
            <Sidebar
                user={data || {}}
                isNonMobile={isNonMobile}
                drawerWidth="250px"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <Box flexGrow={1}>
                <Navbar
                    user={data || {}}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <Outlet />
            </Box>
        </Box>
        </ThemeProvider>

    );
};

export default Layout;
