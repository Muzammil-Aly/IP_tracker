import { react, useState } from "react";
import ReactDOM from "react-dom";

import "./App.css";
import SearchBar from "./SearchBar";
import IPAddressTracker from "./IPAddressTracker";
function App() {
  return (
    <>
      <div className="address-tracker-container  ">
        <div className="searchbar">
          <SearchBar />
        </div>
        <div>{/* <IPAddressTracker /> */}</div>
      </div>
    </>
  );
}

export default App;
