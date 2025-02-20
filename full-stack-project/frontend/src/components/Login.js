import React, { useState } from 'react';
import { useCompany } from '../context/context';
import bcrypt from 'bcryptjs';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const { login, companyData, setCompanyData } = useCompany();

    const getSalt = async () => {
      try {
          const response = await fetch('/salt');
          const data = await response.json();
          return data.salt;
      }
      catch (error) {
          console.error('Error fetching salt:', error);
      }

    const handleLogin = async (e) => {
        e.preventDefault();
        // Hash the password in utf-8 before sending it to the backend
        const hashedPassword = bcrypt.hashSync(credentials.password, salt);
        const updatedCredentials = { ...credentials, password: hashedPassword };
        console.log(updatedCredentials);
         

        try {
            const response = await login(updatedCredentials);
            if (response && response.company_id) {
                setCompanyData(prev => ({
                    ...prev,
                    company_id: response.company_id,
                    // company_name: apiService.getCompanyById(response.company_id).then(res => res.name) TODO  - need to get from different call
                }));
                // document.cookie = `session=${response.sessionToken}; path=/`; TODO!!
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('An error occurred during login');
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
