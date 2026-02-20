
import React, { useEffect, useState } from "react";
import LocationForm from "../components/Executive/LocationForm";
import { formService } from "../Services/form.service";

const ExecutiveDashboard = ({ user, logout }) => {
  // ─── Location state ────────────────────────────────────────────────────────
  const [currentLocation, setCurrentLocation] = useState(null);   // raw GPS coords
  const [geocodedAddress, setGeocodedAddress] = useState(null);   // parsed address for autofill
  const [locationError, setLocationError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // ─── Form submission state ─────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dashboardUser = user;

  if (!dashboardUser) {
    return <h2>No User Found. Please Login Again.</h2>;
  }

  // ─── One-shot GPS + reverse geocode ────────────────────────────────────────
  const handleGetLocation = () => {
  if (!navigator.geolocation) {
    setLocationError("Geolocation is not supported by your browser.");
    return;
  }

  setIsGettingLocation(true);
  setLocationError("");
  setCurrentLocation(null);
  setGeocodedAddress(null);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setCurrentLocation({ latitude, longitude, accuracy });

      try {
        const apiKey = "AIzaSyAt59NjjnVtI5PfvhkQKFDLeBFfCTW-mxg";
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "OK") {
          const result = data.results[0];

          // Extract address components
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
        } else {
          setLocationError("Location captured ✓ but address lookup failed.");
        }
      } catch (error) {
        setLocationError("Address lookup failed.");
      } finally {
        setIsGettingLocation(false);
      }
    },
    (error) => {
      setLocationError("Location permission denied or unavailable.");
      setIsGettingLocation(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
};


  // ─── Form submission ────────────────────────────────────────────────────────
  const handleSubmitDailyLog = async (formData) => {
    if (!currentLocation) {
      alert('Please click "Get Current Location" before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = {
        vendorShopName: formData.vendorShopName,
        vendorName:     formData.vendorName,
        contactNumber:  formData.contactNumber,
        mailId:         formData.mailId || "",
        vendorLocation: `${currentLocation.latitude}, ${currentLocation.longitude}`,
        doorNumber:     formData.doorNumber,
        streetName:     formData.streetName,
        areaName:       formData.areaName,
        pinCode:        formData.pinCode,
        state:          formData.state,
        status:         formData.status,
        review:         formData.review || "",
      };

      console.log("[Submit] Payload to backend:", JSON.stringify(submissionData, null, 2));

      const response = await formService.createForm(submissionData);
      console.log("[Submit] Success:", response);
      alert("Form submitted successfully!");

    } catch (error) {
      console.error("[Submit] Error:", error);
      alert(`Error: ${error.message || "Something went wrong. Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Responsive wrapper */}
      <style>{`
        .exec-dashboard {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          padding: 16px;
          box-sizing: border-box;
        }
        .exec-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 16px 20px;
          margin-bottom: 16px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,.08);
        }
        .exec-header h1 {
          margin: 0;
          font-size: clamp(1rem, 4vw, 1.5rem);
          color: #1a1a2e;
        }
        .exec-logout-btn {
          padding: 8px 18px;
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .exec-logout-btn:hover { background: #c82333; }
        .exec-location-strip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          margin-bottom: 16px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.5;
          flex-wrap: wrap;
        }
        .exec-location-strip.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .exec-location-strip.warning {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
        }
        @media (max-width: 480px) {
          .exec-dashboard { padding: 10px; }
          .exec-header { padding: 12px 14px; }
        }
      `}</style>

      <div className="exec-dashboard">

        {/* Header */}
        <div className="exec-header">
          <h1>Welcome, {dashboardUser.userCode}!</h1>
          <button className="exec-logout-btn" onClick={logout}>Logout</button>
        </div>

        {/* Location status strip — address only, no lat/lng */}
        {(currentLocation || locationError) && (
          <div className={`exec-location-strip ${currentLocation ? "success" : "warning"}`}>
            {currentLocation ? (
              <>
                <span>✅</span>
                <span>
                  <strong>Location captured.</strong>{" "}
                  {geocodedAddress && (geocodedAddress.areaName || geocodedAddress.state) ? (
                    <>
                      {geocodedAddress.areaName}
                      {geocodedAddress.areaName && geocodedAddress.streetName ? " — " : ""}
                      {geocodedAddress.streetName}
                      {(geocodedAddress.areaName || geocodedAddress.streetName) && geocodedAddress.state ? ", " : ""}
                      {geocodedAddress.state}
                      {geocodedAddress.pinCode ? ` — ${geocodedAddress.pinCode}` : ""}
                    </>
                  ) : (
                    "Address fields have been auto-filled below."
                  )}
                </span>
              </>
            ) : (
              <><span>⚠️</span><span>{locationError}</span></>
            )}
          </div>
        )}

        {/* Form */}
        <LocationForm
          onSubmit={handleSubmitDailyLog}
          locationCaptured={!!currentLocation}
          isSubmitting={isSubmitting}
          userCode={dashboardUser.userCode}
          geocodedAddress={geocodedAddress}
          onGetLocation={handleGetLocation}
          isGettingLocation={isGettingLocation}
        />

      </div>
    </>
  );
};

export default ExecutiveDashboard;