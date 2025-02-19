import React from 'react';
import MyOrgChart from './OrgChart';
import MyEmployeeManagement from './EmployeeManagement';
import Login from './Login';
import { CompanyProvider } from '../context/context';


const App = () => {
    return (
        <CompanyProvider>
            <h1>Organizational Chart</h1>
            <div id='orgChart'><MyOrgChart/></div>
            <h1>Employee Management & Performance</h1>
            <div id='employeeManagement'><MyEmployeeManagement/></div>
        </CompanyProvider>
    );
};

export default App;
