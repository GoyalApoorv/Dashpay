import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthChecker } from "./components/AuthChecker";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { VerifyEmail } from "./pages/VerifyEmail";
import { AuthCallback } from "./pages/AuthCallback";

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthChecker>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AuthChecker>
      </BrowserRouter>
    </>
  )
}

export default App
