import { useState, useEffect } from 'react'
import { getPlanet } from '../../services/character.service.js'
import type { Character, Planet } from '../../types/character.js'
import "../../styles/modal.css";

interface CharacterModalProps {
    isOpen: boolean
    character: Character | null
    onClose: () => void
}

export function CharacterModal({ isOpen, character, onClose }: CharacterModalProps) {
    const [planet, setPlanet] = useState<Planet | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && character) {
            fetchPlanet()
        }
    }, [isOpen, character])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    const fetchPlanet = async () => {
        if (!character) return

        setLoading(true)
        setError(null)

        try {
            const planetData = await getPlanet(character.homeworld)
            setPlanet(planetData)
        } catch (err) {
            setError('Failed to fetch homeworld')
        } finally {
            setLoading(false)
        }
    }

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }

    const convertHeightToMeters = (heightCm: string) => {
        const height = parseInt(heightCm)
        if (isNaN(height)) return 'Unknown'
        return `${(height / 100).toFixed(2)} m`
    }

    if (!isOpen || !character) return null

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <h2 className="modal-title">{character.name}</h2>

                <div className="modal-section">
                    <h3 className="modal-section-title">Physical Information</h3>
                    <p className="modal-detail">
                        <strong>Height:</strong> {convertHeightToMeters(character.height)}
                    </p>
                    <p className="modal-detail">
                        <strong>Mass:</strong> {character.mass === 'unknown' ? 'Unknown' : `${character.mass} kg`}
                    </p>
                    <p className="modal-detail">
                        <strong>Birth Year:</strong> {character.birth_year}
                    </p>
                    <p className="modal-detail">
                        <strong>Films:</strong> {character.films.length}
                    </p>
                    <p className="modal-detail">
                        <strong>Date Added:</strong> {character.created ? formatDate(character.created) : 'Unknown'}
                    </p>
                </div>

                <div className="modal-section">
                    <h3 className="modal-section-title">Homeworld</h3>
                    {loading && <div className="modal-loading">Loading character details...</div>}
                    {error && <div className="modal-error">{error}</div>}
                    {planet && (
                        <>
                            <p className="modal-detail">
                                <strong>Planet Name:</strong> {planet.name}
                            </p>
                            <p className="modal-detail">
                                <strong>Terrain:</strong> {planet.terrain}
                            </p>
                            <p className="modal-detail">
                                <strong>Climate:</strong> {planet.climate}
                            </p>
                            <p className="modal-detail">
                                <strong>Population:</strong> {planet.population === 'unknown' ? 'Unknown' : planet.population}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}