import ExpandedRow from "./ExpandedRow";

const FormsTable = ({ forms, expandedRow, toggleRowExpand, formatDate, getTagBadge }) => {
  return (
    <div className="card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Shop</th>
            <th>Vendor</th>
            <th>Executive</th>
            <th>Team Lead</th>
            <th>Location</th>
            <th>Tag</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {forms.map(form => (
            <>
              <tr key={form.id}>
                <td>{formatDate(form.createdAt)}</td>
                <td>{form.vendorShopName}</td>
                <td>{form.vendorName}</td>
                <td>{form.executiveName}</td>
                <td>{form.teamleadName}</td>
                <td>{form.areaName}</td>
                <td>{getTagBadge(form.tag)}</td>
                <td>
                  <button onClick={() => toggleRowExpand(form.id)}>
                    {expandedRow === form.id ? "-" : "+"}
                  </button>
                </td>
              </tr>

              {expandedRow === form.id && <ExpandedRow form={form} />}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormsTable;