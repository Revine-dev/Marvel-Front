import axios from "axios";
import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Loading from "../Components/Loading";
import Pagination from "../Components/Pagination";
import Search from "../Components/Search";
import helpers from "../Components/helpers";

const AllCharacters = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState(false);
  const [existingFavorites, setExistingFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [page, setPage] = useState(1);
  helpers.controlLoading(isLoading);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://marvel-revine.onrender.com/characters/?page=${page}&search=${search}&limit=${limit}`
      );
      setCharacters(response.data);
      setIsLoading(false);
    };

    fetchData();
  }, [page, search, limit]);

  useEffect(() => {
    if (!helpers.getSessionName(true)) {
      return [];
    }

    const fetchData = async () => {
      const response = await axios.get(
        `https://marvel-revine.onrender.com/favorites/`,
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
    <section className="characters">
      <h1>Personnages Marvel</h1>
      <Search
        setSearch={setSearch}
        name="personnage"
        results={characters.results}
        nbResults={characters.count}
        nbRows={characters.limit}
        setLimit={setLimit}
      />
      <div className="cards">
        {characters.results.map((character, i) => {
          character = {
            ...character,
            category: "character",
            existingFavorites: existingFavorites,
          };
          return <Card key={i} {...character} />;
        })}
      </div>
      <Pagination data={characters} page={page} setPage={setPage} />
    </section>
  );
};

export default AllCharacters;
