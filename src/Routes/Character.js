import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import Card from "../Components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import helpers from "../Components/helpers";

const Character = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [character, setCharacter] = useState(false);
  const [existingFavorites, setExistingFavorites] = useState([]);
  helpers.controlLoading(isLoading);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://marvel-backend-revine.herokuapp.com/character/${id}`
      );
      setCharacter(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!helpers.getSessionName(true)) {
      return false;
    }

    const fetchData = async () => {
      const response = await axios.get(
        `https://marvel-backend-revine.herokuapp.com/favorites/`,
        {
          headers: {
            Authorization: "Bearer " + helpers.getSessionName(true),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error) {
        return alert(
          "Une erreur s'est produite, veuillez réessayer plus tard."
        );
      } else {
        setExistingFavorites(response.data);
      }
    };

    fetchData();
    return true;
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <section className="character">
      <Link to="/" className="previous-link">
        <span className="icon previous-icon size20"></span>
        <div>Voir tous les personnages</div>
      </Link>
      <h1>{character.name}</h1>
      <div className="character-details">
        <div className="picture">
          <img
            src={character.thumbnail.path + "." + character.thumbnail.extension}
            alt={character.name}
            className="character-thumbnail"
          />
          <span
            className={`icon-save${
              helpers.isSaveInFavorite(
                character._id,
                "character",
                existingFavorites
              )
                ? " saved"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (!helpers.isSaveInFavorite(character._id, "character")) {
                helpers.saveToFavorite(
                  { ...character, category: "character" },
                  e.target
                );
              } else {
                helpers.removeFromFavorite(
                  character._id,
                  "character",
                  e.target
                );
              }
            }}
          >
            <FontAwesomeIcon icon="heart" />
          </span>
        </div>
        <p className="description">{character.description}</p>
      </div>

      <h2>Liste des comics associés</h2>
      <div className="cards flip-cards">
        {character.comics.map((comic) => {
          comic = {
            ...comic,
            noCardLink: true,
            displayBtnDesc: "Voir plus|Voir moins",
            flipCard: true,
            category: "comic",
            existingFavorites: existingFavorites,
          };
          return <Card key={comic._id} {...comic} />;
        })}
        {character.comics.length === 0 && <div>Aucun comic identifié</div>}
      </div>
    </section>
  );
};

export default Character;
