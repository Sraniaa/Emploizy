import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";


const PostJob = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState("");
    const [salaryFrom, setSalaryFrom] = useState("");
    const [salaryTo, setSalaryTo] = useState("");
    const [fixedSalary, setFixedSalary] = useState("");
    const [salaryType, setSalaryType] = useState("default");
    const [isOtherCategory, setIsOtherCategory] = useState(false);

    const { isAuthorized, user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthorized || user.role !== "Employeur") {
            navigate("/login"); // Adjust this route as needed
        }
    }, [isAuthorized, user, navigate]);

    const validateForm = () => {
      if (!title || title.length < 3 || title.length > 30) {
          return "Le titre doit contenir entre 3 et 30 caractères !";
      }
      if (!description || description.length < 30 || description.length > 500) {
          return "La description doit contenir entre 30 et 500 caractères !";
      }
      if (isOtherCategory) {
          if (!customCategory) {
              return "Veuillez fournir une catégorie personnalisée.";
          }
      } else {
          if (!category) {
              return "Veuillez fournir une catégorie.";
          }
      }
      if (!country) {
          return "Veuillez fournir un nom de pays.";
      }
      if (!city) {
          return "Veuillez fournir un nom de ville.";
      }
      if (!location || location.length < 20) {
          return "La localisation doit contenir au moins 20 caractères !";
      }
      return null;
  };
  

    const handleJobPost = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            return toast.error(validationError);
        }
        const jobCategory = isOtherCategory ? customCategory : category;
        try {
            const payload = {
                title,
                description,
                category: jobCategory,
                country,
                city,
                location,
                salaryFrom: salaryType === "Salaire à plage" ? salaryFrom : undefined,
                salaryTo: salaryType === "Salaire à plage" ? salaryTo : undefined,
                fixedSalary: salaryType === "Salaire fixe" ? fixedSalary : undefined,
            };

            const { data } = await axios.post("http://localhost:4000/api/v1/job/post", payload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            toast.success(data.message);
            resetForm();
        } catch (err) {
            toast.error(err.response?.data?.message || "Une erreur s'est produite lors de la publication de l'emploi.");
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategory("");
        setCustomCategory(""); // Reset custom category
        setIsOtherCategory(false); // Reset the 'other' category selection
        setCountry("");
        setCity("");
        setLocation("");
        setSalaryFrom("");
        setSalaryTo("");
        setFixedSalary("");
        setSalaryType("default");
    };

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
              <div className="input-group">
    <select
        value={isOtherCategory ? "autre" : category}
        onChange={(e) => {
            const value = e.target.value;
            if (value === "autre") {
                setIsOtherCategory(true);
                setCategory(''); // Clear the category when 'Autre' is selected
            } else {
                setIsOtherCategory(false);
                setCategory(value);
                setCustomCategory(''); // Clear the custom category when a predefined option is selected
            }
        }}
    >
        <option value="">Sélectionner une catégorie</option>
        <option value="Graphisme et Design">Graphisme et Design</option>
        <option value="Développement d'applications mobiles">Développement d'applications mobiles</option>
        <option value="Comptabilité et Finance">Comptabilité et Finance</option>
        <option value="Intelligence Artificielle">Intelligence Artificielle</option>
        <option value="Animation Vidéo">Animation Vidéo</option>
        <option value="autre">Autre</option>
    </select>
    </div>
    {isOtherCategory && (
        <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Entrez votre catégorie"
        />
    )}
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