import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthChecker } from "./components/AuthChecker";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard"; 

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthChecker>
          <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        </AuthChecker>
      </BrowserRouter>
    </>
  )
}

export default App
