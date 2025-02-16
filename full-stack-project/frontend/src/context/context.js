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

    // const fetchOrgChart = async (companyId) => {
    //     setLoading(prev => ({ ...prev, orgChart: true }));
    //     try {
    //         const response = await apiService.getEmployeesByCompanyId(companyId);
    //         console.log('fetchOrg', response);
    //         setCompanyData(prev => ({
    //             ...prev,
    //             orgData: response.data
    //         }));
    //     } catch (error) {
    //         console.error('Error fetching org chart:', error);
    //     } finally {
    //         setLoading(prev => ({ ...prev, orgChart: false }));
    //     }
    // };

    return (
        <CompanyContext.Provider value={{ companyData, fetchEmployees, loading }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => useContext(CompanyContext);
