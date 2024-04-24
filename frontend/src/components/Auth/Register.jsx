import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

// Register component definition
const Register = () => {
  // State variables to store form inputs
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setRole('');
            // Navigate to login page after successful registration
            navigate('/login');
    } catch (error) {
      // Here's where the provided error handling code goes
      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;
        let errorMessage = message;
  
        // Check if there are individual errors and join them with new lines
        if (errors && Array.isArray(errors) && errors.length > 0) {
          errorMessage = errors.join('\n');
        }
  
        // Display the error message
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };
  


  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src="/JobZeelogo.png" alt="logo" />
            <h3>Créez un nouveau compte</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>S'enregistrer en tant que</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Sélectionnez le rôle</option>
                  <option value="Employeur">Employeur</option>
                  <option value="Chercheur d'emploi">Chercheur d'emploi</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Nom</label>
              <div>
                <input
                  type="text"
                  placeholder="Exemple"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <FaPencilAlt />
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
              <label>Numéro de téléphone</label>
              <div>
                <input
                  type="number"
                  placeholder="12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <FaPhoneFlip />
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
            <button type="submit" onClick={handleRegister}>
              S'inscrire
            </button>
            <Link to={"/login"}>Connectez-vous maintenant</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/register.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Register;
