import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';



async function fetchShortedPlaces(){
  const places = await fetchAvailablePlaces();

  return new Promise((resolve)=>{
    navigator.geolocation.getCurrentPosition((position) => {
      const shortedPlaces = sortPlacesByDistance(
        places, 
        position.coords.latitude, 
        position.coords.latitude);
        resolve(shortedPlaces);
    });
  });
}
export default function AvailablePlaces({ onSelectPlace }) {

  const {
    isFetching,
    fetchedData: availablePlaces,
    error
   }= useFetch(fetchShortedPlaces,[]);

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
