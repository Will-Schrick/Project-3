import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { user, role, login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [timeoutReached, setTimeoutReached] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  // Redirect based on role once login & context are ready
  useEffect(() => {
    if (!loading && user && role) {
      if (role === 'Waiter') navigate('/waiter');
      else if (role === 'Chef') navigate('/kitchen');
      else if (role === 'Admin') navigate('/admin');
      else navigate('/');
    }
  }, [user, role, loading, navigate]);

  //  Timeout fallback after 9s if Firebase is too slow
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⏱️ Auth took too long');
        setTimeoutReached(true);
        setError('Login timeout. Please try again.');
      }
    }, 9000);
    return () => clearTimeout(timeout);
  }, [loading]);

  //spinner to help also
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Staff Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
