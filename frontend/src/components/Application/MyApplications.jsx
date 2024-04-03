import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MesCandidatures = () => {
  const { user } = useContext(Context);
  const [candidatures, setCandidatures] = useState([]);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [urlCV, setUrlCV] = useState("");

  const { isAuthorized } = useContext(Context);
  const naviguerVers = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employeur") {
        axios
          .get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setCandidatures(res.data.applications);
          });
      } else {
        axios
          .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setCandidatures(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    naviguerVers("/");
  }

  const supprimerCandidature = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setCandidatures((candidaturesPrecedentes) =>
            candidaturesPrecedentes.filter((candidature) => candidature._id !== id)
          );
        });
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

  return (
    <section className="mes_candidatures page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <h1>Mes Candidatures</h1>
          {candidatures.length <= 0 ? (
            <>
              {" "}
              <h4>Aucune candidature trouvée</h4>{" "}
            </>
          ) : (
            candidatures.map((element) => {
              return (
                <CarteCandidat
                  element={element}
                  key={element._id}
                  supprimerCandidature={supprimerCandidature}
                  ouvrirModal={ouvrirModal}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Candidatures des chercheurs d'emploi</h1>
          {candidatures.length <= 0 ? (
            <>
              <h4>Aucune candidature trouvée</h4>
            </>
          ) : (
            candidatures.map((element) => {
              return (
                <CarteEmployeur
                  element={element}
                  key={element._id}
                  ouvrirModal={ouvrirModal}
                />
              );
            })
          )}
        </div>
      )}
      {modalOuvert && (
        <ResumeModal urlCV={urlCV} onClose={fermerModal} />
      )}
    </section>
  );
};

export default MesCandidatures;

const CarteCandidat = ({ element, supprimerCandidature, ouvrirModal }) => {
  return (
    <>
      <div className="carte_candidat">
        <div className="detail">
          <p>
            <span>Nom :</span> {element.name}
          </p>
          <p>
            <span>Email :</span> {element.email}
          </p>
          <p>
            <span>Téléphone :</span> {element.phone}
          </p>
          <p>
            <span>Adresse :</span> {element.address}
          </p>
          <p>
            <span>Lettre de motivation :</span> {element.coverLetter}
          </p>
        </div>
        <div className="cv">
          <img
            src={element.resume.url}
            alt="cv"
            onClick={() => ouvrirModal(element.resume.url)}
          />
        </div>
        <div className="zone_bouton">
          <button onClick={() => supprimerCandidature(element._id)}>
            Supprimer la candidature
          </button>
        </div>
      </div>
    </>
  );
};

const CarteEmployeur = ({ element, ouvrirModal }) => {
  return (
    <>
      <div className="carte_candidat">
        <div className="detail">
          <p>
            <span>Nom :</span> {element.name}
          </p>
          <p>
            <span>Email :</span> {element.email}
          </p>
          <p>
            <span>Téléphone :</span> {element.phone}
          </p>
          <p>
            <span>Adresse :</span> {element.address}
          </p>
          <p>
            <span>Lettre de motivation :</span> {element.coverLetter}
          </p>
        </div>
        <div className="cv">
          <img
            src={element.resume.url}
            alt="cv"
            onClick={() => ouvrirModal(element.resume.url)}
          />
        </div>
      </div>
    </>
  );
};
