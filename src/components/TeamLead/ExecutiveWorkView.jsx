// import React, { useState } from 'react';
// import LocationForm from '../Executive/LocationForm';

// const ExecutiveWorkView = ({ executive, onBack, onRefresh }) => {
//   const [viewMode, setViewMode] = useState('list');
//   const [selectedForm, setSelectedForm] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const handleFormSubmit = async (formData) => {
//     console.log('Submitting form:', formData);
//     // API call would go here
//     setViewMode('list');
//     onRefresh();
//   };

//   const handleViewForm = (form) => {
//     setSelectedForm(form);
//     setViewMode('form');
//     setIsEditing(false);
//   };

//   const handleEditForm = (form) => {
//     setSelectedForm(form);
//     setViewMode('form');
//     setIsEditing(true);
//   };

//   const handleAddNew = () => {
//     setSelectedForm(null);
//     setViewMode('form');
//     setIsEditing(false);
//   };

//   return (
//     <div className="executive-work-view">
//       {/* Header */}
//       <div className="card">
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//             <button
//               onClick={onBack}
//               style={{
//                 padding: '8px 16px',
//                 backgroundColor: '#6c757d',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               ← Back
//             </button>
//             <div>
//               <h2>{executive.name}</h2>
//               <p>ID: {executive.id} • Entries: {executive.forms?.length || 0}</p>
//             </div>
//           </div>
          
//           {viewMode === 'list' && (
//             <button
//               onClick={handleAddNew}
//               style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#28a745',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               + Add Entry
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       {viewMode === 'list' ? (
//         <div className="card">
//           <h3>All Entries</h3>
//           <div style={{ overflowX: 'auto' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ backgroundColor: '#f8f9fa' }}>
//                   <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
//                   <th style={{ padding: '12px', textAlign: 'left' }}>Shop Name</th>
//                   <th style={{ padding: '12px', textAlign: 'left' }}>Vendor</th>
//                   <th style={{ padding: '12px', textAlign: 'left' }}>Contact</th>
//                   <th style={{ padding: '12px', textAlign: 'left' }}>Area</th>
//                   <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
//                   <th style={{ padding: '12px', textAlign: 'left' }}>Tag</th>
//                   <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {executive.forms?.map(form => (
//                   <tr key={form.id} style={{ borderBottom: '1px solid #dee2e6' }}>
//                     <td style={{ padding: '12px' }}>
//                       {new Date(form.createdAt).toLocaleDateString()}
//                     </td>
//                     <td style={{ padding: '12px' }}>{form.vendorShopName}</td>
//                     <td style={{ padding: '12px' }}>{form.vendorName}</td>
//                     <td style={{ padding: '12px' }}>{form.contactNumber}</td>
//                     <td style={{ padding: '12px' }}>{form.areaName}</td>
//                     <td style={{ padding: '12px' }}>{form.status}</td>
//                     <td style={{ padding: '12px' }}>{form.tag || 'N/A'}</td>
//                     <td style={{ padding: '12px' }}>
//                       <div style={{ display: 'flex', gap: '5px' }}>
//                         <button
//                           onClick={() => handleViewForm(form)}
//                           style={{
//                             padding: '4px 8px',
//                             backgroundColor: '#007bff',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: 'pointer'
//                           }}
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => handleEditForm(form)}
//                           style={{
//                             padding: '4px 8px',
//                             backgroundColor: '#ffc107',
//                             color: 'black',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: 'pointer'
//                           }}
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="card">
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//             <h3>{isEditing ? 'Edit Entry' : selectedForm ? 'View Entry' : 'Add New Entry'}</h3>
//             <button
//               onClick={() => setViewMode('list')}
//               style={{
//                 padding: '6px 12px',
//                 backgroundColor: '#6c757d',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer'
//               }}
//             >
//               Back to List
//             </button>
//           </div>
          
//           <LocationForm
//             onSubmit={handleFormSubmit}
//             locationEnabled={true}
//             isSubmitting={false}
//             userCode={executive.name}
//             initialData={selectedForm}
//             readOnly={!isEditing && selectedForm}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExecutiveWorkView;
import React, { useState } from 'react';
import LocationForm from '../Executive/LocationForm';

const ExecutiveWorkView = ({ executive, onBack, onRefresh }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [selectedForm, setSelectedForm] = useState(null);

  const handleFormSubmit = async (formData) => {
    console.log('Submitting form:', formData);
    // API call would go here
    setViewMode('list');
    onRefresh();
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    setViewMode('form');
  };

  const handleAddNew = () => {
    setSelectedForm(null);
    setViewMode('form');
  };

  return (
    <div className="executive-work-view">
      {/* Header */}
      <div className="card">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button
              onClick={onBack}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to List
            </button>
            <div>
              <h2 style={{ margin: 0 }}>{executive.name}'s Work</h2>
              <p style={{ margin: '5px 0 0', color: '#666' }}>
                Executive ID: {executive.id} • Total Entries: {executive.forms?.length || 0}
              </p>
            </div>
          </div>
          
          {viewMode === 'list' && (
            <button
              onClick={handleAddNew}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              + Add New Entry
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="card">
          <h3>All Entries by {executive.name}</h3>
          
          {/* Quick Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '15px',
            marginBottom: '30px',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                {executive.forms?.length || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Total Entries</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {executive.forms?.filter(f => f.status === 'INTERESTED').length || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Interested</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
                {executive.forms?.filter(f => f.status === 'ONBOARDED').length || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Onboarded</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                {executive.forms?.filter(f => f.status === 'NOT_INTERESTED').length || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Not Interested</div>
            </div>
          </div>

          {/* Forms Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Shop Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Vendor</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Contact</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Area</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Tag</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {executive.forms?.map(form => (
                  <tr key={form.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>
                      {new Date(form.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>{form.vendorShopName}</td>
                    <td style={{ padding: '12px' }}>{form.vendorName}</td>
                    <td style={{ padding: '12px' }}>{form.contactNumber}</td>
                    <td style={{ padding: '12px' }}>{form.areaName}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: 
                          form.status === 'INTERESTED' ? '#d4edda' :
                          form.status === 'ONBOARDED' ? '#cce5ff' :
                          form.status === 'NOT_INTERESTED' ? '#f8d7da' : '#e2e3e5',
                        color: 
                          form.status === 'INTERESTED' ? '#155724' :
                          form.status === 'ONBOARDED' ? '#004085' :
                          form.status === 'NOT_INTERESTED' ? '#721c24' : '#383d41'
                      }}>
                        {form.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: 
                          form.tag === 'GREEN' ? '#d4edda' :
                          form.tag === 'ORANGE' ? '#fff3cd' :
                          form.tag === 'YELLOW' ? '#fff3cd' :
                          form.tag === 'RED' ? '#f8d7da' : '#e2e3e5',
                        color: 
                          form.tag === 'GREEN' ? '#155724' :
                          form.tag === 'ORANGE' ? '#856404' :
                          form.tag === 'YELLOW' ? '#856404' :
                          form.tag === 'RED' ? '#721c24' : '#383d41',
                        fontWeight: 'bold'
                      }}>
                        {form.tag || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleViewForm(form)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3>{selectedForm ? 'View Entry' : 'Add New Entry'}</h3>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Back to List
            </button>
          </div>
          
          <LocationForm
            onSubmit={handleFormSubmit}
            locationEnabled={true}
            isSubmitting={false}
            userCode={executive.name}
            initialData={selectedForm}
            readOnly={!!selectedForm} // Read-only if viewing existing form
          />
        </div>
      )}
    </div>
  );
};

export default ExecutiveWorkView;