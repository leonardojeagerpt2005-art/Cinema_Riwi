import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./features/auth/pages/public/LoginPage";
import RegisterPage from "./features/auth/pages/public/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
