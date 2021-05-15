import Card from "../Components/Card";
import helpers from "../Components/helpers";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Favorites = ({ tokenuser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  helpers.controlLoading(isLoading);
  let dataUpdated = false;

  useEffect(() => {
    if (localStorage.length > 0) {
      const storedFavorites = helpers.isSaveInFavorite();
      storedFavorites.map((item) => helpers.saveToFavorite(item));
    }
    helpers.removeFromFavorite("all");
    dataUpdated = true;
    return true;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://marvel-backend-revine.herokuapp.com/favorites/`,
        {
          headers: {
            Authorization: "Bearer " + tokenuser,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error) {
        return alert(
          "Une erreur s'est produite, veuillez réessayer plus tard."
        );
      } else {
        setData(response.data);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tokenuser, dataUpdated]);

  const translateCategory = (category) => {
    return category === "comic" ? "Comic" : "Personnage";
  };

  const categories = data.reduce(function (obj, item) {
    obj[item.category] = obj[item.category] || [];
    obj[item.category].push(item);
    return obj;
  }, {});

  return (
    <section>
      <h1>Mes favoris</h1>
      {data.length > 0 ? (
        <div className="favorites">
          {Object.keys(categories).map((category, index) => {
            return (
              <div className="category" key={index}>
                <h2>{translateCategory(category)}</h2>
                <div className="cards">
                  {categories[category].map((card, i) => {
                    card = { ...card.item, existingFavorites: data };
                    return <Card key={i} {...card} />;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="notfound">
          Aucun favori a été enregistré pour le moment,{" "}
          <Link to="/">je commence dès maintenant</Link>
        </div>
      )}
    </section>
  );
};

export default Favorites;
