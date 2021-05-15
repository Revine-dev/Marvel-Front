import axios from "axios";
import Cookies from "js-cookie";

const favoritesName = "favorites";
const selectSVGfromPath = (svg) => {
  if (svg.nodeName === "SPAN") {
    return svg;
  }
  if (svg.nodeName === "path") {
    svg = svg.parentElement;
  }
  return svg.parentElement;
};

const helpers = {
  controlLoading: (isLoading) => {
    if (isLoading) {
      document.body.className = "loading";
    } else if (document.body.className === "loading") {
      document.body.removeAttribute("class");
    }
  },
  getSessionName: (getToken) => {
    const name = "favTkn";
    if (getToken) {
      return Cookies.get(name);
    }
    return name;
  },
  loadError: (error) => {
    if (error === 1) {
      return alert("Erreur inconnue");
    }
    return alert("Une erreur s'est produite, veuillez réessayer plus tard.");
  },
  isLogged: () => {
    return Cookies.get(helpers.getSessionName()) ? true : false;
  },
  isSaveInFavorite: (id, category, exitingCards, override = false) => {
    if (!id && !category && !helpers.isLogged()) {
      return false;
    }

    if (!category && !localStorage.getItem(favoritesName)) {
      return !category ? [] : false;
    }

    let json = JSON.parse(localStorage.getItem(favoritesName));
    if (!id && !category) {
      return json;
    }

    if (override && json) {
      return json.find((item) => item._id === id && item.category === category);
    }

    if (!exitingCards) {
      return false;
    }

    let existing = exitingCards.find(
      (item) => item.id_card === id && item.category === category
    );
    return existing ? true : false;
  },
  saveToFavorite: async (item, card) => {
    if (!helpers.isLogged()) {
      if (helpers.isSaveInFavorite(item._id, item.category, [], true)) {
        return false;
      }
      let json = helpers.isSaveInFavorite("json");
      if (json) {
        json.push(item);
        localStorage.setItem(favoritesName, JSON.stringify(json));
        return;
      }
    } else {
      try {
        const response = await axios.post(
          `https://marvel-backend-revine.herokuapp.com/favorites/save`,
          {
            id_card: item._id,
            item: item,
            category: item.category,
          },
          {
            headers: {
              Authorization: "Bearer " + helpers.getSessionName(true),
            },
          }
        );
        if (response.data.error) {
          return alert("Erreur inconnue.");
        }
      } catch (error) {
        helpers.loadError();
      }

      if (!card) {
        return true;
      }

      if (selectSVGfromPath(card).className === "icon-save") {
        selectSVGfromPath(card).className = "icon-save saved";
      }
    }
  },
  removeFromFavorite: async (id, category, card) => {
    if (id === "all" && !category && !card && helpers.isSaveInFavorite()) {
      return localStorage.removeItem(favoritesName);
    }

    if (!helpers.isLogged()) {
      return false;
    }

    try {
      const response = await axios.post(
        `https://marvel-backend-revine.herokuapp.com/favorites/remove`,
        {
          id: id,
          category: category,
        },
        {
          headers: {
            Authorization: "Bearer " + helpers.getSessionName(true),
          },
        }
      );
      console.log(response);
      if (response.data.error) {
        return alert("Erreur inconnue.");
      }
    } catch (error) {
      helpers.loadError();
    }

    if (selectSVGfromPath(card).className === "icon-save saved") {
      selectSVGfromPath(card).className = "icon-save";
    }
  },
};

export default helpers;
