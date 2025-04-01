import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
  onLogout: () => void;
}

const Logout = ({ onLogout }: LogoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout(); // Call the onLogout prop to clear the token
    navigate('/login'); // Redirect to login page
  }, [onLogout, navigate]);

  return null;
};

export default Logout;