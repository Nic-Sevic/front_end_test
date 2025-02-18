import React, { useState, useEffect } from 'react';
import { useCompany } from '../context/context';
import api from '../services/apiClient';

const MyEmployeeManagement = () => {
  const { companyData, loading, fetchEmployees, updateEmployee, getPerformanceMetricsByEmployeeId, updateMetrics, addEmployee } = useCompany();
  const [editingEmployee, setEditingEmployee] = useState('');
  const [formData, setFormData] = useState({});
  const [formDataNew, setFormDataNew] = useState({});
  const [editingMetricId, setEditingMetricId] = useState(null);
  const [metricFormData, setMetricFormData] = useState({});
  const [metricsData, setMetricsData] = useState([]);

  const handleEditClick = (employee) => {
    setEditingEmployee(employee.id);
    setFormData(employee);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await updateEmployee(editingEmployee, formData);
    }
    catch (error) {
      console.error('Error updating employee:', error);
    }
    await fetchEmployees(companyData.company_id);
    setEditingEmployee('');
  };

  const viewMetrics = async (employee) => {
      try {
        const metrics = await getPerformanceMetricsByEmployeeId(employee.id);
        setMetricsData(metrics);
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
        setMetricsData([]); // Clear out if error occurs
      }
    };

  const handleSaveMetrics = async (employeeID) => {
    try {
      await updateMetrics(metricFormData);
      // Re-fetch the metrics for the current employee
      await viewMetrics({ id: parseInt(employeeID, 10) });
      setEditingMetricId(null);
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      const newEmployee = {
        name: formDataNew.name,
        email: formDataNew.email,
        title: formDataNew.title,
        manager_id: formDataNew.manager_id,
        company_id: companyData.company_id
      };
      await addEmployee(newEmployee);
      await fetchEmployees(companyData.company_id);
      setFormDataNew({});
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  // When the component mounts, fetch employee data if we have a company ID
  useEffect(() => {
    if (companyData.company_id) {
      fetchEmployees(companyData.company_id);
    }
  }, [companyData.company_id]); // Only re-run the effect if company_id changes

  if (loading.employeeData) {
    return <div>Loading employees...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Title</th>
            <th>Manager ID</th>
            <th>Performance Metrics</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {companyData.employeeData && companyData.employeeData.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>
                {editingEmployee === employee.id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  employee.name
                )}
              </td>
              <td>
                {editingEmployee === employee.id ? (
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  employee.email
                )}
              </td>
              <td>
                {editingEmployee === employee.id ? (
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  employee.title
                )}
              </td>
              <td>
                {editingEmployee === employee.id ? (
                  <select
                    name="manager_id"
                    value={formData.manager_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Manager</option>
                    {companyData.employeeData
                      .filter((emp) => emp.id !== employee.id)
                      .map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.id} - {emp.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  employee.manager_id
                )}
              </td>
              <td><button onClick={() => viewMetrics(employee)}>View</button></td>
              <td>
                {editingEmployee === employee.id ? (
                  <>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={() => setEditingEmployee(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditClick(employee)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formDataNew.name || ''}
                    onChange={(e) => setFormData({ ...formDataNew, name: e.target.value })}
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formDataNew.email || ''}
                    onChange={(e) => setFormData({ ...formDataNew, email: e.target.value })}
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formDataNew.title || ''}
                    onChange={(e) => setFormData({ ...formDataNew, title: e.target.value })}
                />
                <select
                    name="manager_id"
                    value={formDataNew.manager_id || ''}
                    onChange={(e) => setFormData({ ...formDataNew, manager_id: e.target.value })}
                >
                    <option value="">Select Manager</option>
                    {companyData.employeeData.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.id} - {emp.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddEmployee}>Add Employee</button>
            </div>

      {metricsData.length > 0 && (
          <div>
            <h2>Performance Metrics</h2>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Rating</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {metricsData.map((metric) => (
                  <tr key={metric.id}>
                    <td>
                      {editingMetricId === metric.id ? (
                        <input
                          type="text"
                          name="category"
                          value={metricFormData.category ?? metric.category}
                          onChange={(e) =>
                            setMetricFormData((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        metric.category
                      )}
                    </td>
                    <td>
                      {editingMetricId === metric.id ? (
                        <input
                          type="text"
                          name="rating"
                          value={metricFormData.rating ?? metric.rating}
                          onChange={(e) =>
                            setMetricFormData((prev) => ({
                              ...prev,
                              rating: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        metric.rating
                      )}
                    </td>
                    <td>{metric.updated_at}</td>
                    <td>
                      {editingMetricId === metric.id ? (
                        <>
                          <button onClick={() => handleSaveMetrics(metric.employee_id)}>Save</button>
                          <button onClick={() => setEditingMetricId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => {
                          setEditingMetricId(metric.id);
                          setMetricFormData({
                            category: metric.category,
                            rating: metric.rating,
                            employee_id: metric.employee_id
                          });
                        }}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

    </div>
  );
};

export default MyEmployeeManagement;
