import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  const isAdminOrSuperAdmin = user && (user.role === "Admin" || user.role === "SuperAdmin");

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      <div className="container">
        <div className="logo">
          <img src="/JobZee-logos__white.png" alt="logo" />
        </div>
        {isAdminOrSuperAdmin ? (
          // For Admin/SuperAdmin, show minimal options
          <></>
        ) : (
          // For other users, show full menu
          <ul className={!show ? "menu" : "show-menu menu"}>
            <li>
              <Link to={"/"} onClick={() => setShow(false)}>
                ACCUEIL
              </Link>
            </li>
           
            <li>
              <Link to={"/myprofile"} onClick={() => setShow(false)}>
                MON PROFIL
              </Link>
            </li>
            <li>
              <Link to={"/job/getall"} onClick={() => setShow(false)}>
                TOUS LES EMPLOIS
              </Link>
            </li>
            <li>
              <Link to={"/applications/me"} onClick={() => setShow(false)}>
                {user && user.role === "Employeur"
                  ? "CANDIDATURES DES CANDIDATS"
                  : "MES CANDIDATURES"}
              </Link>
            </li>
            {user && user.role === "Employeur" && (
              <>
                <li>
                  <Link to={"/job/post"} onClick={() => setShow(false)}>
                    PUBLIER UNE NOUVELLE OFFRE
                  </Link>
                </li>
                <li>
                  <Link to={"/job/me"} onClick={() => setShow(false)}>
                    VOIR VOS OFFRES
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
        {/* Ensure the logout button is visible and styled */}
        <div className="logout-button">
          <button onClick={handleLogout}>SE DÉCONNECTER</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
