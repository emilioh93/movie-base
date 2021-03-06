import React, { useEffect } from "react";
import axios from "axios";
import { Chip } from "@material-ui/core";

const Genres = ({
  type,
  selectedGenres,
  setSelectedGenres,
  genres,
  setGenres,
  setPage,
}) => {
  const lang = localStorage.getItem("lang");

  const handleAdd = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setGenres(genres.filter((g) => g.id !== genre.id));
    setPage(1);
  };

  const handleRemove = (genre) => {
    setSelectedGenres(
      selectedGenres.filter((selected) => selected.id !== genre.id)
    );
    setGenres([...genres, genre]);
    setPage(1);
  };

  const fetchGenres = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.REACT_APP_API_KEY}&language=${lang}`
    );
    setGenres(data.genres);
  };

  useEffect(() => {
    fetchGenres();

    // eslint-disable-next-line
  }, [lang]);
  useEffect(() => {
    fetchGenres();
    return () => {
      setGenres({});
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        padding: "15px 0",
        display: "flex",
        justifyContent: "start",
        textAlign: "start",
        flexWrap: "wrap",
        fontWeight: "bold",
      }}
    >
      {selectedGenres &&
        selectedGenres.map((genre) => (
          <Chip
            label={genre.name}
            style={{ margin: 2, backgroundColor: "var(--naranja)" }}
            size="small"
            color="primary"
            key={genre.id}
            clickable
            onDelete={() => handleRemove(genre)}
          ></Chip>
        ))}
      {genres &&
        genres.map((genre) => (
          <Chip
            label={genre.name}
            style={{ margin: 2 }}
            size="small"
            key={genre.id}
            clickable
            onClick={() => handleAdd(genre)}
          ></Chip>
        ))}
    </div>
  );
};

export default Genres;
