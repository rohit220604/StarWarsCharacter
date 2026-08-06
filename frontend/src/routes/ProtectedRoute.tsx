import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth()
    
    if (loading) {
        return <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            color: '#60a5fa',
            fontSize: '1.2rem'
        }}>
            Loading...
        </div>
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    
    return <>{children}</>
}
