import Photobooth from './photobooth/Photobooth'
import styles from './App.module.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Editor from './template-editor/Editor';
import NavWrapper from './components/NavWrapper';

// Document: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NavWrapper><Photobooth /></NavWrapper>
    ),
  },
  {
    path: "editor",
    element: <NavWrapper><Editor /></NavWrapper>,
  },
]);

function App(): JSX.Element {
  return (
    <div className={styles.App}>      
      <RouterProvider router={router} />
    </div>
  )
}

export default App
