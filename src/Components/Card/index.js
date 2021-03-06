import { Link, useLocation } from "react-router-dom";
import { useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Card.css";
import helpers from "../helpers";
import { Modal } from "../../App";

const Card = (props) => {
  const location = useLocation();
  const selectedCard = useRef();
  const modal = useContext(Modal);
  const title = props.name ? props.name : props.title ? props.title : "";

  const toggleBtnContent = (name, i) => {
    return name.split("|")[i];
  };

  const content = (
    <>
      <div className="card-content" ref={selectedCard}>
        <div className="picture">
          <img
            src={
              props.thumbnail.path.replace(/^http/, "https") +
              "." +
              props.thumbnail.extension
            }
            alt={title}
          />
        </div>
        <div
          className={`infos${
            props.displayBtnDesc && props.description ? " grid" : ""
          }${props.description !== "" ? " trunc" : ""}`}
        >
          <div className={`title${props.description ? " truncate" : ""}`}>
            {title}
          </div>
          {props.description && (
            <div className="description">{props.description}</div>
          )}
          {props.displayBtnDesc && props.description && (
            <div
              className="btn"
              onClick={(e) => {
                if (selectedCard.current.className.match(/full/)) {
                  e.target.innerText = toggleBtnContent(
                    props.displayBtnDesc,
                    0
                  );
                  return (selectedCard.current.className = "card-content");
                }
                e.target.innerText = toggleBtnContent(props.displayBtnDesc, 1);
                selectedCard.current.className = "card-content full";
              }}
            >
              {toggleBtnContent(props.displayBtnDesc, 0)}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={`card${props.displayBtnDesc ? " extended" : ""}`}>
      {!props.noCardLink ? (
        <Link to={`/character/${props._id}`}>{content}</Link>
      ) : (
        content
      )}

      <Link
        to="/"
        className={`icon-save${
          helpers.isSaveInFavorite(
            props._id,
            props.category,
            props.existingFavorites
          )
            ? " saved"
            : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          if (!helpers.isLogged()) {
            modal(true);
          }
          if (
            !helpers.isSaveInFavorite(
              props._id,
              props.category,
              props.existingFavorites
            )
          ) {
            helpers.saveToFavorite(props, e.target);
          } else {
            helpers.removeFromFavorite(props._id, props.category, e.target);

            if (location.pathname === "/favorites") {
              if (selectedCard.current.parentNode.className === "card") {
                return selectedCard.current.parentNode.remove();
              }
              return selectedCard.current.parentNode.parentNode.remove();
            }
          }
        }}
      >
        <FontAwesomeIcon icon="heart" />
      </Link>
    </div>
  );
};

export default Card;
