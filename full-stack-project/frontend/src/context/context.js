import React, { createContext, useContext, useState } from 'react';
import { apiService } from '../services/apiClient';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
    const [companyData, setCompanyData] = useState({
        company_id: null,
        company_name: '',
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
          
          // Refresh employee data after successful update
          await fetchEmployees(companyData.company_id);
          
          return response;
      } catch (error) {
          console.error('Error updating employee:', error);
          throw error;
      }
  };

  const getPerformanceMetricsByEmployeeId = async (employeeId) => {
    try {
        const response = await apiService.getPerformanceMetricsByEmployeeId(employeeId);
        return response;
    } catch (error) {
        console.error('Error fetching performance metrics:', error);
        throw error;
    }
};

  const updateMetrics = async (data) => {
    try {
        const response = await apiService.addPerformanceMetric(data);
        return response;
    } catch (error) {
        console.error('Error updating metrics:', error);
        throw error;
    }
  };

  const addEmployee = async (data) => {
    try {
        const response = await apiService.createEmployee(data);
        return response;
    } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
    }
  };

  const login = async (credentials) => {
    try {
        const response = await apiService.login(credentials);
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
  }

    return (
        <CompanyContext.Provider value={{ companyData, fetchEmployees, updateEmployee, getPerformanceMetricsByEmployeeId, updateMetrics, addEmployee, login, setCompanyData, loading }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => useContext(CompanyContext);
