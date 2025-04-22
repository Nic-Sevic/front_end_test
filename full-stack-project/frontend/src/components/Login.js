import { useState } from 'react';
import { useCompany, useAuth } from '../context/context';

const Login = () => {
  const [email, setEmail] = useState('test@example.com'); // TODO remove these default values
  const [password, setPassword] = useState('password');
  const { setCompanyData } = useCompany();
  const { setIsAuthenticated, getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getToken(email, password);
      
      setCompanyData(prev => ({
        ...prev,
        company_id: response.company_id,
        company_name: response.company_name
      }));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form id='login' onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
