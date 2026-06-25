/**
 * Gets the current location of the device, with automatic fallback from high accuracy to low accuracy
 * if a timeout or position unavailable error occurs (common on iOS).
 * 
 * @param {PositionOptions} options - Options for geolocation
 * @returns {Promise<GeolocationPosition>} Resolves with the location or rejects with a GeolocationPositionError
 */
export const getPreciseLocation = (options = {}) => {
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000, // 10 seconds
    maximumAge: 60000, // 1 minute cached location allowed
    ...options,
  };

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 0, message: "Geolocation is not supported by your browser." });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        // If high accuracy was requested and failed due to timeout (3) or unavailability (2), try a fallback with low accuracy
        if (defaultOptions.enableHighAccuracy && (error.code === 3 || error.code === 2)) {
          console.warn("High-accuracy location failed. Attempting low-accuracy fallback...");
          
          const fallbackOptions = {
            ...defaultOptions,
            enableHighAccuracy: false,
            timeout: 5000, // 5 seconds for fallback
          };

          navigator.geolocation.getCurrentPosition(
            (fallbackPosition) => resolve(fallbackPosition),
            (fallbackError) => reject(fallbackError),
            fallbackOptions
          );
        } else {
          reject(error);
        }
      },
      defaultOptions
    );
  });
};

/**
 * Returns a user-friendly error message based on the GeolocationPositionError.
 * 
 * @param {GeolocationPositionError} error 
 * @returns {string} User-friendly message
 */
export const getGeolocationErrorMessage = (error) => {
  if (!error) return "Unknown location error.";
  switch (error.code) {
    case 1: // PERMISSION_DENIED
      return "Location access denied. Please enable location permissions for this site in your browser and device Settings.";
    case 2: // POSITION_UNAVAILABLE
      return "Location unavailable. Please check if your device has GPS, cellular, or Wi-Fi coverage.";
    case 3: // TIMEOUT
      return "Location request timed out. Please try again or move to an area with better GPS reception.";
    default:
      return error.message || "An unexpected error occurred while fetching location.";
  }
};
