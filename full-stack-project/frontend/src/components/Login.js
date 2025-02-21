import { useState } from 'react';
import axios from 'axios';
import { useCompany, useAuth } from '../context/context';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setCompanyData } = useCompany();
  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/token', { //TODO change this to be with the rest of the routes in apiClient
        username: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true, // This is important to include the HttpOnly cookie
      });
      setCompanyData(prev => ({
        ...prev,
        company_id: response.data.company_id,
        company_name: response.data.company_name
      }));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
