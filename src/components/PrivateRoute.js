import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children }) {
    const user = useSelector((state) => state.user.isLogin);

    if (!user) {
        return <Navigate to='/login' />;
    }

    return children;
}

export default PrivateRoute;
