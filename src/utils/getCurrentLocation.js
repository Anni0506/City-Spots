// A plain JavaScript helper (NOT a component - no JSX, no state).
// Two different components need "where is the user right now?",
// so we write the logic once here and import it in both places.

// onSuccess(coords) is called with [latitude, longitude]
// onError(message) is called with a human-readable string
export function getCurrentLocation(onSuccess, onError) {
  // Some old browsers don't have this API at all
  if (!navigator.geolocation) {
    onError('Your browser does not support location.');
    return;
  }

  // The browser shows a "Allow location?" popup, then calls ONE of the two functions below
  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess([position.coords.latitude, position.coords.longitude]);
    },
    () => {
      onError('Could not get your location (did you allow permission?).');
    }
  );
}
