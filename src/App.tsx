import { Routes, Route } from "react-router-dom"
import {Home} from "./pages/Home"
import {Login} from "./pages/Login"
import {Register} from "./pages/Register"
import  {LandingPage} from "./pages/LandingPage"
function App() {
  return (

    <Routes>
      
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
