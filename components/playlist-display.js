import React from "react";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import Image from "next/image";

const PlaylistInfo = ({ children }) => (
  <div className="min-h-[150px]">{children}</div>
);

const PlaylistDisplay = ({ playlist, genre, cityInfo, saveToStorage }) => {
  console.log(playlist);
  return (
    <div className="border-2 border-black w-full divide-y-2 divide-black mb-5">
      <div className="flex divide-x-2 divide-black">
        <div className="flex flex-col flex-1 p-3">
          <p className="text-3xl">
            {cityInfo.name} ({cityInfo.sys.country})
          </p>
          <p className="self-center">
            <Image
              src={`https://openweathermap.org/img/wn/${cityInfo.weather[0].icon}@2x.png`}
              alt={cityInfo.weather[0].description}
              layout="fixed"
              width="100"
              height="100"
            />
          </p>
          <p className="text-3xl self-end">
            {cityInfo.main.temp.toFixed(0)}&deg;C
          </p>
        </div>
        <div className="flex flex-col flex-1 p-3 justify-end items-center gap-10">
          <p className="text-3xl">Mood: {genre}</p>
          <Button onClick={saveToStorage} colorScheme="green" className="">
            save playlist
          </Button>
        </div>
      </div>

      <Table variant="striped" colorScheme="green" size="sm">
        <Tbody>
          {playlist.map((track) => (
            <Tr>
              <Td key={track.key}>
                {track.title} - {track.subtitle}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default PlaylistDisplay;
