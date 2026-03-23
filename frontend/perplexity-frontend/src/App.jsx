import { RouterProvider } from 'react-router-dom'
import router from './app.router'
import { useAuth } from './features/Auth/hook/useAuth'
import { useEffect } from 'react'

function App() {
  const { handleGetme } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleGetme();
        console.log(response);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return <RouterProvider router={router} />;
}

export default App
