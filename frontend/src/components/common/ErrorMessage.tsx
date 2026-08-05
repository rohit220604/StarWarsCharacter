interface ErrorMessageProps {
    message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
            {message}
        </div>
    )
}