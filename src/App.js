import React from "react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

import ApodImage from "./components/ApodImage";
import ApodDetails from "./components/ApodDetails";
import SaturnLoader from "./assets/images/saturn.gif";
import "./App.scss";

async function fetchApod(key, url) {
  // Wait for 2 seconds before fetching
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Fetch the data
  const res = await fetch(url);

  // Handle success
  if (res.status >= 200 && res.status <= 299) {
    const data = await res.json();
    return data;
  } else {
    // Throw errors
    const { error } = await res.json();
    throw error;
  }
}

function App() {
  const [startDate, setStartDate] = useState(new Date());

  const [url, setUrl] = useState(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.REACT_APP_NASA_KEY}&hd=false`
  );

  const { status, data: apod, error, isFetching } = useQuery(
    ["APOD", url],
    fetchApod
  );

  return (
    <main>
      <ReactQueryDevtools />
      <h1 className="title">NASA Astronomy Photo Of The Day</h1>
      <div className="app-wrapper">
        {status === "loading" ? (
          <>
            <h1 className="loader-message">
              One moment while we connect to NASA
            </h1>
            <img src={SaturnLoader} alt="cartoon spinning gif of Saturn" />
          </>
        ) : status === "error" ? (
          <p className="error">{error.message}</p>
        ) : (
          <>
            <section className="image">
              <ApodImage apod={apod} />
            </section>
            {isFetching ? "Loading..." : null}
            <section className="info">
              <ApodDetails
                apod={apod}
                startDate={startDate}
                setStartDate={setStartDate}
                setUrl={setUrl}
              />
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
