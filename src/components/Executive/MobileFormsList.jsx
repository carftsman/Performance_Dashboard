// const MobileFormsList = ({ forms, expandedRow, setExpandedRow }) => {
//   return (
//     <div className="mobile-view">
//       {forms.map(f => (
//         <div key={f.id} className="mobile-card">
//           <h4 onClick={() => setExpandedRow(expandedRow === f.id ? null : f.id)}>
//             {f.vendorShopName}
//           </h4>

//           {expandedRow === f.id && (
//             <div>
//               <p>{f.vendorName}</p>
//               <p>{f.contactNumber}</p>
//               <p>{f.status}</p>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MobileFormsList;