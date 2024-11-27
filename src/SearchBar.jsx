import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, InputAdornment, Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { KeyboardArrowRight } from "@mui/icons-material";
import "leaflet/dist/leaflet.css";
import "./SearchBar.css";

const SearchBar = () => {
  const [ip, setIp] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleSearchChange = (event) => {
    setIp(event.target.value);
  };

  useEffect(() => {
    const fetchInitialIPData = async () => {
      try {
        setError("");
        const response = await axios.get(
          `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RwpqKMDLxpdGyGKXkfzleFDgE62V7`
        );
        setData(response.data);
        setIp(response.data.ip); // Set the connected IP as the default in the input field
      } catch (err) {
        setError("Could not fetch initial IP data. Check your API key.");
      }
    };
    fetchInitialIPData();
  }, []);

  const handleSearch = async () => {
    try {
      setError("");
      const response = await axios.get(
        `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RwpqKMDLxpdGyGKXkfzleFDgE62V7&ipAddress=${ip}`
      );
      setData(response.data);
    } catch (err) {
      setError("Could not fetch data. Check your API key or IP address.");
    }
  };

  // Leaflet default icon fix
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  // MapUpdater component to re-center map
  const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 13); // Update map view with new center
      }
    }, [center, map]);
    return null;
  };

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="searchBar  h-[20vh] flex flex-col justify-start pt-10 gap-5 font-rubik font-medium">
        <div className="heading">
          <h1 className="text-white text-3xl">IP Address Tracker</h1>
        </div>
        <Box>
          <TextField
            fullWidth
            value={ip}
            onChange={handleSearchChange}
            variant="outlined"
            placeholder="Search for any IP address or domain"
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    margin: "0 -50px",
                    maxWidth: 5,
                    backgroundColor: "hsl(0, 0%, 17%)",
                    color: "white",
                    padding: "25px ",
                    borderRadius: "0 20px 20px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleSearch}
                >
                  <KeyboardArrowRight />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 500,
              margin: "0 auto",
              borderRadius: "20px",
              cursor: "pointer",
              backgroundColor: "white",
              ".MuiOutlinedInput-root": {
                borderRadius: "20px",
                height: "50px",
                boxShadow: "none",
              },
            }}
          />
        </Box>
      </div>

      {/* Data Display */}
      {data && (
        <Box
          className="data-display"
          sx={{
            zIndex: 999,
            position: "absolute",
            top: { xs: "17%", md: "17%" },
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: "90%", md: "90%" },
            backgroundColor: "white",
            padding: 3,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
          }}
        >
          <div className="flex flex-col md:flex-row md:gap-10 pt-5 pb-5 ">
            {[
              { label: "IP Address", value: data.ip },
              {
                label: "Location",
                value: `${data.location?.city || "Unknown"}, ${
                  data.location?.country || "Unknown"
                }`,
              },
              {
                label: "Time Zone",
                value: `UTC ${data.location?.timezone || "N/A"}`,
              },
              { label: "ISP", value: data.isp || "Unknown" },
            ].map((item, index) => (
              <div key={index} className="ip-address flex flex-row text-left ">
                <div>
                  <h5 className="text-lg text-dark-gray">{item.label}</h5>
                  <h3 className="text-2xl lg:text-3xl text-very-dark-gray">
                    {item.value}
                  </h3>
                </div>
                {index < 3 && (
                  <div className="">
                    <div className=" md:border-r-2 border-slate-200 h-20 p-8"></div>

                    {/* <div className="hidden sm:block lg:border-r-2 border-slate-200 h-20 p-8"></div> */}

                    {/* <div className="  border-r-2 border-slate-200 h-20 p-8"></div> */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Box>
      )}

      {/* Map Section */}
      <Box className="map-container z-0">
        <MapContainer
          center={[data?.location?.lat || 0, data?.location?.lng || 0]}
          zoom={13}
          style={{ height: "800px", width: "100%" }}
          key={data?.ip}
          zoomControl={false}
        >
          <MapUpdater
            center={[data?.location?.lat || 0, data?.location?.lng || 0]}
          />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {data?.location && (
            <Marker position={[data.location.lat || 0, data.location.lng || 0]}>
              <Popup>
                {data.location.city || "Unknown"},
                {data.location.country || "Unknown"}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </Box>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchBar;
