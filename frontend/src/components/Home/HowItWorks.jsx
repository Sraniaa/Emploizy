import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  return (
    <>
      <div className="howitworks">
        <div className="container">
          <h3>Comment fonctionne JobZee</h3>
          <div className="banner">
            <div className="card">
              <FaUserPlus />
              <p>Créer un compte</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequuntur, culpa.
              </p>
            </div>
            <div className="card">
              <MdFindInPage />
              <p>Rechercher un emploi/Poster une offre d'emploi</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequuntur, culpa.
              </p>
            </div>
            <div className="card">
              <IoMdSend />
              <p>Postuler à un emploi/Recruter des candidats adaptés</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequuntur, culpa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
