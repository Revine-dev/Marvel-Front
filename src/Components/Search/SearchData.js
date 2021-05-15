const SearchData = ({ nbResults, nbRows, setLimit }) => {
  const nbPerLinesAvailable = [20, 50, 100];

  if (nbResults === 0) {
    return <></>;
  }

  return (
    <div className="subline">
      <div className="nb-found">
        {nbResults.toLocaleString()} résultat{nbResults > 1 && "s"}
      </div>
      <div className="select-nb">
        Afficher
        <select
          name="rows"
          defaultValue={nbRows}
          onChange={(e) => setLimit(e.target.value)}
        >
          {nbPerLinesAvailable.map((nb) => {
            return (
              <option key={nb} value={nb}>
                {nb}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default SearchData;
