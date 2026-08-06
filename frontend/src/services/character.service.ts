import { swapiApi } from './api.js'
import { Character, Planet, PaginatedResponse } from '../types/character.js'

const speciesCache = new Map<string, string>()
const planetCache = new Map<string, string>()

export function getCharacters(page: number): Promise<PaginatedResponse<Character>> {
    return swapiApi.get(`/people/?page=${page}`).then(res => res.data)
}

export function getCharacter(url: string): Promise<Character> {
    return swapiApi.get(url).then(res => res.data)
}

export function getPlanet(url: string): Promise<Planet> {
    return swapiApi.get(url).then(res => res.data)
}

export async function getSpeciesName(url: string): Promise<string> {
    if (speciesCache.has(url)) {
        return speciesCache.get(url)!
    }

    try {
        const response = await swapiApi.get(url)
        const name = response.data.name
        speciesCache.set(url, name)
        return name
    } catch (error) {
        return 'Unknown'
    }
}

export async function getPlanetName(url: string): Promise<string> {
    if (planetCache.has(url)) {
        return planetCache.get(url)!
    }

    try {
        const response = await swapiApi.get(url)
        const name = response.data.name
        planetCache.set(url, name)
        return name
    } catch (error) {
        return 'Unknown'
    }
}

export async function getAllCharacters(): Promise<Character[]> {
    const allCharacters: Character[] = []
    let nextPage = '/people/'

    while (nextPage) {
        const response = await swapiApi.get(nextPage)
        const data = response.data
        allCharacters.push(...data.results)
        nextPage = data.next
    }

    const uniqueSpeciesUrls = new Set<string>()
    const uniquePlanetUrls = new Set<string>()

    allCharacters.forEach(character => {
        if (character.species.length === 0) {
            character.speciesName = 'Human'
        } else {
            character.species.forEach(url => uniqueSpeciesUrls.add(url))
        }
        if (character.homeworld) {
            uniquePlanetUrls.add(character.homeworld)
        }
    })

    const speciesPromises = Array.from(uniqueSpeciesUrls).map(url => 
        getSpeciesName(url).then(name => ({ url, name }))
    )

    const planetPromises = Array.from(uniquePlanetUrls).map(url => 
        getPlanetName(url).then(name => ({ url, name }))
    )

    const [speciesNames, planetNames] = await Promise.all([
        Promise.all(speciesPromises),
        Promise.all(planetPromises)
    ])

    const speciesMap = new Map(speciesNames.map(({ url, name }) => [url, name]))
    const planetMap = new Map(planetNames.map(({ url, name }) => [url, name]))

    return allCharacters.map(character => {
        let speciesName = 'Human'
        if (character.species.length > 0) {
            const speciesUrl = character.species[0]
            speciesName = speciesMap.get(speciesUrl) || 'Unknown'
        }
        
        const homeworldName = character.homeworld ? (planetMap.get(character.homeworld) || 'Unknown') : 'Unknown'
        
        return { 
            ...character, 
            speciesName,
            homeworldName
        }
    })
}
