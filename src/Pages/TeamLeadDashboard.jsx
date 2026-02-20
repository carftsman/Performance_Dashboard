
// import React, { useState, useEffect } from 'react';
// import MainLayout from '../components/common/Layout/MainLayout';
// import ExecutiveWorkView from '../components/TeamLead/ExecutiveWorkView';
// import axios from 'axios';

// const TeamLeadDashboard = ({ user, logout }) => {
//   const dashboardUser = user || JSON.parse(localStorage.getItem('user'));
  
//   const [viewMode, setViewMode] = useState('grid');
//   const [selectedExecutive, setSelectedExecutive] = useState(null);
//   const [executiveForms, setExecutiveForms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch all forms for the team lead
//   useEffect(() => {
//     fetchTeamLeadForms();
//   }, []);

//   const fetchTeamLeadForms = async () => {
//     try {
//       setLoading(true);
//       console.log('Calling API');
      
//       const response = await axios.get(
//         "https://mft-zwy7.onrender.com/api/teamlead/forms",
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//            withCredentials: true 
//         },
        
//       );

//       console.log("Team Lead Forms:", response.data);
      
//       const formsData = Array.isArray(response.data) ? response.data : [];
//       setExecutiveForms(formsData);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching team lead forms:", error);
//       setError("Failed to load team data. Please try again.");
//       setExecutiveForms([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Group forms by executive
//   const getExecutivesWithForms = () => {
//     const execMap = new Map();
    
//     executiveForms.forEach(form => {
//       const execId = form.executiveId;
//       if (!execMap.has(execId)) {
//         execMap.set(execId, {
//           id: execId,
//           name: form.executiveName || `Executive ${execId}`,
//           forms: []
//         });
//       }
//       execMap.get(execId).forms.push(form);
//     });

//     return Array.from(execMap.values());
//   };

//   const handleExecutiveClick = (executive) => {
//     setSelectedExecutive(executive);
//   };

//   const handleBackToTeam = () => {
//     setSelectedExecutive(null);
//   };

//   const handleRefresh = () => {
//     fetchTeamLeadForms();
//   };

//   // If an executive is selected, show their work view
//   if (selectedExecutive) {
//     return (
//       <MainLayout user={dashboardUser} logout={logout}>
//         <ExecutiveWorkView 
//           executive={selectedExecutive}
//           onBack={handleBackToTeam}
//           onRefresh={handleRefresh}
//         />
//       </MainLayout>
//     );
//   }

//   // Main team view
//   return (
//     <MainLayout user={dashboardUser} logout={logout}>
//       <div className="teamlead-dashboard">
//         {/* Header */}
//         <div className="card">
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             gap: '20px'
//           }}>
//             <div>
//               <h1>Team Lead Dashboard</h1>
//               <p style={{ color: '#666', marginTop: '5px' }}>
//                 Welcome back, {dashboardUser?.userCode || 'Team Lead'}
//               </p>
//             </div>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button 
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 style={{
//                   padding: '8px 16px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: loading ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 {loading ? 'Refreshing...' : 'Refresh Data'}
//               </button>
//               <div style={{ display: 'flex', gap: '5px' }}>
//                 <button 
//                   onClick={() => setViewMode('grid')}
//                   style={{
//                     padding: '8px 16px',
//                     backgroundColor: viewMode === 'grid' ? '#007bff' : '#6c757d',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Grid
//                 </button>
//                 <button 
//                   onClick={() => setViewMode('table')}
//                   style={{
//                     padding: '8px 16px',
//                     backgroundColor: viewMode === 'table' ? '#007bff' : '#6c757d',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer'
//                   }}
//                 >
//                   Table
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="card" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px' }}>
//             <p>{error}</p>
//             <button 
//               onClick={handleRefresh}
//               style={{
//                 padding: '5px 10px',
//                 backgroundColor: '#dc3545',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 marginTop: '10px',
//                 cursor: 'pointer'
//               }}
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
//             <h3>Loading team data...</h3>
//           </div>
//         )}

//         {/* Executive List */}
//         {!loading && !error && (
//           <>
//             {viewMode === 'grid' ? (
//               <div className="card">
//                 <h2 className="card-title">
//                   Team Executives ({getExecutivesWithForms().length})
//                 </h2>
//                 <div className="grid grid-3">
//                   {getExecutivesWithForms().map(executive => (
//                     <div 
//                       key={executive.id}
//                       onClick={() => handleExecutiveClick(executive)}
//                       style={{
//                         backgroundColor: 'white',
//                         borderRadius: '8px',
//                         padding: '20px',
//                         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                         cursor: 'pointer',
//                         border: '1px solid #e0e0e0'
//                       }}
//                     >
//                       <h3>{executive.name}</h3>
//                       <p>ID: {executive.id}</p>
//                       <p>Entries: {executive.forms.length}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="card">
//                 <h2 className="card-title">
//                   Executive Performance ({executiveForms.length} entries)
//                 </h2>
//                 <div style={{ overflowX: 'auto' }}>
//                   <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                     <thead>
//                       <tr style={{ backgroundColor: '#f8f9fa' }}>
//                         <th style={{ padding: '12px', textAlign: 'left' }}>Executive</th>
//                         <th style={{ padding: '12px', textAlign: 'left' }}>Shop Name</th>
//                         <th style={{ padding: '12px', textAlign: 'left' }}>Vendor</th>
//                         <th style={{ padding: '12px', textAlign: 'left' }}>Contact</th>
//                         <th style={{ padding: '12px', textAlign: 'left' }}>Area</th>
//                         <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
//                         <th style={{ padding: '12px', textAlign: 'left' }}>Tag</th>
//                         <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {executiveForms.map(form => (
//                         <tr key={form.id} style={{ borderBottom: '1px solid #dee2e6' }}>
//                           <td style={{ padding: '12px' }}>
//                             {form.executiveName || `Exec ${form.executiveId}`}
//                           </td>
//                           <td style={{ padding: '12px' }}>{form.vendorShopName}</td>
//                           <td style={{ padding: '12px' }}>{form.vendorName}</td>
//                           <td style={{ padding: '12px' }}>{form.contactNumber}</td>
//                           <td style={{ padding: '12px' }}>{form.areaName}</td>
//                           <td style={{ padding: '12px' }}>{form.status}</td>
//                           <td style={{ padding: '12px' }}>{form.tag || 'N/A'}</td>
//                           <td style={{ padding: '12px' }}>
//                             <button 
//                               style={{ 
//                                 padding: '6px 12px',
//                                 backgroundColor: '#007bff',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer'
//                               }}
//                               onClick={() => {
//                                 const exec = {
//                                   id: form.executiveId,
//                                   name: form.executiveName || `Executive ${form.executiveId}`,
//                                   forms: [form]
//                                 };
//                                 handleExecutiveClick(exec);
//                               }}
//                             >
//                               View
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </MainLayout>
//   );
// };

// export default TeamLeadDashboard;
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/Layout/MainLayout';
import ExecutiveWorkView from '../components/TeamLead/ExecutiveWorkView';
import axios from 'axios';

const TeamLeadDashboard = ({ user, logout }) => {
  const dashboardUser = user || JSON.parse(localStorage.getItem('user'));
  
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'work'
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [executiveForms, setExecutiveForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all forms for the team lead
  useEffect(() => {
    fetchTeamLeadForms();
  }, []);

  const fetchTeamLeadForms = async () => {
    try {
      setLoading(true);
      console.log('Calling API');
      
      const response = await axios.get(
        "https://mft-zwy7.onrender.com/api/teamlead/forms",
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true 
        }
      );

      console.log("Team Lead Forms:", response.data);
      
      const formsData = Array.isArray(response.data) ? response.data : [];
      setExecutiveForms(formsData);
      setError(null);
    } catch (error) {
      console.error("Error fetching team lead forms:", error);
      setError("Failed to load team data. Please try again.");
      setExecutiveForms([]);
    } finally {
      setLoading(false);
    }
  };

  // Group forms by executive
  const getExecutivesWithForms = () => {
    const execMap = new Map();
    
    executiveForms.forEach(form => {
      const execId = form.executiveId;
      if (!execMap.has(execId)) {
        execMap.set(execId, {
          id: execId,
          name: form.executiveName || `Executive ${execId}`,
          forms: [],
          stats: {
            total: 0,
            interested: 0,
            onboarded: 0,
            notInterested: 0
          }
        });
      }
      
      const exec = execMap.get(execId);
      exec.forms.push(form);
      exec.stats.total++;
      
      // Update stats based on status
      if (form.status === 'INTERESTED') exec.stats.interested++;
      else if (form.status === 'ONBOARDED') exec.stats.onboarded++;
      else if (form.status === 'NOT_INTERESTED') exec.stats.notInterested++;
    });

    return Array.from(execMap.values());
  };

  // Filter executives based on search
  const getFilteredExecutives = () => {
    const executives = getExecutivesWithForms();
    if (!searchTerm.trim()) return executives;
    
    const term = searchTerm.toLowerCase();
    return executives.filter(exec => 
      exec.name.toLowerCase().includes(term) ||
      exec.id.toString().includes(term)
    );
  };

  const handleExecutiveClick = (executive) => {
    setSelectedExecutive(executive);
    setViewMode('work');
  };

  const handleBackToTeam = () => {
    setSelectedExecutive(null);
    setViewMode('list');
  };

  const handleRefresh = () => {
    fetchTeamLeadForms();
  };

  // If in work mode, show executive work view
  if (viewMode === 'work' && selectedExecutive) {
    return (
      <MainLayout user={dashboardUser} logout={logout}>
        <ExecutiveWorkView 
          executive={selectedExecutive}
          onBack={handleBackToTeam}
          onRefresh={handleRefresh}
        />
      </MainLayout>
    );
  }

  // Main team view (List Mode)
  return (
    <MainLayout user={dashboardUser} logout={logout}>
      <div className="teamlead-dashboard">
        {/* Header */}
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1>Team Lead Dashboard</h1>
              <p style={{ color: '#666', marginTop: '5px' }}>
                Welcome back, {dashboardUser?.userCode || 'Team Lead'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleRefresh}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by executive name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px' }}>
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              style={{
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>Loading team data...</h3>
          </div>
        )}

        {/* Executive List */}
        {!loading && !error && (
          <div className="card">
            <h2 className="card-title">
              List of Executives ({getFilteredExecutives().length})
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {getFilteredExecutives().map(executive => (
                <div 
                  key={executive.id}
                  onClick={() => handleExecutiveClick(executive)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    {/* Avatar */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      {executive.name.charAt(0)}
                    </div>

                    {/* Executive Info */}
                    <div style={{ flex: 2 }}>
                      <h3 style={{ margin: 0, fontSize: '18px' }}>{executive.name}</h3>
                      <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
                        ID: {executive.id} • Total Entries: {executive.forms.length}
                      </p>
                    </div>

                    {/* Stats */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '30px',
                      flex: 3,
                      justifyContent: 'flex-end'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                          {executive.stats.interested}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Interested</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
                          {executive.stats.onboarded}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Onboarded</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>
                          {executive.stats.notInterested}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>Not Interested</div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div style={{ marginLeft: '20px', color: '#007bff', fontSize: '20px' }}>
                    →
                  </div>
                </div>
              ))}

              {getFilteredExecutives().length === 0 && (
                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  No executives found
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats Summary */}
        {!loading && !error && executiveForms.length > 0 && (
          <div className="card">
            <h3 className="card-title">Team Summary</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '20px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {getExecutivesWithForms().length}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Total Executives</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {executiveForms.length}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Total Forms</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                  {executiveForms.filter(f => f.status === 'INTERESTED' || f.status === 'ONBOARDED').length}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Successful</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
                  {executiveForms.filter(f => f.status === 'NOT_INTERESTED').length}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>Not Interested</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeamLeadDashboard;