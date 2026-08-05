import { Routes, Route } from 'react-router-dom'

function HomePage() {
  return <div>Home Page</div>
}

function LoginPage() {
  return <div>Login Page</div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}