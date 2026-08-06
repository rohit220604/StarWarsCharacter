import { useState, useEffect, useMemo } from 'react'
import { getCharacters } from '../services/character.service.js'
import type { Character } from '../types/character.js'
import { CharacterCard } from '../components/character/CharacterCard.js'
import { CharacterModal } from '../components/character/CharacterModal.js'
import { Loading } from '../components/common/Loading.js'
import { ErrorMessage } from '../components/common/ErrorMessage.js'
import '../styles/home.css'

export function HomePage() {
    const [pagesCache, setPagesCache] = useState<Record<number, Character[]>>({})
    const [loading, setLoading] = useState(true)
    const [loadMoreLoading, setLoadMoreLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [speciesFilter, setSpeciesFilter] = useState('All')
    const [homeworldFilter, setHomeworldFilter] = useState('All')
    const [filmFilter, setFilmFilter] = useState('All')

    const fetchCharacters = async (page: number) => {
        if (page === 1) {
            setLoading(true)
        } else {
            setLoadMoreLoading(true)
        }
        setError(null)
        
        try {
            const response = await getCharacters(page)
            setPagesCache(prev => ({
                ...prev,
                [page]: response.results
            }))
            setHasNext(response.next !== null)
        } catch (err) {
            setError('Failed to fetch characters. Please try again.')
        } finally {
            setLoading(false)
            setLoadMoreLoading(false)
        }
    }

    useEffect(() => {
        fetchCharacters(1)
    }, [])

    const homeworlds = useMemo(() => {
        const allCharacters = Object.values(pagesCache).flat()
        return Array.from(new Set(allCharacters.map(c => c.homeworld)))
    }, [pagesCache])

    const filteredCharacters = useMemo(() => {
        const allCharacters = Object.values(pagesCache).flat()
        return allCharacters.filter(character => {
            const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesSpecies = speciesFilter === 'All' || 
                (speciesFilter === 'Unknown' ? !character.species?.length : 
                 character.species?.some(s => s.includes(speciesFilter.toLowerCase())))
            const matchesHomeworld = homeworldFilter === 'All' || character.homeworld === homeworldFilter
            const matchesFilm = filmFilter === 'All' || 
                (filmFilter === '1+' ? character.films.length >= 1 :
                 filmFilter === '2+' ? character.films.length >= 2 :
                 filmFilter === '3+' ? character.films.length >= 3 :
                 filmFilter === '4+' ? character.films.length >= 4 :
                 filmFilter === '5+' ? character.films.length >= 5 :
                 character.films.length === parseInt(filmFilter))
            
            return matchesSearch && matchesSpecies && matchesHomeworld && matchesFilm
        })
    }, [pagesCache, searchQuery, speciesFilter, homeworldFilter, filmFilter])

    const getSpeciesClass = (character: Character): string => {
        const species = character.species?.[0] || 'Unknown'
        if (species.includes('human')) return 'species-human'
        if (species.includes('droid')) return 'species-droid'
        if (species.includes('wookiee')) return 'species-wookiee'
        return 'species-unknown'
    }

    const handleLoadMore = () => {
        if (!loadMoreLoading && hasNext) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchCharacters(nextPage)
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
            
            <div className="filters-container">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search character..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters-row">
                    <div className="filters-dropdowns">
                        <select 
                            value={speciesFilter} 
                            onChange={(e) => setSpeciesFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Species</option>
                            <option value="Human">Human</option>
                            <option value="Droid">Droid</option>
                            <option value="Wookiee">Wookiee</option>
                            <option value="Unknown">Unknown</option>
                        </select>

                        <select 
                            value={homeworldFilter} 
                            onChange={(e) => setHomeworldFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All Homeworlds</option>
                            {homeworlds.map(homeworld => (
                                <option key={homeworld} value={homeworld}>
                                    {homeworld.split('/').filter(Boolean).pop() || homeworld}
                                </option>
                            ))}
                        </select>

                        <select 
                            value={filmFilter} 
                            onChange={(e) => setFilmFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="All">All</option>
                            <option value="1+">1+</option>
                            <option value="2+">2+</option>
                            <option value="3+">3+</option>
                            <option value="4+">4+</option>
                            <option value="5+">5+</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="character-grid">
                {filteredCharacters.map((character) => (
                    <CharacterCard 
                        key={character.url} 
                        character={character} 
                        onClick={() => setSelectedCharacter(character)}
                        speciesClass={getSpeciesClass(character)}
                    />
                ))}
            </div>

            {hasNext && (
                <div className="load-more-container">
                    <button 
                        className="load-more-button"
                        onClick={handleLoadMore}
                        disabled={loadMoreLoading}
                    >
                        {loadMoreLoading ? 'Loading...' : 'Load More'}
                    </button>
                    {error && <div className="load-more-error">{error}</div>}
                </div>
            )}

            {!hasNext && Object.keys(pagesCache).length > 0 && (
                <div className="end-message">
                    You've reached the end of the galaxy.
                </div>
            )}

            <CharacterModal 
                isOpen={!!selectedCharacter}
                character={selectedCharacter}
                onClose={() => setSelectedCharacter(null)}
            />
        </div>
    )
}