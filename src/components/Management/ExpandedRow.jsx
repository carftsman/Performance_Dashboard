const ExpandedRow = ({ form }) => {
  return (
    <tr className="expanded-row">
      <td colSpan="9">
        <div className="details-grid">
          <div>Door: {form.doorNumber}</div>
          <div>Street: {form.streetName}</div>
          <div>PIN: {form.pinCode}</div>
          <div>BPO: {form.assignedBpoName}</div>
        </div>
      </td>
    </tr>
  );
};

export default ExpandedRow;