import  { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { user, isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      localStorage.setItem('token', data.token);
      setEmail("");
      setPassword("");
      setIsAuthorized(true); // Mettez à jour l'autorisation ici
      if (data.user.role === "Admin") {
        setRole("Admin"); // Assurez-vous que setRole est défini dans votre composant
      } else if (data.user.role === "SuperAdmin") {
        setRole("SuperAdmin"); // Assurez-vous que setRole est défini dans votre composant
      }
      console.log(`Logged in as a ${data.user.role}`); // Log the user's role

    } catch (error) {
      toast.error(error.response.data.message);
    }
  };


  if (isAuthorized) {
    if (role === "Admin" || role === "SuperAdmin") {
      return <Navigate to={"/dashboard"} />;
    } else {
      return <Navigate to={'/'} />;
    }
  }



  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src="/JobZeelogo.png" alt="logo" />
            <h3>Connectez-vous à votre compte</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Connexion en tant que</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Sélectionnez le rôle</option>
                  <option value="Employeur">Employeur</option>
                  <option value="Chercheur d&apos;emploi">Chercheur d&apos;emploi</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>

                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Adresse e-mail</label>
              <div>
                <input
                  type="email"
                  placeholder="exemple@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Mot de passe</label>
              <div>
                <input
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" onClick={handleLogin}>
              Connexion
            </button>
            <Link to={"/register"}>S&apos;inscrire maintenant</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/login.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Login;
