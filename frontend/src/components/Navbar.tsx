import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.js'

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
        <nav style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            padding: '15px 30px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            borderBottom: '1px solid #334155'
        }}>
            <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#60a5fa'
            }}>
                Star Wars Explorer
            </div>

            <div>
                {isAuthenticated ? (
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <button 
                        onClick={handleLogin}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                        }}
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    )
}