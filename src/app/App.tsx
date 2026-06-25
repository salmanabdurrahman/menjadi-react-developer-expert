import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { router } from '@/app/router';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster closeButton position="top-right" richColors />
    </>
  );
}

export default App;
