import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CharacterCard from '../components/CharacterCard';

const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  type: '',
  gender: 'Male' as const,
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [],
  url: '',
  created: '',
};

describe('CharacterCard Component', () => {
  it('debe renderizar el nombre e información del personaje', () => {
    render(<CharacterCard character={mockCharacter} />);

    expect(screen.getByText('Rick Sanchez')).toBeDefined();
    expect(screen.getByText(/Alive/i)).toBeDefined();
    expect(screen.getByText(/Human/i)).toBeDefined();
  });

  it('debe renderizar los badges para estado Dead, unknown y valor por defecto', () => {
    const deadCharacter = { ...mockCharacter, status: 'Dead' as const };
    const { rerender } = render(<CharacterCard character={deadCharacter} />);
    expect(screen.getByText(/Dead/i)).toBeDefined();

    const unknownCharacter = { ...mockCharacter, status: 'unknown' as const };
    rerender(<CharacterCard character={unknownCharacter} />);
    expect(screen.getByText(/unknown/i)).toBeDefined();

    const otherCharacter = { ...mockCharacter, status: 'other' as any };
    rerender(<CharacterCard character={otherCharacter} />);
    expect(screen.getByText(/other/i)).toBeDefined();
  });
});