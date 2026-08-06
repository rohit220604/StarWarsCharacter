import { swapiApi } from './api.js'
import { Character, Planet, PaginatedResponse } from '../types/character.js'

export function getCharacters(page: number): Promise<PaginatedResponse<Character>> {
    return swapiApi.get(`/people/?page=${page}`).then(res => res.data)
}

export function getCharacter(url: string): Promise<Character> {
    return swapiApi.get(url).then(res => res.data)
}

export function getPlanet(url: string): Promise<Planet> {
    return swapiApi.get(url).then(res => res.data)
}
