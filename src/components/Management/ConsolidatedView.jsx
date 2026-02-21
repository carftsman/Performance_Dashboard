// import React from 'react';
// import { consolidatedData } from '../../mockData/management';

// const ConsolidatedView = ({ onExecutiveClick }) => {
//   return (
//     <div className="card">
//       <h2 className="card-title">Consolidated Performance View</h2>
      
//       <div className="grid grid-4 mb-30">
//         <div className="stat-card">
//           <div className="stat-value">{consolidatedData.summary.totalTarget.toLocaleString()}</div>
//           <div className="stat-label">Total Target</div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-value stat-positive">
//             {consolidatedData.summary.totalAchieved.toLocaleString()}
//           </div>
//           <div className="stat-label">Total Achieved</div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-value stat-negative">
//             {consolidatedData.summary.totalBalance.toLocaleString()}
//           </div>
//           <div className="stat-label">Total Balance</div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-value">{consolidatedData.summary.overallAchievement}%</div>
//           <div className="stat-label">Overall Achievement</div>
//         </div>
//       </div>
      
//       <h3 style={{ marginBottom: '15px' }}>Team-wise Performance</h3>
//       <div className="table-container">
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Team</th>
//               <th>Executives</th>
//               <th>Target</th>
//               <th>Achieved</th>
//               <th>Balance</th>
//               <th>Achievement %</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {consolidatedData.teams.map(team => {
//               const achievement = ((team.achieved / team.target) * 100).toFixed(1);
//               return (
//                 <tr key={team.teamName} className="clickable-row">
//                   <td><strong>{team.teamName}</strong></td>
//                   <td>{team.executives}</td>
//                   <td>{team.target.toLocaleString()}</td>
//                   <td style={{ color: '#00b894', fontWeight: 'bold' }}>
//                     {team.achieved.toLocaleString()}
//                   </td>
//                   <td style={{ color: team.balance > 0 ? '#e17055' : '#00b894' }}>
//                     {team.balance.toLocaleString()}
//                   </td>
//                   <td>
//                     <span style={{
//                       color: achievement >= 95 ? '#00b894' : achievement >= 85 ? '#fdcb6e' : '#e17055',
//                       fontWeight: 'bold'
//                     }}>
//                       {achievement}%
//                     </span>
//                   </td>
//                   <td>
//                     <button 
//                       onClick={() => alert(`Drill down to ${team.teamName}`)}
//                       className="btn"
//                       style={{ padding: '5px 10px', fontSize: '12px' }}
//                     >
//                       Drill Down
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
      
//       <div style={{ marginTop: '30px' }}>
//         <h3 style={{ marginBottom: '15px' }}>🏆 Top Performing Executives</h3>
//         <div className="grid grid-3">
//           {consolidatedData.topExecutives.map((exec, index) => (
//             <div 
//               key={index} 
//               className="card"
//               onClick={() => alert(`Viewing ${exec.name} details`)}
//               style={{ cursor: 'pointer' }}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div>
//                   <div style={{ fontWeight: 'bold' }}>{exec.name}</div>
//                   <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
//                     {index === 0 ? '🥇 Top Performer' : index === 1 ? '🥈 Runner Up' : '🥉 Third Place'}
//                   </div>
//                 </div>
//                 <div style={{
//                   backgroundColor: '#00b894',
//                   color: 'white',
//                   padding: '8px 15px',
//                   borderRadius: '20px',
//                   fontWeight: 'bold'
//                 }}>
//                   {exec.achievement}%
//                 </div>
//               </div>
//               <button 
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   alert(`Viewing executive report for ${exec.name}`);
//                 }}
//                 className="btn btn-success"
//                 style={{ width: '100%', marginTop: '15px', padding: '8px' }}
//               >
//                 View Report
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConsolidatedView;