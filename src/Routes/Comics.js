import axios from "axios";
import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Loading from "../Components/Loading";
import Pagination from "../Components/Pagination";
import helpers from "../Components/helpers";
import Search from "../Components/Search";

const Comics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(false);
  const [existingFavorites, setExistingFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [page, setPage] = useState(1);
  helpers.controlLoading(isLoading);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://marvel-backend-revine.herokuapp.com/comics/?page=${page}&search=${search}&limit=${limit}`
      );

      setData(response.data);
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
    <section className="comics">
      <h1>Comics Marvel</h1>
      <Search
        setSearch={setSearch}
        name="comic"
        results={data.results}
        nbResults={data.count}
        nbRows={data.limit}
        setLimit={setLimit}
      />
      <div className="cards">
        {data.results &&
          data.results.length > 0 &&
          data.results.map((comic, i) => {
            comic = {
              ...comic,
              category: "comic",
              noCardLink: true,
              displayBtnDesc: "Voir plus|Voir moins",
              existingFavorites: existingFavorites,
            };
            return <Card key={i} {...comic} />;
          })}
      </div>
      <Pagination data={data} page={page} setPage={setPage} />
    </section>
  );
};

export default Comics;
