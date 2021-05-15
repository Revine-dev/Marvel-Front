import "./Pagination.css";

const Pagination = ({ data, page, setPage }) => {
  if (data.count === 0 || !data.count) {
    return <div className="noresult">Aucun résultat trouvé</div>;
  }

  const displayPage = true;
  const addingPage = 2;

  const total = data.count;
  const perPage = data.limit;
  const maxPages = Math.ceil(total / perPage);

  const generatePages = () => {
    const result = [];

    const start = page - addingPage > 0 ? page - addingPage : 1;
    const end = page + addingPage < maxPages ? page + addingPage : maxPages;

    for (let index = start; index <= end; index++) {
      result.push(index);
    }
    return result;
  };

  return (
    <div className="pagination">
      {generatePages()[0] !== 1 && (
        <>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setPage(1);
            }}
          >
            {displayPage && "Page "}1
          </a>
          ...
        </>
      )}
      {generatePages().map((nextPage, i) => {
        return (
          <a
            href="/"
            key={i}
            className={`page ${page === nextPage && "current"}`}
            onClick={(e) => {
              e.preventDefault();

              if (page === nextPage) {
                return;
              }

              setPage(nextPage);
            }}
          >
            {displayPage && "Page "}
            {nextPage}
          </a>
        );
      })}
      {generatePages()[generatePages().length - 1] !== maxPages && (
        <>
          ...{" "}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setPage(maxPages);
            }}
          >
            {displayPage && "Page "}
            {maxPages}
          </a>
        </>
      )}
    </div>
  );
};

export default Pagination;
