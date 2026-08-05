import { Character } from '../../types/character'

interface CharacterCardProps {
    character: Character
    onClick: () => void
    speciesClass: string
}

export function CharacterCard({ character, onClick, speciesClass }: CharacterCardProps) {
    const imageUrl = `https://picsum.photos/300/250?random=${encodeURIComponent(character.name)}`

    return (
        <div className={`character-card ${speciesClass}`} onClick={onClick}>
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
