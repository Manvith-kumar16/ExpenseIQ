const ExpenseSkeleton = () => {
  return (
    <div className="table-responsive skeleton-wrapper mb-4">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th className="border-0"><div className="skeleton skeleton-text w-50"></div></th>
            <th className="border-0"><div className="skeleton skeleton-text w-75"></div></th>
            <th className="border-0"><div className="skeleton skeleton-text w-50"></div></th>
            <th className="border-0"><div className="skeleton skeleton-text w-50"></div></th>
            <th className="border-0"><div className="skeleton skeleton-text w-50"></div></th>
            <th className="border-0"><div className="skeleton skeleton-text w-50"></div></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index}>
              <td><div className="skeleton skeleton-text"></div></td>
              <td>
                <div className="skeleton skeleton-text mb-2"></div>
                <div className="skeleton skeleton-text w-75"></div>
              </td>
              <td><div className="skeleton skeleton-badge"></div></td>
              <td><div className="skeleton skeleton-text w-75"></div></td>
              <td><div className="skeleton skeleton-text w-50"></div></td>
              <td><div className="skeleton skeleton-btn"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseSkeleton;
