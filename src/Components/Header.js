import { Link } from "react-router-dom";

const Header = ({ isLogged, destroySession }) => {
  return (
    <header>
      <div className="header container">
        <Link to="/">
          <img
            src="https://lereacteur-marvel-api.netlify.app/static/media/logo.ad6c786b.svg"
            alt="Logo"
            className="logo"
          />
        </Link>
        <nav>
          <Link to="/">Personnages</Link>
          <Link to="/comics">Comics</Link>
          {isLogged ? (
            <>
              <Link to="/favorites">Favoris</Link>
              <Link to="/" onClick={() => destroySession()}>
                Se déconnecter
              </Link>
            </>
          ) : (
            <Link to="/login" className="btn">
              Connexion | Inscription
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
