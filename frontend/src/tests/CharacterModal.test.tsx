import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.js'
import { HomePage } from '../pages/HomePage.js'
import * as characterService from '../services/character.service.js'

const mockCharacter = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'https://swapi.dev/api/planets/1/',
    films: [
        'https://swapi.dev/api/films/1/',
        'https://swapi.dev/api/films/2/',
        'https://swapi.dev/api/films/3/'
    ],
    species: ['https://swapi.dev/api/species/1/'],
    vehicles: [
        'https://swapi.dev/api/vehicles/14/',
        'https://swapi.dev/api/vehicles/30/'
    ],
    starships: [
        'https://swapi.dev/api/starships/12/',
        'https://swapi.dev/api/starships/22/'
    ],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-20T21:17:56.891000Z',
    url: 'https://swapi.dev/api/people/1/'
}

const mockPlanet = {
    name: 'Tatooine',
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
    population: '200000',
    residents: [
        'https://swapi.dev/api/people/1/',
        'https://swapi.dev/api/people/2/'
    ],
    films: [
        'https://swapi.dev/api/films/1/',
        'https://swapi.dev/api/films/3/',
        'https://swapi.dev/api/films/4/',
        'https://swapi.dev/api/films/5/',
        'https://swapi.dev/api/films/6/'
    ],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    url: 'https://swapi.dev/api/planets/1/'
}

vi.mock('../services/character.service.js', () => ({
    getCharacters: vi.fn(() =>
        Promise.resolve({
            count: 82,
            next: null,
            previous: null,
            results: [mockCharacter]
        })
    ),
    getPlanet: vi.fn(() => Promise.resolve(mockPlanet))
}))

const renderWithProviders = (component: React.ReactNode) => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                {component}
            </AuthProvider>
        </BrowserRouter>
    )
}

describe('CharacterModal Integration', () => {
    it('should open modal when character card is clicked and display correct character name', async () => {
        const user = userEvent.setup()
        
        renderWithProviders(<HomePage />)

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker')).toBeDefined()
        })

        const characterCard = screen.getByText('Luke Skywalker')
        await user.click(characterCard)

        await waitFor(() => {
            const modalTitle = screen.getByRole('heading', { name: 'Luke Skywalker' })
            expect(modalTitle).toBeDefined()
        })

        expect(screen.getByText('Luke Skywalker')).toBeDefined()
    })

    it('should display character details in modal', async () => {
        const user = userEvent.setup()
        
        renderWithProviders(<HomePage />)

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker')).toBeDefined()
        })

        const characterCard = screen.getByText('Luke Skywalker')
        await user.click(characterCard)

        await waitFor(() => {
            expect(screen.getByText('1.72 m')).toBeDefined()
        })

        expect(screen.getByText(/77 kg/)).toBeDefined()
        expect(screen.getByText(/19BBY/)).toBeDefined()
        expect(screen.getByText('3')).toBeDefined()
    })

    it('should display homeworld information in modal', async () => {
        const user = userEvent.setup()
        
        renderWithProviders(<HomePage />)

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker')).toBeDefined()
        })

        const characterCard = screen.getByText('Luke Skywalker')
        await user.click(characterCard)

        await waitFor(() => {
            expect(screen.getByText('Tatooine')).toBeDefined()
        })

        expect(screen.getByText(/desert/)).toBeDefined()
        expect(screen.getByText(/arid/)).toBeDefined()
    })

    it('should close modal when X button is clicked', async () => {
        const user = userEvent.setup()
        
        renderWithProviders(<HomePage />)

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker')).toBeDefined()
        })

        const characterCard = screen.getByText('Luke Skywalker')
        await user.click(characterCard)

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeDefined()
        })

        const closeButton = screen.getByText('×')
        await user.click(closeButton)

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Luke Skywalker' })).toBeNull()
        })
    })
})