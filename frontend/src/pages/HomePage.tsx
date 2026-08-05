import { useState, useEffect } from 'react'
import { getCharacters } from '../services/character.service.js'
import type { Character } from '../types/character.js'
import { CharacterCard } from '../components/character/CharacterCard.js'
import { CharacterModal } from '../components/character/CharacterModal.js'
import { Loading } from '../components/common/Loading.js'
import { ErrorMessage } from '../components/common/ErrorMessage.js'
import '../styles/home.css'

export function HomePage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrevious, setHasPrevious] = useState(false)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

    useEffect(() => {
        fetchCharacters(currentPage)
    }, [currentPage])

    const fetchCharacters = async (page: number) => {
        setLoading(true)
        setError(null)
        
        try {
            const response = await getCharacters(page)
            console.log("SWAPI Response:", response);

            setCharacters(response.results)
            setHasNext(response.next !== null)
            setHasPrevious(response.previous !== null)
        } catch (err) {
            setError('Failed to fetch characters')
        } finally {
            setLoading(false)
        }
    }

    const handlePrevious = () => {
        if (hasPrevious) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (hasNext) {
            setCurrentPage(currentPage + 1)
        }
    }

    if (loading) {
        return <div className="loading-container">Loading...</div>
    }

    if (error) {
        return <div className="error-container">{error}</div>
    }

    return (
        <div className="home-container">
            <h1 className="home-title">Star Wars Character Explorer</h1>
            
            <div className="character-grid">
                {characters.map((character) => (
                    <CharacterCard 
                        key={character.url} 
                        character={character} 
                        onClick={() => setSelectedCharacter(character)}
                    />
                ))}
            </div>

            <div className="pagination">
                <button 
                    className="pagination-button"
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                >
                    Previous
                </button>
                <span className="page-number">Page {currentPage}</span>
                <button 
                    className="pagination-button"
                    onClick={handleNext}
                    disabled={!hasNext}
                >
                    Next
                </button>
            </div>

            <CharacterModal 
                isOpen={!!selectedCharacter}
                character={selectedCharacter}
                onClose={() => setSelectedCharacter(null)}
            />
        </div>
    )
}
