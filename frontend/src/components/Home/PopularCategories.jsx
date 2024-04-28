import React from "react";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";

const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Graphisme & Design",
      subTitle: "305 postes ouverts",
      icon: <MdOutlineDesignServices />,
    },
    {
      id: 2,
      title: "Développement d'Applications Mobiles",
      subTitle: "500 postes ouverts",
      icon: <TbAppsFilled />,
    },
    {
      id: 3,
      title: "Développement Web Frontend",
      subTitle: "200 postes ouverts",
      icon: <MdOutlineWebhook />,
    },
    {
      id: 4,
      title: "Développement MERN STACK",
      subTitle: "1000+ postes ouverts",
      icon: <FaReact />,
    },
    {
      id: 5,
      title: "Comptabilité & Finance",
      subTitle: "150 postes ouverts",
      icon: <MdAccountBalance />,
    },
    {
      id: 6,
      title: "Intelligence Artificielle",
      subTitle: "867 postes ouverts",
      icon: <GiArtificialIntelligence />,
    },
    {
      id: 7,
      title: "Animation Vidéo",
      subTitle: "50 postes ouverts",
      icon: <MdOutlineAnimation />,
    },
    {
      id: 8,
      title: "Développement de Jeux",
      subTitle: "80 postes ouverts",
      icon: <IoGameController />,
    },
  ];
  return (
    <div className="categories">
      <h3>CATÉGORIES POPULAIRES</h3>
      <div className="banner">
        {categories.map((element) => {
          return (
            <div className="card" key={element.id}>
              <div className="icon">{element.icon}</div>
              <div className="text">
                <p>{element.title}</p>
                <p>{element.subTitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;
