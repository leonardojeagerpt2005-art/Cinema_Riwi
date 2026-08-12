import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./features/auth/pages/public/LoginPage";
import RegisterPage from "./features/auth/pages/public/RegisterPage";
import CinemaHomePage from "./features/auth/pages/private/CinemaHomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/cinema",
    element: <CinemaHomePage />,
  },
]);
