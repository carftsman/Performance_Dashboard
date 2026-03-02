
import MainLayout from '../common/Layout/MainLayout';
import VendorForm from '../Executive/VendorForm';
import { useState } from 'react';

 

const AddEntryView = ({
  dashboardUser,
  logout,
  selectedExecutive,
  handleFormSubmit,
  onBack,
  submitSuccess,
  isSubmitting,
   setIsSubmitting
}) => {
  if (!selectedExecutive) return null;
 const [isGettingLocation, setIsGettingLocation] = useState(false);
 const [vendorLocation, setVendorLocation] = useState(null);
  const [geocodedAddress, setGeocodedAddress] = useState(null);
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
  
        // ✅ Backend expects flat latitude & longitude
        latitude: vendorLocation.latitude,
        longitude: vendorLocation.longitude,
  
        // ✅ Backend expects vendorLocation as STRING
        vendorLocation:
          geocodedAddress?.areaName ||
          geocodedAddress?.streetName ||
          "Current Location",
  
        // DO NOT send workStartLocation
      };
  
      console.log("Submitting to backend:", submissionData);
  
      await formService.createForm(submissionData);
  
      alert("Form submitted successfully!");
  
      setVendorLocation(null);
      setGeocodedAddress(null);
      setShowForm(false);
  
      loadHistory();
  
    } catch (error) {
      console.error("Submission failed:", error.response?.data);
      alert("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="teamlead-dashboard">
        <div className="card">
          
          {/* Header */}
          <div className="form-header">
            <div className="form-header-left">
              <button onClick={onBack} className="btn btn-secondary">
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {/* Success/Error Message */}
          {submitSuccess && (
            <div
              className={`alert ${
                submitSuccess.type === "success"
                  ? "alert-success"
                  : "alert-error"
              }`}
            >
              {submitSuccess.message}
            </div>
          )}

           <VendorForm
              onSubmit={handleSubmitDailyLog}
              locationCaptured={!!vendorLocation}
              onGetLocation={captureVendorLocation}
              isGettingLocation={isGettingLocation}
              isSubmitting={isSubmitting}
              geocodedAddress={geocodedAddress}
              onBack={() => setShowForm(false)}
            />

        </div>
      </div>
    </MainLayout>
  );
};

export default AddEntryView;