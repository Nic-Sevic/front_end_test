import { useEffect } from 'react';
import MyOrgChart from './OrgChart';
import MyEmployeeManagement from './EmployeeManagement';
import Login from './Login';
import { CompanyProvider } from '../context/context';
import { AuthProvider, useAuth } from '../context/context';
import axios from 'axios';
import api from '../services/apiClient';

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

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    console.log("Checking authentication status");
    const getProtectedData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/protected", { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error("Access denied", error.response);
      }
    };

    getProtectedData();
    console.log(isAuthenticated);
  }, [ setIsAuthenticated ]);

  const handleLogout = async () => {
    try {
      const response = await api.post('logout');
      console.log(response);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
  

  return (
    <CompanyProvider>
      {isAuthenticated ? 
      (
      <div>
        <div id='logout'> <button onClick={ handleLogout }> Log Out </button></div>
        <LoggedInApp /> 
      </div>
      ) : 
      <LoginPage />}
    </CompanyProvider>
  );
};

const RootComponent = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootComponent;
