import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthChecker } from "./components/AuthChecker";
function App() {

  return (
    <>
      <BrowserRouter>
        <AuthChecker>
          <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
        </AuthChecker>
      </BrowserRouter>
    </>
  )
}

export default App
