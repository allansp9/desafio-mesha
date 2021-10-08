import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import moment from "moment";

export default function Home({ genres }) {
  const [city, setCity] = useState("");
  const [cityInfo, setCityInfo] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [temp, setTemp] = useState(null);
  const [genre, setGenre] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  function changeHandler(e) {
    if (e.target.value.trim() !== "") {
      const trimmedCity = e.target.value.trim();
      setCity(trimmedCity);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    if (city.trim() !== "") {
      try {
        const response = await axios.get(
          encodeURI(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OWM_KEY}&units=metric`
          )
        );
        if (response.data) {
          setTimestamp(moment.unix(response.data.dt).format("D/M/YYYY"));
          setCityInfo(response.data);
          console.log(response.data);
          setTemp(parseInt(response.data.main.temp));

          let genreFilter = "";
          if (temp > 32) {
            genreFilter = "genre-global-chart-7";
            setGenre("Rock");
          }
          if (temp < 32 && temp > 24) {
            genreFilter = "genre-global-chart-1";
            setGenre("Pop");
          }
          if (temp < 24 && temp > 16) {
            genreFilter = "genre-global-chart-10";
            setGenre("Country");
          }
          if (temp < 16) {
            genreFilter = "genre-global-chart-11";
            setGenre("AfroBeats");
          }

          try {
            const options = {
              method: "GET",
              url: "https://shazam.p.rapidapi.com/charts/track",
              params: {
                locale: "en-US",
                listId: genreFilter,
                pageSize: "20",
                startFrom: "0",
              },
              headers: {
                "x-rapidapi-host": "shazam.p.rapidapi.com",
                "x-rapidapi-key": process.env.NEXT_PUBLIC_SHAZAM_KEY,
              },
            };
            const response = await axios.request(options);
            console.log(response.data);
            setPlaylist(response.data.tracks);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoaded(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form>
        <input
          type="text"
          name="city"
          value={city}
          onChange={(e) => changeHandler(e)}
          placeholder="Ex: Tokyo"
          autoComplete="off"
        />
        <button onClick={(e) => submitHandler(e)}>search</button>
      </form>
      <div>
        {isLoaded && playlist && (
          <ul>
            {playlist.map((track) => (
              <li key={track.key}>{track.title}</li>
            ))}
          </ul>
        )}
        {isLoaded && !playlist && <p>City not found</p>}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const options = {
    method: "GET",
    url: "https://shazam.p.rapidapi.com/charts/list",
    headers: {
      "x-rapidapi-host": "shazam.p.rapidapi.com",
      "x-rapidapi-key": process.env.NEXT_PUBLIC_SHAZAM_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data) {
      return {
        props: {
          genres: response.data.global.genres,
        },
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
