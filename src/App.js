import { Routes, Route, Outlet } from "react-router-dom";


import RootTask from './RootTask.js'

import { _build_random_tree } from "./model/_random_model.js"

function App() {
  return (
    <div className="App">
      <h1>App!</h1>
      <button onClick={(e)=>_build_random_tree("TASK_a")}>Shuffle</button>
      <Routes>
        <Route path="/" element={<div><h2>Home!</h2><Outlet/></div>}>
          <Route path="task" element={<Outlet/>}>
            <Route path=":id" element={<RootTask/>}/>
          </Route>
        </Route>

      </Routes>
    </div>
  );
}

export default App;
