import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const MesCandidatures = () => {
  const { user } = useContext(Context);
  const [candidatures, setCandidatures] = useState([]);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [urlCV, setUrlCV] = useState("");

  const naviguerVers = useNavigate();

  useEffect(() => {
    if (!user) {
      naviguerVers("/");
      return;
    }

    const fetchCandidatures = async () => {
      try {
        const endpoint = user.role === "Employeur"
          ? "http://localhost:4000/api/v1/application/employer/getall"
          : "http://localhost:4000/api/v1/application/jobseeker/getall";

        const response = await axios.get(endpoint, {
          withCredentials: true,
        });

        setCandidatures(response.data.applications);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchCandidatures();
  }, [user, naviguerVers]);

  const supprimerCandidature = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
        withCredentials: true,
      });

      toast.success(response.data.message);
      setCandidatures(candidatures.filter((candidature) => candidature._id !== id));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const ouvrirModal = (url) => {
    setUrlCV(url);
    setModalOuvert(true);
  };

  const fermerModal = () => {
    setModalOuvert(false);
  };
  const fetchCandidatures = async () => {
  try {
    const endpoint = user.role === "Employeur"
      ? "/api/v1/application/employer/getall"
      : "/api/v1/application/jobseeker/getall";

    const response = await axios.get(endpoint, {
      withCredentials: true,
    });
    setCandidatures(response.data.applications);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const handleEdit = (id) => {
  setIsEditing(id); // Set the ID of the application being edited
  // Set up the form with the application data for editing
  // This can be a form in a modal or inline in the list
};

const handleSave = async (id) => {
  try {
    const updatedData = {
      // ...data to update
    };
    const response = await axios.put(`/api/v1/application/update/${id}`, updatedData, {
      withCredentials: true,
    });
    toast.success("Modifications enregistrées !");
    setIsEditing(null); // Reset editing state
    // Update the local state with the updated application data
    setCandidatures(candidatures.map((app) => (app._id === id ? response.data.application : app)));
  } catch (error) {
    toast.error("Failed to save changes: " + error.response.data.message);
  }
};

const handleCancelEdit = () => {
  setIsEditing(null); // Reset editing state
};

  return (
    <section className="my_applications page">
      <div className="container">
        <h1>{user.role === "Employeur" ? "Candidatures des chercheurs d'emploi" : "Mes Candidatures"}</h1>
        {candidatures.length <= 0 ? (
          <h4>Aucune candidature trouvée</h4>
        ) : (
          candidatures.map((element) => (
            <CarteCandidat
              key={element._id}
              element={element}
              supprimerCandidature={supprimerCandidature}
              ouvrirModal={ouvrirModal}
              isEmployer={user.role === "Employeur"}
            />
          ))
        )}
      </div>
      {modalOuvert && (
        <ResumeModal urlCV={urlCV} onClose={fermerModal} />
      )}
    </section>
  );
};

export default MesCandidatures;

const CarteCandidat = ({
  element,
  supprimerCandidature,
  ouvrirModal,
  isEmployer,
  handleAccept,
  handleReject
}) => {
  return (
    <div className="job_seeker_card">
      <div className="details_column">
        <p><span>Poste :</span> {element.jobTitle}</p>
        <p><span>Nom :</span> {element.name}</p>
        <p><span>Email :</span> {element.email}</p>
        <p><span>Téléphone :</span> {element.phone}</p>
        <p><span>Adresse :</span> {element.address}</p>
        <p className="motivation"><span>Lettre de motivation :</span> {element.coverLetter}</p>
        <div className="button_wrapper">
          {isEmployer ? (
            <>
              <button onClick={() => handleAccept(element._id)} className="edit_btn">
                Accepter
              </button>
              <button onClick={() => handleReject(element._id)} className="delete_btn">
                Rejeter
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleEdit(element._id)} className="edit_btn">
                Modifier
              </button>
              <button onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
                  supprimerCandidature(element._id);
                }
              }} className="delete_btn">
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
      <div className="cv_column">
        <img
          src={element.resume.url}
          alt="cv"
          onClick={() => ouvrirModal(element.resume.url)}
        />
      </div>
    </div>
  );
};
