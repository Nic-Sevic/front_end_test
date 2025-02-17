import { useEffect } from 'react';
import { useCompany } from '../context/context';

const MyEmployeeManagement = () => {
  const { companyData, loading, fetchEmployees } = useCompany();

  // When the component mounts, fetch employee data if we have a company ID
  useEffect(() => {
    if (companyData.company_id) {
      fetchEmployees(companyData.company_id);
    }
  }, [companyData.company_id]); // Only re-run the effect if company_id changes

  if (loading.employeeData) {
    return <div>Loading employees...</div>;
  }

//  // <div>
    //   {/* {companyData.employeeData && companyData.employeeData.map(employee => (
    //     <div key={employee.id}>{employee.name}</div>
    //   ))} */}
    // </div>

  // return table displaying employee data with columns for name, title, manager id, and performance metrics
  return (
    <div>
      <h1>Employee Management & Performance</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Manager ID</th>
            <th>Performance Metrics</th>
          </tr>
        </thead>
        <tbody>
          {companyData.employeeData && companyData.employeeData.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.title}</td>
              <td>{employee.manager_id}</td>
              <td>{employee.performance_metrics}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyEmployeeManagement;
