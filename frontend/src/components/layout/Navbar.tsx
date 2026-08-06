import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.js'

export function Navbar() {
    const { isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleLogin = () => {
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                ⭐ Star Wars Explorer
            </div>

            <div>
                {isAuthenticated ? (
                    <button 
                        onClick={handleLogout}
                        className="navbar-button logout"
                    >
                        Logout
                    </button>
                ) : (
                    <button 
                        onClick={handleLogin}
                        className="navbar-button login"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    )
}