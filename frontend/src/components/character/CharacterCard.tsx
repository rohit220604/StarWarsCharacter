import { Character } from '../../types/character'

interface CharacterCardProps {
    character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
    return (
        <div>
            <h3>{character.name}</h3>
            <p>Birth Year: {character.birth_year}</p>
            <p>Gender: {character.gender}</p>
        </div>
    )
}