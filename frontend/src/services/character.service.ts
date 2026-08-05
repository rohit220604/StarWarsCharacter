import { api } from './api.js'
import { Character, Planet, PaginatedResponse } from '../types/character.js'

export function getCharacters(page: number): Promise<PaginatedResponse<Character>> {
    return api.get(`/people/?page=${page}`).then(res => res.data)
}

export function getCharacter(url: string): Promise<Character> {
    return api.get(url).then(res => res.data)
}

export function getPlanet(url: string): Promise<Planet> {
    return api.get(url).then(res => res.data)
}