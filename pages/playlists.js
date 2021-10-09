import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  Heading,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

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
    <div className="container mx-auto min-w-[350px] flex flex-col items-center justify-center pt-52 px-5 pb-10 gap-10">
      <Heading as="h1" size="3xl">
        Playlists
      </Heading>

      <Accordion allowToggle>
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => {
            return Object.entries(playlist).map(([key, val]) => {
              return (
                <AccordionItem key={key}>
                  <Text>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Text>
                          {key} | {val.city} | temp: {val.temp.toFixed(0)}&deg;C
                          | mood: {val.genre}
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Text>
                  <AccordionPanel pb={4} className="flex flex-col">
                    <Table variant="striped" size="sm">
                      <Tbody>
                        {val.playlist.map((track) => (
                          <Tr key={track.key}>
                            <Td>
                              {track.title} - {track.subtitle}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <Button
                      onClick={() => deletePlaylist(key)}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </AccordionPanel>
                </AccordionItem>
              );
            });
          })
        ) : (
          <p>You have no playlists saved at the moment.</p>
        )}
      </Accordion>
      <Link href="/" passHref>
        <Button variant="link" colorScheme="green" leftIcon={<ArrowBackIcon />}>
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default Playlists;
