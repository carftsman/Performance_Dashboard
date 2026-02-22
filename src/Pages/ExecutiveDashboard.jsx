
// import React, { useEffect, useState } from "react";
// import LocationForm from "../components/Executive/LocationForm";
// import { formService } from "../Services/form.service";

// const ExecutiveDashboard = ({ user, logout }) => {
//   // ─── Location state ────────────────────────────────────────────────────────
//   const [currentLocation, setCurrentLocation] = useState(null);   // raw GPS coords
//   const [geocodedAddress, setGeocodedAddress] = useState(null);   // parsed address for autofill
//   const [locationError, setLocationError] = useState("");
//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   // ─── Form submission state ─────────────────────────────────────────────────
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const dashboardUser = user;

//   if (!dashboardUser) {
//     return <h2>No User Found. Please Login Again.</h2>;
//   }

//   // ─── One-shot GPS + reverse geocode ────────────────────────────────────────
//   const handleGetLocation = () => {
//   if (!navigator.geolocation) {
//     setLocationError("Geolocation is not supported by your browser.");
//     return;
//   }

//   setIsGettingLocation(true);
//   setLocationError("");
//   setCurrentLocation(null);
//   setGeocodedAddress(null);

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       const { latitude, longitude, accuracy } = position.coords;
//       setCurrentLocation({ latitude, longitude, accuracy });

//       try {
//         const apiKey = "AIzaSyAt59NjjnVtI5PfvhkQKFDLeBFfCTW-mxg";
//         const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

//         const res = await fetch(url);
//         const data = await res.json();

//         if (data.status === "OK") {
//           const result = data.results[0];

//           // Extract address components
//           const components = result.address_components;

//           const getComponent = (type) =>
//             components.find((c) => c.types.includes(type))?.long_name || "";

//           const address = {
//             streetName: result.formatted_address || "",
//             areaName: getComponent("sublocality") || getComponent("locality"),
//             pinCode: getComponent("postal_code"),
//             state: getComponent("administrative_area_level_1"),
//           };

//           setGeocodedAddress(address);
//         } else {
//           setLocationError("Location captured ✓ but address lookup failed.");
//         }
//       } catch (error) {
//         setLocationError("Address lookup failed.");
//       } finally {
//         setIsGettingLocation(false);
//       }
//     },
//     (error) => {
//       setLocationError("Location permission denied or unavailable.");
//       setIsGettingLocation(false);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 15000,
//       maximumAge: 0,
//     }
//   );
// };


//   // ─── Form submission ────────────────────────────────────────────────────────
//   const handleSubmitDailyLog = async (formData) => {
//     if (!currentLocation) {
//       alert('Please click "Get Current Location" before submitting.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const submissionData = {
//         vendorShopName: formData.vendorShopName,
//         vendorName:     formData.vendorName,
//         contactNumber:  formData.contactNumber,
//         mailId:         formData.mailId || "",
//         vendorLocation: `${currentLocation.latitude}, ${currentLocation.longitude}`,
//         doorNumber:     formData.doorNumber,
//         streetName:     formData.streetName,
//         areaName:       formData.areaName,
//         pinCode:        formData.pinCode,
//         state:          formData.state,
//         status:         formData.status,
//         review:         formData.review || "",
//       };

//       console.log("[Submit] Payload to backend:", JSON.stringify(submissionData, null, 2));

//       const response = await formService.createForm(submissionData);
//       console.log("[Submit] Success:", response);
//       alert("Form submitted successfully!");

//     } catch (error) {
//       console.error("[Submit] Error:", error);
//       alert(`Error: ${error.message || "Something went wrong. Please try again."}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ─── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <>
//       {/* Responsive wrapper */}
//       <style>{`
//         .exec-dashboard {
//           width: 100%;
//           max-width: 960px;
//           margin: 0 auto;
//           padding: 16px;
//           box-sizing: border-box;
//         }
//         .exec-header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           flex-wrap: wrap;
//           gap: 12px;
//           padding: 16px 20px;
//           margin-bottom: 16px;
//           background: #fff;
//           border-radius: 8px;
//           box-shadow: 0 1px 4px rgba(0,0,0,.08);
//         }
//         .exec-header h1 {
//           margin: 0;
//           font-size: clamp(1rem, 4vw, 1.5rem);
//           color: #1a1a2e;
//         }
//         .exec-logout-btn {
//           padding: 8px 18px;
//           background: #dc3545;
//           color: #fff;
//           border: none;
//           border-radius: 6px;
//           font-size: 14px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: background 0.2s;
//           white-space: nowrap;
//         }
//         .exec-logout-btn:hover { background: #c82333; }
//         .exec-location-strip {
//           display: flex;
//           align-items: flex-start;
//           gap: 10px;
//           padding: 12px 16px;
//           margin-bottom: 16px;
//           border-radius: 8px;
//           font-size: 13px;
//           line-height: 1.5;
//           flex-wrap: wrap;
//         }
//         .exec-location-strip.success {
//           background: #d4edda;
//           color: #155724;
//           border: 1px solid #c3e6cb;
//         }
//         .exec-location-strip.warning {
//           background: #fff3cd;
//           color: #856404;
//           border: 1px solid #ffeeba;
//         }
//         @media (max-width: 480px) {
//           .exec-dashboard { padding: 10px; }
//           .exec-header { padding: 12px 14px; }
//         }
//       `}</style>

//       <div className="exec-dashboard">

//         {/* Header */}
//         <div className="exec-header">
//           <h1>Welcome, {dashboardUser.userCode}!</h1>
//           <button className="exec-logout-btn" onClick={logout}>Logout</button>
//         </div>

//         {/* Location status strip — address only, no lat/lng */}
//         {(currentLocation || locationError) && (
//           <div className={`exec-location-strip ${currentLocation ? "success" : "warning"}`}>
//             {currentLocation ? (
//               <>
//                 <span>✅</span>
//                 <span>
//                   <strong>Location captured.</strong>{" "}
//                   {geocodedAddress && (geocodedAddress.areaName || geocodedAddress.state) ? (
//                     <>
//                       {geocodedAddress.areaName}
//                       {geocodedAddress.areaName && geocodedAddress.streetName ? " — " : ""}
//                       {geocodedAddress.streetName}
//                       {(geocodedAddress.areaName || geocodedAddress.streetName) && geocodedAddress.state ? ", " : ""}
//                       {geocodedAddress.state}
//                       {geocodedAddress.pinCode ? ` — ${geocodedAddress.pinCode}` : ""}
//                     </>
//                   ) : (
//                     "Address fields have been auto-filled below."
//                   )}
//                 </span>
//               </>
//             ) : (
//               <><span>⚠️</span><span>{locationError}</span></>
//             )}
//           </div>
//         )}

//         {/* Form */}
//         <LocationForm
//           onSubmit={handleSubmitDailyLog}
//           locationCaptured={!!currentLocation}
//           isSubmitting={isSubmitting}
//           userCode={dashboardUser.userCode}
//           geocodedAddress={geocodedAddress}
//           onGetLocation={handleGetLocation}
//           isGettingLocation={isGettingLocation}
//         />

//       </div>
//     </>
//   );
// };

// export default ExecutiveDashboard;





import React, { useEffect, useState } from "react";
import VendorForm from "../components/Executive/VendorForm";
import { formService } from "../Services/form.service";

const ExecutiveDashboard = ({ user, logout }) => {

  const [locationAllowed, setLocationAllowed] = useState(false);
  const [workStarted, setWorkStarted] = useState(false);

  const [workStartLocation, setWorkStartLocation] = useState(null);
  const [vendorLocation, setVendorLocation] = useState(null);

  const [geocodedAddress, setGeocodedAddress] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return <h2>No User Found. Please Login Again.</h2>;

  /* =========================================
     LOAD HISTORY (RESTORED)
  ========================================== */
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await formService.getMyHistory();
      setHistory(data || []);
    } catch (error) {
      console.error("History load error:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  /* =========================================
     ENABLE LOCATION
  ========================================== */
  const handleEnableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationAllowed(true);
        alert("Location Permission Granted ✅");
      },
      () => alert("Location Permission Denied ❌")
    );
  };

  /* =========================================
     START WORK (Store once)
  ========================================== */
  const handleStartWork = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const startLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };

        setWorkStartLocation(startLocation);
        setWorkStarted(true);
        setShowForm(true);
      },
      () => alert("Unable to fetch start location")
    );
  };

  /* =========================================
     CAPTURE VENDOR LOCATION + AUTOFILL
  ========================================== */
  const captureVendorLocation = () => {

    setIsGettingLocation(true);
    setVendorLocation(null);
    setGeocodedAddress(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {

        const { latitude, longitude } = position.coords;

        const visitLocation = {
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        };

        setVendorLocation(visitLocation);

        try {
          const apiKey = "AIzaSyAt59NjjnVtI5PfvhkQKFDLeBFfCTW-mxg";
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

          const res = await fetch(url);
          const data = await res.json();

          if (data.status === "OK") {

            const result = data.results[0];
            const components = result.address_components;

            const getComponent = (type) =>
              components.find((c) => c.types.includes(type))?.long_name || "";

            const address = {
              streetName: result.formatted_address || "",
              areaName: getComponent("sublocality") || getComponent("locality"),
              pinCode: getComponent("postal_code"),
              state: getComponent("administrative_area_level_1"),
            };

            setGeocodedAddress(address);
          }

        } catch (error) {
          console.error("Reverse geocode failed");
        }

        setIsGettingLocation(false);
      },
      () => {
        alert("Unable to capture vendor location");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* =========================================
     SUBMIT FORM
  ========================================== */
  const handleSubmitDailyLog = async (formData) => {

    if (!vendorLocation) {
      alert("Please capture vendor location");
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        workStartLocation,  // ✅ stored once
        vendorLocation      // ✅ per vendor visit
      };

      await formService.createForm(submissionData);

      alert("Form submitted successfully!");

      setVendorLocation(null);
      setGeocodedAddress(null);
      setShowForm(false);

      loadHistory(); // refresh history

    } catch (error) {
      alert("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        padding: "15px 20px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>
        <h2>Welcome, {user.name}</h2>

        <div style={{ display: "flex", gap: "10px" }}>

          {!locationAllowed && (
            <button onClick={handleEnableLocation}
              style={{ padding: "8px 18px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px" }}>
              Enable Location
            </button>
          )}

          {!workStarted && (
            <button
              disabled={!locationAllowed}
              onClick={handleStartWork}
              style={{
                padding: "8px 18px",
                background: locationAllowed ? "#28a745" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "6px"
              }}>
              ▶ Start Work
            </button>
          )}

          <button
            onClick={logout}
            style={{
              padding: "8px 18px",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "6px"
            }}>
            Logout
          </button>
        </div>
      </div>

      {/* FORM SECTION */}
      {showForm && (
        <VendorForm
          onSubmit={handleSubmitDailyLog}
          locationCaptured={!!vendorLocation}
          onGetLocation={captureVendorLocation}
          isGettingLocation={isGettingLocation}
          isSubmitting={isSubmitting}
          geocodedAddress={geocodedAddress}
          onBack={() => setShowForm(false)}
        />
      )}

      {/* HISTORY SECTION (RESTORED) */}
     {/* HISTORY SECTION */}
{!showForm && (
  <div style={{ marginTop: "30px" }}>

    <h3 style={{ marginBottom: "20px" }}>📋 My Submitted Forms</h3>

    {loadingHistory ? (
      <p>Loading...</p>
    ) : history.length === 0 ? (
      <p>No forms submitted yet.</p>
    ) : (

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px"
        }}
      >

        {history.map((form) => (

          <div
            key={form.id}
            style={{
              background: "#fff",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "0.3s"
            }}
          >

            {/* CARD HEADER */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}>
              <span style={{ fontWeight: "600" }}>#{form.id}</span>

              <span style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                background:
                  form.status === "INTERESTED"
                    ? "#d4edda"
                    : form.status === "NOT_INTERESTED"
                    ? "#f8d7da"
                    : "#cce5ff",
                color:
                  form.status === "INTERESTED"
                    ? "#155724"
                    : form.status === "NOT_INTERESTED"
                    ? "#721c24"
                    : "#004085"
              }}>
                {form.status}
              </span>
            </div>

            {/* SHOP NAME */}
            <h3 style={{ marginBottom: "10px" }}>
              🏪 {form.vendorShopName || "Unnamed Shop"}
            </h3>

            {/* DETAILS */}
            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>

              <div>👤 <strong>Owner:</strong> {form.vendorName}</div>

              <div>📞 <strong>Contact:</strong> {form.contactNumber}</div>

              <div>📍 <strong>Location:</strong> {form.areaName}, {form.state}</div>

              <div>📅 <strong>Date:</strong>{" "}
                {new Date(form.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </div>

              <div>👨‍💼 <strong>Team Lead:</strong> {form.teamleadName}</div>

              {form.tag && (
                <div style={{ marginTop: "6px" }}>
                  🏷 <strong>Tag:</strong>{" "}
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "12px",
                    background:
                      form.tag === "YELLOW"
                        ? "#fff3cd"
                        : "#e2e3e5",
                    color:
                      form.tag === "YELLOW"
                        ? "#856404"
                        : "#383d41",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {form.tag}
                  </span>
                </div>
              )}

              {form.review && (
                <div style={{
                  marginTop: "10px",
                  background: "#f8f9fa",
                  padding: "8px",
                  borderRadius: "6px"
                }}>
                  ✍ <strong>Review:</strong> {form.review}
                </div>
              )}

            </div>

          </div>

        ))}

      </div>
    )}

  </div>
)}

    </div>
  );
};

export default ExecutiveDashboard;