import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, []);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Détails du poste</h3>
        <div className="banner">
          <p>
            Titre : <span> {job.title}</span>
          </p>
          <p>
            Catégorie : <span>{job.category}</span>
          </p>
          <p>
            Pays : <span>{job.country}</span>
          </p>
          <p>
            Ville : <span>{job.city}</span>
          </p>
          <p>
            Emplacement : <span>{job.location}</span>
          </p>
          <p>
            Description : <span>{job.description}</span>
          </p>
          <p>
            Publié le : <span>{job.jobPostedOn}</span>
          </p>
          <p>
            Salaire :{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}
          </p>
          {user && user.role === "Employeur" ? (
            <></>
          ) : (
            <Link to={`/application/${job._id}`}>Postuler maintenant</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
