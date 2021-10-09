import { useState } from "react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { Button, Input, useToast } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import PlaylistDisplay from "../components/playlist-display";

export default function Home({ genres }) {
  const [city, setCity] = useState("");
  const [cityInfo, setCityInfo] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(null);
  const [cityNotFound, setCityNotFound] = useState(false);

  const toast = useToast();

  function saveToStorage() {
    const city = cityInfo.name;
    const timenow = new Date();
    const temp = cityInfo.main.temp;
    const userData = { playlist, timenow, temp, genre, city };
    try {
      localStorage.setItem(`playlist_${timenow}`, JSON.stringify(userData));
      toast({
        title: "Playlist saved!",
        description: "Your playlist has been saved to the local storage.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    if (city.trim() !== "") {
      try {
        setCityInfo(null);
        setPlaylist(null);
        setLoading(true);
        const response = await axios.get(
          encodeURI(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OWM_KEY}&units=metric`
          )
        );

        setCityNotFound(false);
        setLoading(false);
        setCityInfo(response.data);
        const temp = parseInt(response.data.main.temp);
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
          setGenre("Classical");
        }
        if (temp < 16) {
          genreFilter = "genre-global-chart-11";
          setGenre("LoFi");
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
      } catch (error) {
        setLoading(false);
        setCityNotFound(true);
        console.log(error);
      }
      setCity("");
    }
  }

  return (
    <div className="container mx-auto min-w-[350px] flex flex-col items-center justify-center pt-52 px-5 pb-10">
      <Head>
        <title>Mesha Challenge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Input
        variant="flushed"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="search for places"
        autoComplete="off"
        className="mb-5"
      />
      <Button
        isLoading={loading}
        onClick={(e) => submitHandler(e)}
        colorScheme="green"
        className="mb-5"
      >
        Search
      </Button>

      {!loading && cityInfo && playlist && (
        <>
          <PlaylistDisplay
            playlist={playlist}
            genre={genre}
            cityInfo={cityInfo}
            saveToStorage={saveToStorage}
          />
        </>
      )}
      {!loading && cityNotFound && <p>City not found</p>}

      <Link href="/playlists" passHref>
        <Button
          variant="link"
          colorScheme="green"
          rightIcon={<ArrowForwardIcon />}
        >
          Go to saved playlists
        </Button>
      </Link>
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
