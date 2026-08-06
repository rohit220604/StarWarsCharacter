import { useNavigate } from 'react-router-dom'

interface EmptyStateProps {
    onReset?: () => void
}

export function EmptyState({ onReset }: EmptyStateProps) {
    const navigate = useNavigate()

    const handleReset = () => {
        if (onReset) {
            onReset()
        } else {
            navigate('/')
        }
    }

    return (
        <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">No characters found.</h2>
            <p className="empty-state-message">
                Try adjusting your filters to find what you're looking for.
            </p>
            <button 
                onClick={handleReset}
                className="empty-state-button"
            >
                Reset Filters
            </button>
        </div>
    )
}