import "./Search.css";
import { useState, useRef, useEffect } from "react";
import SearchData from "./SearchData";

const Search = ({ setSearch, name, results, nbResults, nbRows, setLimit }) => {
  const searchBar = useRef();
  const [autcompleteOpen, setAutcompleteOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState(true);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setAutcompleteOpen(false);
    }

    if (results && e.target.value) {
      setAutcompleteOpen(true);
      results = results.slice(0, 50);
      const data = results.map((result) =>
        result.title ? result.title : result.name
      );
      setAutocomplete(data);
    }
  };

  const handleClickOutside = (event) => {
    if (searchBar.current && !searchBar.current.contains(event.target)) {
      setAutcompleteOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [autcompleteOpen]);

  return (
    <>
      <form
        method="post"
        className="search-form"
        ref={searchBar}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          name="search"
          onChange={handleSearch}
          placeholder={`Rechercher un ${name}`}
        />
        <span className="search-icon size32"></span>
        {autocomplete.length > 1 && (
          <div
            className="autocomplete"
            style={{ display: autcompleteOpen ? "inherit" : "none" }}
          >
            {autocomplete.map((suggestion, i) => {
              return (
                <div
                  key={i}
                  className="suggestion"
                  onClick={() => {
                    searchBar.current.firstChild.value = suggestion;
                    console.log(suggestion);
                    setSearch(suggestion);
                    setAutcompleteOpen(false);
                  }}
                >
                  {suggestion}
                </div>
              );
            })}
          </div>
        )}
      </form>
      <SearchData nbResults={nbResults} nbRows={nbRows} setLimit={setLimit} />
    </>
  );
};

export default Search;
