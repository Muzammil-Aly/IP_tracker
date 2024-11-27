import React, { useState } from "react";
import axios from "axios";

const IPAddressTracker = () => {
  const [ip, setIp] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError("");
      const response = await axios.get(
        `      https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_RwpqKMDLxpdGyGKXkfzleFDgE62V7&ipAddress=${ip}`
        // `https://geo.ipify.org/api/v2/country,city?apiKey=YOUR_API_KEY&ipAddress=${ip}`
      );
      setData(response.data);
    } catch (err) {
      setError("Could not fetch data. Check your API key or IP address.");
    }
  };

  return (
    <div className="ip-tracker">
      <h1>IP Address Tracker</h1>
      <div>
        <input
          type="text"
          placeholder="Enter IP address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div className="results">
          <h2>Results:</h2>
          <p>
            <strong>IP Address:</strong> {data.ip}
          </p>
          <p>
            <strong>Location:</strong> {data.location.city},{" "}
            {data.location.region}, {data.location.country}
          </p>
          <p>
            <strong>ISP:</strong> {data.isp}
          </p>
          <p>
            <strong>Latitude:</strong> {data.location.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {data.location.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default IPAddressTracker;
