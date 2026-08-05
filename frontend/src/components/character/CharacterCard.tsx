import { Character } from '../../types/character'

interface CharacterCardProps {
    character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
    const imageUrl = `https://picsum.photos/300/250?random=${encodeURIComponent(character.name)}`

    return (
        <div className="character-card">
            <img 
                src={imageUrl} 
                alt={character.name}
                className="character-image"
            />
            <div className="character-info">
                <h3 className="character-name">{character.name}</h3>
                <p className="character-detail">
                    <strong>Birth Year:</strong> {character.birth_year}
                </p>
                <p className="character-detail">
                    <strong>Gender:</strong> {character.gender}
                </p>
            </div>
        </div>
    )
}
