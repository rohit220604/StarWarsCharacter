import { useState, useEffect } from 'react'
import { getCharacters } from '../services/character.service.js'
import type { Character } from '../types/character.js'
import { CharacterCard } from '../components/character/CharacterCard.js'
import { Loading } from '../components/common/Loading.js'
import { ErrorMessage } from '../components/common/ErrorMessage.js'

export function HomePage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrevious, setHasPrevious] = useState(false)

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
        return <Loading />
    }

    if (error) {
        return <ErrorMessage message={error} />
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Star Wars Character Explorer</h1>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '20px'
            }}>
                {characters.map((character) => (
                    <CharacterCard key={character.url} character={character} />
                ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                    onClick={handlePrevious}
                    disabled={!hasPrevious}
                    style={{ opacity: hasPrevious ? 1 : 0.5 }}
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button 
                    onClick={handleNext}
                    disabled={!hasNext}
                    style={{ opacity: hasNext ? 1 : 0.5 }}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
