import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../../context/AuthContextProvider';

export default function ProtectedRoute({ children }) {
  const { Token } = useContext(authContext);
  if (!Token) {
    return <Navigate to="/" replace />
  }else if (Token === 'null') {
    return <Navigate to="/login" replace />;
  }
  return children;
}