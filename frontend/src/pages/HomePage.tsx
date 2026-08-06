import { useState, useEffect, useMemo } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { getAllCharacters } from '../services/character.service.js'
import type { Character } from '../types/character.js'
import { CharacterCard } from '../components/character/CharacterCard.js'
import { CharacterModal } from '../components/character/CharacterModal.js'
import { SkeletonCard } from '../components/common/SkeletonCard.js'
import { EmptyState } from '../components/common/EmptyState.js'
import '../styles/home.css'

const ITEMS_PER_PAGE = 10

export function HomePage() {
    const [allCharacters, setAllCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [loadMoreLoading, setLoadMoreLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [speciesFilter, setSpeciesFilter] = useState('All')
    const [homeworldFilter, setHomeworldFilter] = useState('All')
    const [filmFilter, setFilmFilter] = useState('All')

    useEffect(() => {
        const fetchAllCharacters = async () => {
            setLoading(true)
            setError(null)
            
            try {
                const characters = await getAllCharacters()
                setAllCharacters(characters)
                toast.success('Character loaded')
            } catch (err) {
                const errorMsg = 'Failed loading data'
                setError(errorMsg)
                toast.error(errorMsg)
            } finally {
                setLoading(false)
            }
        }

        fetchAllCharacters()
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, speciesFilter, homeworldFilter, filmFilter])

    const homeworlds = useMemo(() => {
        return Array.from(new Set(allCharacters.map(c => c.homeworldName)))
    }, [allCharacters])

    const filteredCharacters = useMemo(() => {
        return allCharacters.filter(character => {
            const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesSpecies = speciesFilter === 'All' || 
                character.speciesName.toLowerCase() === speciesFilter.toLowerCase()
            const matchesHomeworld = homeworldFilter === 'All' || character.homeworldName === homeworldFilter
            const matchesFilm = filmFilter === 'All' || 
                (filmFilter === '1+' ? character.films.length >= 1 :
                 filmFilter === '2+' ? character.films.length >= 2 :
                 filmFilter === '3+' ? character.films.length >= 3 :
                 filmFilter === '4+' ? character.films.length >= 4 :
                 filmFilter === '5+' ? character.films.length >= 5 :
                 character.films.length === parseInt(filmFilter))
            
            return matchesSearch && matchesSpecies && matchesHomeworld && matchesFilm
        })
    }, [allCharacters, searchQuery, speciesFilter, homeworldFilter, filmFilter])

    const totalPages = Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE)
    
    const displayedCharacters = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return filteredCharacters.slice(startIndex, endIndex)
    }, [filteredCharacters, currentPage])

    const getSpeciesClass = (character: Character): string => {
        const speciesName = character.speciesName.toLowerCase()
        if (speciesName.includes('human')) return 'species-human'
        if (speciesName.includes('droid')) return 'species-droid'
        if (speciesName.includes('wookiee')) return 'species-wookiee'
        return 'species-unknown'
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePageClick = (page: number) => {
        setCurrentPage(page)
    }

    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = []
        const maxVisiblePages = 9
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)
            
            if (currentPage > 3) {
                pages.push('...')
            }
            
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)
            
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...')
            }
            
            pages.push(totalPages)
        }
        
        return pages
    }

    const handleResetFilters = () => {
        setSearchQuery('')
        setSpeciesFilter('All')
        setHomeworldFilter('All')
        setFilmFilter('All')
    }

    if (loading) {
        return (
            <div className="home-container">
                <Toaster position="top-right" />
                <div className="hero-section">
                    <h1 className="hero-title">Star Wars Character Explorer</h1>
                    <p className="hero-subtitle">
                        Browse every Star Wars character with detailed information powered by SWAPI.
                    </p>
                </div>
                <div className="character-grid">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="home-container">
            <Toaster position="top-right" />
            
            <div className="hero-section">
                <h1 className="hero-title">Star Wars Character Explorer</h1>
                <p className="hero-subtitle">
                    Browse every Star Wars character with detailed information powered by SWAPI.
                </p>
            </div>
            
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

            {filteredCharacters.length === 0 ? (
                <EmptyState onReset={handleResetFilters} />
            ) : (
                <>
                    <div className="character-grid">
                        {displayedCharacters.map((character) => (
                            <CharacterCard 
                                key={character.url} 
                                character={character} 
                                onClick={() => setSelectedCharacter(character)}
                                speciesClass={getSpeciesClass(character)}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button 
                                className="pagination-button"
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            
                            <div className="pagination-pages">
                                {getPageNumbers().map((page, index) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                            onClick={() => handlePageClick(page as number)}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}
                            </div>
                            
                            <button 
                                className="pagination-button"
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            <footer className="footer">
                <p>Built with React, TypeScript & SWAPI</p>
            </footer>

            <CharacterModal 
                isOpen={!!selectedCharacter}
                character={selectedCharacter}
                onClose={() => setSelectedCharacter(null)}
            />
        </div>
    )
}
