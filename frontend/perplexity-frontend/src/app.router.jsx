import { createBrowserRouter } from "react-router-dom";
import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import Dashborad from "./features/chat/pages/dashborad";
import Protected from "./features/chat/components/protected";

const router = createBrowserRouter([

  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <Protected>
        <Dashborad />
      </Protected>
    )
  }
]);

export default router;