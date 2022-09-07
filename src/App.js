import { Routes, Route, Outlet } from "react-router-dom";
import styles from "./App.module.css"

import RootTask from './RootTask.js'
import Home from "./Home.js"
import TaskHome from "./TaskHome.js"

function App() {
  return (
    <div className={styles.App}>
      <Routes>
        <Route path="/">
          <Route path="task">
            <Route path=":id" element={<RootTask/>}/>
            <Route index element={<TaskHome/>}/>
          </Route>
          <Route index element={<Home/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
