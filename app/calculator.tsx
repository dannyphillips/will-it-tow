"use client"; // 👈 use it here

import React, { useState } from "react";

const TowingCalculator = () => {
  const [trailerWeight, setTrailerWeight] = useState("");
  const [towVehicleCapacity, setTowVehicleCapacity] = useState("");
  const [payloadCapacity, setPayloadCapacity] = useState("");
  const [tongueWeight, setTongueWeight] = useState("");
  const [result, setResult] = useState("");

  const handleCalculate = () => {
    const trailerWeightNum = parseFloat(trailerWeight);
    const towVehicleCapacityNum = parseFloat(towVehicleCapacity);
    const payloadCapacityNum = parseFloat(payloadCapacity);
    const tongueWeightNum = parseFloat(tongueWeight);

    if (
      isNaN(trailerWeightNum) ||
      isNaN(towVehicleCapacityNum) ||
      isNaN(payloadCapacityNum) ||
      isNaN(tongueWeightNum)
    ) {
      setResult("Please enter valid numbers");
    } else if (
      trailerWeightNum > towVehicleCapacityNum ||
      tongueWeightNum > payloadCapacityNum
    ) {
      setResult("Trailer cannot be towed");
    } else {
      setResult("Trailer can be towed");
    }
  };

  return (
    <div className="flex flex-row items-center justify-center bg-gray-200">
      <div className="bg-gray p-12 rounded-lg shadow-lg">
        <div className="flex flex-row">
          <div className="mb-12 mr-12 bg-white p-12 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-black">Tow Vehicle</h2>
            <div className="mb-4">
              <label
                htmlFor="tow-vehicle-capacity"
                className="block text-gray-800 font-bold mb-2"
              >
                Towing Capacity (lbs)
              </label>
              <input
                type="text"
                id="tow-vehicle-capacity"
                className="w-full border text-black border-gray-300 p-2 rounded-lg"
                value={towVehicleCapacity}
                onChange={(e) => setTowVehicleCapacity(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="payload-capacity"
                className="block text-gray-800 font-bold mb-2"
              >
                Payload Capacity (lbs)
              </label>
              <input
                type="text"
                id="payload-capacity"
                className="w-full border text-black border-gray-300 p-2 rounded-lg"
                value={payloadCapacity}
                onChange={(e) => setPayloadCapacity(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-12 bg-white p-12 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold my-2 text-black">Trailer</h2>
            <div className="mb-4">
              <label
                htmlFor="trailer-weight"
                className="block text-gray-800 font-bold mb-2"
              >
                Trailer Weight (lbs)
              </label>
              <input
                type="text"
                id="trailer-weight"
                className="w-full border text-black border-gray-300 p-2 rounded-lg"
                value={trailerWeight}
                onChange={(e) => setTrailerWeight(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="tongue-weight"
                className="block text-gray-800 font-bold mb-2"
              >
                Tongue Weight (lbs)
              </label>
              <input
                type="text"
                id="tongue-weight"
                className="w-full border text-black border-gray-300 p-2 rounded-lg"
                value={tongueWeight}
                onChange={(e) => setTongueWeight(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="rounded-3xl bg-black px-6 py-2 text-xl font-medium uppercase text-white"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        </div>

        <div className="text-xl mt-6 text-red-500 font-bold">{result}</div>
      </div>
    </div>
  );
};

export default TowingCalculator;
