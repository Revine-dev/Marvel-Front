import "./App.css";
import "./responsive.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import AllCharacters from "./Routes/AllCharacters";
import Character from "./Routes/Character";
import Comics from "./Routes/Comics";
import { useState } from "react";
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

function App() {
  library.add(faHeart, faChevronDown, faExclamationCircle);
  const sessionName = helpers.getSessionName();
  const [token, setToken] = useState(Cookies.get(sessionName) || false);

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
      <div id="popup" className="overlay">
        <div className="popup">
          <h2>Information</h2>
          <a className="close" href="#content">
            &times;
          </a>
          <div className="content">
            Vous devez être connecté pour sauvegarder en favori
          </div>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
