import React from "react";
import Image from "next/image";

const WeatherDisplay = ({ cityInfo }) => {
  return (
    <div className=" flex pb-6 justify-around bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-xl">
      <div className="flex flex-col pt-6 gap-y-3">
        <span>
          {cityInfo.name} ({cityInfo.sys.country})
        </span>
        <h2 className="text-3xl">{cityInfo.main.temp.toFixed(0)}&deg;C</h2>
        <div className="flex gap-x-3"></div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Image
          src={`https://openweathermap.org/img/wn/${cityInfo.weather[0].icon}@2x.png`}
          alt={cityInfo.weather[0].description}
          layout="fixed"
          width="100"
          height="100"
        />
        <h2 className="text-center -mt-4">{cityInfo.weather[0].description}</h2>
      </div>
    </div>
  );
};

export default WeatherDisplay;
