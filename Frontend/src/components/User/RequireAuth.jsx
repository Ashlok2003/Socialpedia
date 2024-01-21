import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "../../store/Authentication/authSlice";

const RequireAuth = () => {
    const token = useSelector(selectCurrentToken)
    const location = useLocation();
    return (
        token
            ? <Outlet />
            : <Navigate to="/registration" state={{ from: location }} replace />
    )
}
export default RequireAuth