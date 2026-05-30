import { ... } from ...
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import About from "./components/About.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Analysis from "./components/Analysis.jsx";
import { ToastContainer, Zoom } from "react-toastify";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UnprotectedRoute from "./routes/UnprotectedRoute.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/user.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            <UnprotectedRoute>
              <Login />
            </UnprotectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <UnprotectedRoute>
              <Signup />
            </UnprotectedRoute>
          }
        />

        <Route
          path="/Analyze"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        theme="dark"
        transition={Zoom}
      />
    </>
  );
}

export default App;
