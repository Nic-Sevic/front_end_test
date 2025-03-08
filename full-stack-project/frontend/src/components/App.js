import MyOrgChart from './OrgChart';
import MyEmployeeManagement from './EmployeeManagement';
import Login from './Login';
import { CompanyProvider } from '../context/context';
import { AuthProvider, useAuth } from '../context/context';
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

  const handleLogout = async () => {
    try {
      await api.post('logout');
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
