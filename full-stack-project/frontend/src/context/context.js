import React, { createContext, useContext, useState } from 'react';
import { apiService } from '../services/apiClient';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
    const [companyData, setCompanyData] = useState({
        company_id: 1,
        employeeData: [],
        orgData: []
    });

    const [loading, setLoading] = useState({
        employeeData: false,
        orgChart: false
    });

    const fetchEmployees = async (companyId) => {
        setLoading(prev => ({ ...prev, employeeData: true }));
        try {
            const response = await apiService.getEmployeesByCompanyId(companyId);
            console.log('fetchEmployees', response);
            setCompanyData(prev => ({
                ...prev,
                employeeData: response
              }));
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(prev => ({ ...prev, employeeData: false }));
        }
    };

    // add function to update employee.manager_id in backend when node is moved in org chart
    const updateEmployee = async (employeeId, data) => {
      try {
          // Use apiService.updateEmployee instead of apiService.put
          const response = await apiService.updateEmployee(employeeId, data);
          console.log('Employee updated successfully:', response);
          
          // Refresh employee data after successful update
          await fetchEmployees(companyData.company_id);
          
          return response;
      } catch (error) {
          console.error('Error updating employee:', error);
          throw error;
      }
  };

    return (
        <CompanyContext.Provider value={{ companyData, fetchEmployees, updateEmployee, loading }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => useContext(CompanyContext);
