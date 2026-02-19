
// import React, { useState, useEffect } from "react";
// import LocationForm from "../components/Executive/LocationForm";
// import axios from "axios";


// const ExecutiveDashboard = ({ user, logout }) => {
//   const [activeTab, setActiveTab] = useState("entry");

//   const [locationEnabled, setLocationEnabled] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationError, setLocationError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
  

//   // Get user from props
//   const dashboardUser = user;

//   // Get current location when component mounts
//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   // Function to get current location
//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by your browser");
//       return;
//     }

//     setLocationError("");
    
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setCurrentLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy
//         });
//         setLocationEnabled(true);
//         console.log("Location accessed:", position.coords);
//       },
//       (error) => {
//         setLocationEnabled(false);
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             setLocationError("Location access denied. Please enable location to submit entries.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             setLocationError("Location information is unavailable.");
//             break;
//           case error.TIMEOUT:
//             setLocationError("Location request timed out.");
//             break;
//           default:
//             setLocationError("An unknown error occurred while getting location.");
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0
//       }
//     );
//   };

//   // Retry location access
//   const handleRetryLocation = () => {
//     getCurrentLocation();
//   };

//   if (!dashboardUser) {
//     return <h2>No User Found. Please Login Again.</h2>;
//   }

// const handleSubmitDailyLog = async (formData) => {
//   if (!locationEnabled || !currentLocation) {
//     alert("Please enable location access before submitting");
//     return;
//   }

//   setIsSubmitting(true);

//   try {
//     const submissionData = {
//       ...formData,
//       location: currentLocation,
//       executiveId: dashboardUser.userCode,
//       submittedAt: new Date().toISOString()
//     };

//     console.log('calling api');
    
//     const response = await axios.post(
//       "https://mft-zwy7.onrender.com/api/form",
//       submissionData
//     );

//     console.log("Form submitted:", response.data);

//   } catch (error) {
//     console.error("Error submitting daily entry:", error);
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   return (
//     <>
//       <div className="executive-dashboard" user={dashboardUser} >
//         <div className="card">
//           <h1>Welcome {dashboardUser.userCode}!</h1>
//         </div>

//         {/* Location Status Banner */}
//         <div className={`location-banner ${locationEnabled ? 'success' : 'error'}`} 
//              style={{
//                padding: '10px 15px',
//                marginBottom: '20px',
//                borderRadius: '8px',
//                backgroundColor: locationEnabled ? '#d4edda' : '#f8d7da',
//                color: locationEnabled ? '#155724' : '#721c24',
//                border: `1px solid ${locationEnabled ? '#c3e6cb' : '#f5c6cb'}`,
//                display: 'flex',
//                alignItems: 'center',
//                justifyContent: 'space-between'
//              }}>
//           <div>
//             <strong>📍 Location Status:</strong>{' '}
//             {locationEnabled ? (
//               <>
//                 Access Granted 
//                 {currentLocation && (
//                   <span style={{ fontSize: '0.9em', marginLeft: '10px' }}>
//                     (Lat: {currentLocation.latitude.toFixed(6)}, Lng: {currentLocation.longitude.toFixed(6)})
//                   </span>
//                 )}
//               </>
//             ) : (
//               <>
//                 {locationError || "Location access required"}
//               </>
//             )}
//           </div>
//           {!locationEnabled && (
//             <button 
//               onClick={handleRetryLocation}
//               style={{
//                 padding: '5px 15px',
//                 backgroundColor: '#007bff',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 fontSize: '14px'
//               }}
//             >
//               Retry Location
//             </button>
//           )}
//         </div>

//           <LocationForm 
//             onSubmit={handleSubmitDailyLog} 
//             locationEnabled={locationEnabled}
//             isSubmitting={isSubmitting}
//             userCode={dashboardUser.userCode}
//           />

//       </div>
//     </>
//   );
// };

// export default ExecutiveDashboard;
import React, { useState, useEffect, useRef } from "react";
import LocationForm from "../components/Executive/LocationForm";
import axios from "axios";

const ExecutiveDashboard = ({ user, logout }) => {
  const [activeTab, setActiveTab] = useState("entry");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use ref to store watch ID for cleanup
  const watchIdRef = useRef(null);

  // Get user from props
  const dashboardUser = user;

  // Get current location when component mounts - REAL TIME TRACKING
  useEffect(() => {
    startRealTimeLocationTracking();
    
    // Cleanup: stop watching location when component unmounts
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Function to start real-time location tracking
  const startRealTimeLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationError("");
    
    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLocationEnabled(true);
        console.log("Initial location accessed:", position.coords);
      },
      (error) => {
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Start watching position for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLocationEnabled(true);
        console.log("Location updated in real-time:", position.coords);
      },
      (error) => {
        handleLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        distanceFilter: 10 // Update location when moved by 10 meters
      }
    );
  };

  // Handle location errors
  const handleLocationError = (error) => {
    setLocationEnabled(false);
    switch(error.code) {
      case error.PERMISSION_DENIED:
        setLocationError("Location access denied. Please enable location to submit entries.");
        break;
      case error.POSITION_UNAVAILABLE:
        setLocationError("Location information is unavailable. Please check your GPS.");
        break;
      case error.TIMEOUT:
        setLocationError("Location request timed out. Please try again.");
        break;
      default:
        setLocationError("An unknown error occurred while getting location.");
    }
    console.error("Location error:", error);
  };

  // Retry location access
  const handleRetryLocation = () => {
    // Clear existing watch
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    // Restart tracking
    startRealTimeLocationTracking();
  };

  if (!dashboardUser) {
    return <h2>No User Found. Please Login Again.</h2>;
  }

  const handleSubmitDailyLog = async (formData) => {
    if (!locationEnabled || !currentLocation) {
      alert("Please enable location access before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the most current location before submission
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const latestLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      // Update state with latest location
      setCurrentLocation(latestLocation);

      const submissionData = {
        vendorShopName: formData.vendorShopName,
        vendorName: formData.vendorName,
        contactNumber: formData.contactNumber,
        mailId: formData.mailId || "",
        doorNumber: formData.doorNumber,
        streetName: formData.streetName,
        areaName: formData.areaName,
        pinCode: formData.pinCode,
        state: formData.state,
        status: formData.status,
        review: formData.review || "",
        // Location data
        latitude: latestLocation.latitude,
        longitude: latestLocation.longitude,
        locationAccuracy: latestLocation.accuracy,
        // User info
        executiveId: dashboardUser.userCode,
        executiveName: dashboardUser.userCode, // You might want to get actual name from user object
        submittedAt: new Date().toISOString()
      };

      console.log('Submitting to API:', submissionData);
      
      const response = await axios.post(
        "https://mft-zwy7.onrender.com/api/form",
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      
      // You can add success handling here (reset form, show success message, etc.)

    } catch (error) {
      console.error("Error submitting form:", error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(`Server error: ${error.response.data.message || error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="executive-dashboard">
        <div className="card">
          <h1>Welcome {dashboardUser.userCode}!</h1>
          <button onClick={logout} style={{ float: 'right' }}>Logout</button>
        </div>

        {/* Location Status Banner */}
        <div className={`location-banner ${locationEnabled ? 'success' : 'error'}`} 
             style={{
               padding: '15px 20px',
               marginBottom: '20px',
               borderRadius: '8px',
               backgroundColor: locationEnabled ? '#d4edda' : '#f8d7da',
               color: locationEnabled ? '#155724' : '#721c24',
               border: `1px solid ${locationEnabled ? '#c3e6cb' : '#f5c6cb'}`,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               flexWrap: 'wrap'
             }}>
          <div>
            <strong>📍 Real-time Location:</strong>{' '}
            {locationEnabled && currentLocation ? (
              <>
                <span style={{ fontWeight: 'bold', color: '#28a745' }}>● LIVE</span>
                <br />
                <small>
                  Lat: {currentLocation.latitude.toFixed(6)}, 
                  Lng: {currentLocation.longitude.toFixed(6)} 
                  (Accuracy: ±{Math.round(currentLocation.accuracy)}m)
                  <br />
                  Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
                </small>
              </>
            ) : (
              <span>{locationError || "Requesting location access..."}</span>
            )}
          </div>
          
          {!locationEnabled && (
            <button 
              onClick={handleRetryLocation}
              style={{
                padding: '8px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🔄 Retry Location Access
            </button>
          )}

          {locationEnabled && (
            <button 
              onClick={handleRetryLocation}
              style={{
                padding: '5px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                marginLeft: '10px'
              }}
              title="Refresh location manually"
            >
              🔄 Refresh
            </button>
          )}
        </div>

        <LocationForm 
          onSubmit={handleSubmitDailyLog} 
          locationEnabled={locationEnabled}
          isSubmitting={isSubmitting}
          userCode={dashboardUser.userCode}
          currentLocation={currentLocation}
        />

      </div>
    </>
  );
};

export default ExecutiveDashboard;