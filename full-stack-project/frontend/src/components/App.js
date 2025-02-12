import React from 'react';
import MyOrgChart from './OrgChart';

const employeeData = [
    { id: 1, name: 'Alice', title: 'CEO' },
    { id: 2, name: 'Bob', title: 'CTO', parentId: 1 },
    { id: 3, name: 'Charlie', title: 'CFO', parentId: 1 },
    { id: 4, name: 'David', title: 'Engineer', parentId: 2 },
    { id: 5, name: 'Eve', title: 'Engineer', parentId: 2 },
    { id: 6, name: 'Frank', title: 'Accountant', parentId: 3 }
];

const App = () => {
    return (
        <div>
            <div id='orgChart'><MyOrgChart/></div>
            <div id='employeeManagement'>MyEmployeeManagement</div>
        </div>
    );
};

export default App;
