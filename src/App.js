import "./App.css";
import "./responsive.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import AllCharacters from "./Routes/AllCharacters";
import Character from "./Routes/Character";
import Comics from "./Routes/Comics";
import { useState, useRef, createContext } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHeart,
  faChevronDown,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import Favorites from "./Routes/Favorites";
import Cookies from "js-cookie";
import Login from "./Routes/Login";
import helpers from "./Components/helpers";

export const Modal = createContext();

function App() {
  library.add(faHeart, faChevronDown, faExclamationCircle);
  const sessionName = helpers.getSessionName();
  const [token, setToken] = useState(Cookies.get(sessionName) || false);
  const [modalOpen, setModalOpen] = useState(false);
  const modal = useRef();

  const logUser = (tokenToSave) => {
    if (token) {
      return false;
    }
    setToken(tokenToSave);
    Cookies.set(sessionName, tokenToSave);
  };

  const destroySession = () => {
    Cookies.remove(sessionName);
    setToken(false);
  };

  return (
    <Router>
      <Header isLogged={token} destroySession={destroySession} />
      <Modal.Provider value={setModalOpen}>
        <main>
          <div className="container" id="content">
            <Switch>
              <Route path="/login">
                {token ? <Redirect to="/" /> : <Login logUser={logUser} />}
              </Route>
              <Route path="/signup">
                {token ? <Redirect to="/" /> : <Login logUser={logUser} />}
              </Route>
              <Route path="/favorites">
                {!token ? (
                  <Redirect to="/login" />
                ) : (
                  <Favorites tokenuser={token} />
                )}
              </Route>
              <Route path="/comics">
                <Comics />
              </Route>
              <Route path="/character/:id">
                <Character />
              </Route>
              <Route path="/">
                <AllCharacters />
              </Route>
            </Switch>
          </div>
        </main>
        <div
          id="popup"
          className="overlay"
          ref={modal}
          style={{
            visibility: modalOpen ? "visible" : "hidden",
            opacity: modalOpen ? 1 : 0,
          }}
        >
          <div className="popup">
            <span className="close" onClick={() => setModalOpen(false)}>
              &times;
            </span>
            <img
              src="https://www.steltix.com/wp-content/uploads/2019/09/icon_products_Transparent-Logon-200x200.png"
              alt="Connexion nécessaire"
              width="70px"
              height="70px"
            />
            <div className="content">
              <div>
                Connecte toi pour sauvegarder tes personnages et comics en
                favori
              </div>
              <Link
                to="/login"
                className="btn"
                onClick={() => setModalOpen(false)}
              >
                Je me connecte
              </Link>
            </div>
          </div>
        </div>
      </Modal.Provider>
      <Footer />
    </Router>
  );
}

export default App;
