import React, { useEffect, useState } from "react";
import axios from "axios";
import SingleContent from "../../components/SingleContent/SingleContent";
import "./Trending.css";
import CustomPagination from "../../components/Pagination/CustomPagination";
import { FormattedMessage } from "react-intl";

const Trending = () => {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const lang = localStorage.getItem("lang");

  const fetchTrending = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&language=${lang}&page=${page}`
    );
    setContent(data.results);
  };

  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line
  }, [lang, page]);

  return (
    <div>
      <span className="pageTitle">
        {
          <FormattedMessage
            id="app.trending"
            defaultMessage="Trending"
          ></FormattedMessage>
        }
      </span>
      <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={c.media_type}
              vote_average={c.vote_average}
              objeto={c}
            ></SingleContent>
          ))}
      </div>
      <CustomPagination setPage={setPage}></CustomPagination>
    </div>
  );
};

export default Trending;
