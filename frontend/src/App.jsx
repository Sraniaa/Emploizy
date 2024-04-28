import { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import Profile from "./components/Admin/Profile";
import SupAdminRoute from "./routes/SupAdminRoute";
import AdminRoute from "./routes/AdminRoute";
import UserProfile from "./components/Auth/UserProfile";

import Layout from "./scenes/Layout";
import Dashboard from "./scenes/dashbord/index";
import Admin from "./scenes/admin/index";
import Utilisateurs from "./scenes/users/index";
import Emplois from "./scenes/jobs/index";
import { Navigate } from "react-router-dom";


const App = () => {
  const { user, isAuthorized, setIsAuthorized, setUser } = useContext(Context);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized, setIsAuthorized, setUser]);

  return (
    <>
      <BrowserRouter>



        <Navbar />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/emplois" element={<Emplois />} />
            <Route path="/profile" element={
              <AdminRoute>
                {isAuthorized ? <Profile user={user} /> : <Navigate to="/login" />}
              </AdminRoute>
            } />              <Route path="/admin" element={
              <SupAdminRoute>
                <Admin />
              </SupAdminRoute>
            } />


          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="myprofile" element={<UserProfile />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />

        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;