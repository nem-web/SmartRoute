import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import { FaPlay, FaPause } from "react-icons/fa6";
import { VscDebugRestart } from "react-icons/vsc";

// add city
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import MapVisualisation from "../MapVisualisation";


const Content = () => {
  const [cities, setCities] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    fetch("/cityData.json")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Failed to load cities:", err));
  }, []);


  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const popperRef = useRef(null);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popperOpen &&
        popperRef.current &&
        !popperRef.current.contains(event.target)
      ) {
        if (hasUnsavedChanges) {
          const confirmClose = window.confirm(
            "Changes will be unsaved. Do you want to close?"
          );
          if (!confirmClose) return;
        }
        setPopperOpen(false);
        setHasUnsavedChanges(false); // reset
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popperOpen, hasUnsavedChanges]);
  


  const [formData, setFormData] = useState({
    city: "",
    latitude: "",
    longitude: "",
    country: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("City Added:", formData);
    // Reset form
    setFormData({ city: "", latitude: "", longitude: "", country: "" });
    setPopperOpen(false); // Close popper after submit
  };

  const handleAddCityClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen((prev) => !prev);
  };

  const handleReset = () => { // Reset source and destination
    setSource("");
    setDestination("");
  };

  return (
    <div className="container w-[98%] m-[1rem]">
      <div className="min-h-screen bg-white text-gray-900 p-6">
        <div className="max-w-7xl mx-auto flex gap-6">
          {/* Left Panel */}
          <div className="left-cnt w-[21%] p-4 rounded-lg shadow mr-[1rem] bg-white">
            <label className="block mb-[1rem]">
              <span className="text-gray-700">Source</span>
              <select
                className="mt-[.8rem] p-[.3rem] block w-full border-gray-300 rounded-[.2rem]"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="" disabled>
                  Select Source
                </option>
                {cities.map((cityObj) => (
                  <option
                    key={cityObj.name}
                    value={cityObj.name}
                    disabled={cityObj.name === destination}
                  >
                    {cityObj.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-[1rem]">
              <span className="text-gray-700">Destination</span>
              <select
                className="mt-[.8rem] p-[.3rem] block w-full border-gray-300 rounded-[.2rem]"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="" disabled>
                  Select Destination
                </option>
                {cities.map((cityObj) => (
                  <option
                    key={cityObj.name}
                    value={cityObj.name}
                    disabled={cityObj.name === source}
                  >
                    {cityObj.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-[.5rem] mb-[1rem]">
              <Button
                variant="contained"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Start
              </Button>
              <Button
                onClick={handleReset}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded !color-[#000]"
              >
                Reset
              </Button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Animation Speed
              </label>
              <input type="range" className="w-full" />
            </div>

            <label className="block mb-[1rem]">
              <span className="text-gray-700">Algorithm</span>
              <select className="mt-[.8rem] p-[.3rem] block w-full border-gray-300 rounded-[.2rem]">
                <option className="opt">Dijkstra</option>
                <option className="opt">BFS</option>
                <option className="opt">A*</option>
              </select>
            </label>

            <div className="bg-[#ede8e8] mt-[1rem] p-[.5rem] rounded-[.4rem] shadow-inner h-48 overflow-y-auto text-sm">
              <p>Log:</p>
              <p>Visiting A → B</p>
              <p>Distance = 4</p>
              <p>Visiting A 3 1</p>
              {/* ...additional logs */}
            </div>

            <div className="mt-[1rem] p-[.4rem] mb-[1rem] text-sm bg-[#ede8e8]">
              Priority Queue: <code>[A(D), B(3), C(5)]</code>
            </div>

            {/* add city logic */}
            <Box>
              <Button variant="outlined" onClick={handleAddCityClick}>
                Add City
              </Button>

              <Popper
                open={popperOpen}
                anchorEl={anchorEl}
                placement="right"
                transition
                sx={{ zIndex: 1200 }}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper
                      ref={popperRef}
                      sx={{ padding: 2, minWidth: "250px" }}
                    >
                      <Typography
                        variant="h6"
                        className="text-center"
                        gutterBottom
                      >
                        Add New City
                      </Typography>
                      <form
                        onSubmit={handleFormSubmit}
                        className="flex flex-col gap-[0.6rem] mb-[0.6rem]"
                      >
                        <input
                          type="text"
                          name="city"
                          placeholder="City Name"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="p-[.3rem] border rounded-[4px]"
                          required
                        />
                        <input
                          type="number"
                          name="latitude"
                          placeholder="Latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="p-[.2rem] border rounded-[4px]"
                          required
                        />
                        <input
                          type="number"
                          name="longitude"
                          placeholder="Longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="p-[.2rem] border rounded-[4px]"
                          required
                        />
                        <input
                          type="text"
                          name="country"
                          placeholder="Country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="p-[.2rem] border rounded-[4px]"
                          required
                        />
                        <Button type="submit" variant="contained" size="small">
                          Submit
                        </Button>
                      </form>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Box>
          </div>

          {/* Right Panel (Map Area) */}
          <div className="right-cnt flex-1 bg-[#b8b6b6] ml-[1rem] rounded-[.5rem] shadow relative overflow-hidden">
            <MapVisualisation />
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-400">[Map / Visualization Area]</p>
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="mt-[1.2rem] bg-gray-100 p-[1rem] rounded-lg shadow flex justify-center items-center mx-auto">
          <div className="play-panel flex items-center justify-center flex-row gap-[.8rem] mb-[1rem]">
            <FaPlay className="w-[22px] h-[22px] cursor-pointer" />
            <FaPause className="w-[22px] h-[22px] cursor-pointer" />
            <VscDebugRestart className="w-[22px] h-[22px] cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
