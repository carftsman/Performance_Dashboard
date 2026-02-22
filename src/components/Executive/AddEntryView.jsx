
import MainLayout from '../common/Layout/MainLayout';
import VendorForm from '../Executive/VendorForm';


const AddEntryView = ({
  dashboardUser,
  logout,
  selectedExecutive,
  onBack,
  submitSuccess,
  handleFormSubmit,
  isSubmitting,
}) => {
  if (!selectedExecutive) return null;

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

          {/* Vendor Form */}
          <VendorForm
            onSubmit={handleFormSubmit}
            locationEnabled={true}
            isSubmitting={isSubmitting}
            userCode={selectedExecutive.name}
            initialData={null}
            readOnly={false}
            teamLeadMode={true}
            executiveId={selectedExecutive.id}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AddEntryView;