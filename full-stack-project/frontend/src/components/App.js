import { useEffect } from 'react';
import MyOrgChart from './OrgChart';
import MyEmployeeManagement from './EmployeeManagement';
import Login from './Login';
import { CompanyProvider } from '../context/context';
import { AuthProvider, useAuth } from '../context/context';
import axios from 'axios';

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
        console.error("Access denied", error.response.data);
      }
    };

    getProtectedData();
  }, [setIsAuthenticated]);

  return (
    <CompanyProvider>
      {isAuthenticated ? <LoggedInApp /> : <LoginPage />}
    </CompanyProvider>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
