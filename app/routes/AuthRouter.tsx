import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';
import { VerifyOtp } from '../pages/Auth/VerifyOtp';
import { Profile } from '../pages/Auth/Profile';

export const AuthRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-otp',
    element: <VerifyOtp />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
];
