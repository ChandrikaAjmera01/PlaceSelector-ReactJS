import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();
  useEffect(() => {

    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const shortedPlaces = sortPlacesByDistance(
            places, 
            position.coords.latitude, 
            position.coords.latitude);
          setAvailablePlaces(shortedPlaces);
        });


        setIsFetching(false);
      } catch (error) {
        setError({ message: error.message || "Could not fetch palces. Please try again later " });
        setIsFetching(false);
      }



    }
    fetchPlaces();
    /*
     fetch('http://localhost:3000/places').
     then((response) => {
       return response.json();
     }).then((resData)=>{
       setAvailablePlaces(resData.places)
     }) */




  }, [])

  if (error) {
    return <Error title="An error occured!" message={error.message}></Error>
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching Place data .."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
