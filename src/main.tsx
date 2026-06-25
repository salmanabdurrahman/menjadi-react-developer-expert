import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import { router } from '@/app/router';
import { store } from '@/app/store';
import '@/styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster closeButton position="top-right" richColors />
    </Provider>
  </StrictMode>,
);
