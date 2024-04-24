import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
    } else {
      try {
        axios
          .get("http://localhost:4000/api/v1/job/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setJobs(res.data.jobs || []); // Ensure data is always an array.
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [isAuthorized, navigateTo]); // Including dependencies to ensure proper effect behavior.

  // Filter jobs based on the search term in the input field
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="jobs page">
      <div className="container">
        <h1>TOUS LES EMPLOIS DISPONIBLES</h1>
        <input
          type="text"
          placeholder="Search jobs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="banner">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((element) => (
              <div className="card" key={element._id}>
                <p>{element.title}</p>
                <p>{element.category}</p>
                <p>{element.country}</p>
                <Link to={`/job/${element._id}`}>Détails de l'emploi</Link>
              </div>
            ))
          ) : (
            <p>No jobs found that match the search criteria.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
