import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");

  const { isAuthorized, user } = useContext(Context);

  const handleJobPost = async (e) => {
    e.preventDefault();
    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryFrom("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }
    await axios
      .post(
        "http://localhost:4000/api/v1/job/post",
        fixedSalary.length >= 4
          ? {
            title,
            description,
            category,
            country,
            city,
            location,
            fixedSalary,
          }
          : {
            title,
            description,
            category,
            country,
            city,
            location,
            salaryFrom,
            salaryTo,
          },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();
  if (!isAuthorized || (user && user.role !== "Employeur")) {
    navigateTo("/");
  }

  return (
    <>
      <div className="job_post page">
        <div className="container">
          <h3>POSTER UNE NOUVELLE OFFRE D'EMPLOI</h3>
          <form onSubmit={handleJobPost}>
            <div className="wrapper">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'emploi"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Graphisme et Design">Graphisme et Design</option>
                <option value="Développement d'applications mobiles">
                  Développement d'applications mobiles
                </option>
                <option value="Développement Web Frontend">
                  Développement Web Frontend
                </option>
                <option value="Développement MERN Stack">
                  Développement MERN Stack
                </option>
                <option value="Comptabilité et Finance">Comptabilité et Finance</option>
                <option value="Intelligence Artificielle">
                  Intelligence Artificielle
                </option>
                <option value="Animation Vidéo">Animation Vidéo</option>
                <option value="Développement MEAN Stack">
                  Développement MEAN Stack
                </option>
                <option value="Développement MEVN Stack">
                  Développement MEVN Stack
                </option>
                <option value="Opérateur de saisie de données">Opérateur de saisie de données</option>
              </select>
            </div>
            <div className="wrapper">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Pays"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ville"
              />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lieu"
            />
            <div className="salary_wrapper">
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
              >
                <option value="default">Sélectionner le type de salaire</option>
                <option value="Salaire fixe">Salaire fixe</option>
                <option value="Salaire à plage">Salaire à plage</option>
              </select>
              <div>
                {salaryType === "default" ? (
                  <p>Veuillez fournir le type de salaire *</p>
                ) : salaryType === "Salaire fixe" ? (
                  <input
                    type="number"
                    placeholder="Salaire fixe"
                    value={fixedSalary}
                    onChange={(e) => setFixedSalary(e.target.value)}
                  />
                ) : (
                  <div className="ranged_salary">
                    <input
                      type="number"
                      placeholder="Salaire de"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Salaire à"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <textarea
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'emploi"
            />
            <button type="submit">Créer un emploi</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJob;
