import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    for (let key of keys) {
      if (key.includes("playlist_")) {
        const playlist = {};
        playlist[key] = JSON.parse(localStorage.getItem(key));
        setPlaylists((playlists) => [...playlists, playlist]);
      }
    }
  }, []);

  function deletePlaylist(key) {
    localStorage.removeItem(key);
    const temp = [...playlists];
    temp.splice(key, 1);
    setPlaylists(temp);
  }

  return (
    <div>
      <h1>playlists</h1>
      <Link href="/">
        <a>back</a>
      </Link>
      <Accordion allowToggle>
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => {
            return Object.entries(playlist).map(([key, val]) => {
              return (
                <AccordionItem key={key}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {key}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {val.playlist.map((track) => (
                      <p key={track.key}>{track.title}</p>
                    ))}
                    <button onClick={() => deletePlaylist(key)}>
                      delete playlist
                    </button>
                  </AccordionPanel>
                </AccordionItem>
              );
            });
          })
        ) : (
          <p>No playlists saved</p>
        )}
      </Accordion>
    </div>
  );
};

export default Playlists;
