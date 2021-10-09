import React from "react";
import { Button, Table, Tbody, Tr, Td } from "@chakra-ui/react";
import Image from "next/image";

const PlaylistDisplay = ({ playlist, genre, cityInfo, saveToStorage }) => {
  return (
    <div className="border-2 border-black w-full divide-y-2 divide-black mb-5">
      <div className="flex divide-x-2 divide-black">
        <div className="flex flex-col flex-1 p-3">
          <p className="text-3xl">
            {cityInfo.name} ({cityInfo.sys.country})
          </p>
          <div className="self-center">
            <Image
              src={`https://openweathermap.org/img/wn/${cityInfo.weather[0].icon}@2x.png`}
              alt={cityInfo.weather[0].description}
              layout="fixed"
              width="100"
              height="100"
            />
          </div>
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
            <Tr key={track.key}>
              <Td>
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
