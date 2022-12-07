import { useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = ({ logUser }) => {
  const content = useRef();
  const history = useHistory();
  const location = useLocation();
  const [errorLogin, SetErrorLogin] = useState(false);
  const [errorSignup, SetErrorSignup] = useState(false);

  const [emailLogin, SetEmailLogin] = useState();
  const [passwordLogin, SetPasswordLogin] = useState();

  const [nameSignup, setNameSignup] = useState();
  const [emailSignup, SetEmailSignup] = useState();
  const [passwordSignup, SetPasswordSignup] = useState();

  const toggleView = (show) => {
    if (show) {
      return (content.current.className = "login-signup right-panel-active");
    }
    content.current.className = "login-signup";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailLogin || !passwordLogin) {
      return SetErrorLogin("Tous les champs sont requis");
    }

    try {
      const response = await axios.post(
        `https://marvel-revine.onrender.com/users/login`,
        {
          email: emailLogin,
          password: passwordLogin,
        }
      );
      if (response.data.error) {
        return SetErrorLogin(response.data.message);
      } else if (response.data.success) {
        logUser(response.data.data.token);
        history.push("/favorites");
      } else {
        alert("Erreur inconnue");
      }
    } catch (error) {
      alert("Vérifiez votre connexion");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!emailSignup || !passwordSignup || !nameSignup) {
      return SetErrorSignup("Tous les champs sont requis");
    }

    try {
      const response = await axios.post(
        `https://marvel-revine.onrender.com/users/signup`,
        {
          email: emailSignup,
          password: passwordSignup,
          username: nameSignup,
        }
      );
      if (response.data.error) {
        return SetErrorSignup(response.data.message);
      } else if (response.data.success) {
        logUser(response.data.data.token);
        history.push("/favorites");
      } else {
        alert("Erreur inconnue");
      }
    } catch (error) {
      alert("Vérifiez votre connexion");
    }
  };

  return (
    <section className="connect">
      <div
        className={`login-signup${
          location.search.match(/^\?register/) ? " right-panel-active" : ""
        }`}
        ref={content}
      >
        <div className="form-container sign-up-container">
          <form action="/login" method="post" onSubmit={handleSignup}>
            <h1>Créer mon compte</h1>
            {errorSignup && (
              <div className="error">
                <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />{" "}
                {errorSignup}
              </div>
            )}
            <input
              type="text"
              placeholder="Nom"
              onChange={(e) => setNameSignup(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => SetEmailSignup(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => SetPasswordSignup(e.target.value)}
            />
            <button type="submit" className="btn">
              Inscription
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="/login" onSubmit={handleLogin}>
            <h1>Me connecter</h1>
            {errorLogin && (
              <div className="error">
                <FontAwesomeIcon icon={["fas", "exclamation-circle"]} />{" "}
                {errorLogin}
              </div>
            )}
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => SetEmailLogin(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => SetPasswordLogin(e.target.value)}
            />
            <button type="submit" className="btn">
              Connexion
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Tu as déjà un compte ?</h1>
              <p>
                Pour rester connecté avec nous, connecte toi et accède à tes
                favoris
              </p>
              <button
                className="ghost btn-log"
                onClick={() => toggleView(false)}
              >
                Connexion
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Bienvenue !</h1>
              <p>Inscris toi pour nous rejoindre et accéder à tes favoris !</p>
              <button
                className="ghost btn-log"
                onClick={() => toggleView(true)}
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
