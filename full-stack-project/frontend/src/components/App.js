import { Route, BrowserRouter, Routes } from 'react-router';
import MyOrgChart from './OrgChart';
import MyEmployeeManagement from './EmployeeManagement';
import Login from './Login';
import { CompanyProvider } from '../context/context';

const LoggedInApp = () => (
    <div>
      <h1>Organizational Chart</h1>
      <div id='orgChart'><MyOrgChart/></div>
      <h1>Employee Management & Performance</h1>
      <div id='employeeManagement'><MyEmployeeManagement/></div>
    </div>
);

const LoginPage = () => (
    <div>
      <Login />
    </div>
);

const whichDisplay = () => {
  if (localStorage.getItem('token')) {
    return LoggedInApp();
  } else {
    return LoginPage();
  }
}

const App = () => {
  
    return (
        <CompanyProvider>
          {whichDisplay()}
        </CompanyProvider>
    );
};

export default App;
