import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Pagination from '../components/Pagination';

describe('Pagination Component', () => {
  it('debe renderizar la paginación correctamente', () => {
    render(<Pagination currentPage={2} totalPages={10} />);

    expect(screen.getByText(/Page.*2.*of.*10/i)).toBeDefined();
    expect(screen.getByText(/Previous/i)).toBeDefined();
    expect(screen.getByText(/Next/i)).toBeDefined();
  });

  it('debe deshabilitar el botón Previous si está en la primera página', () => {
    render(<Pagination currentPage={1} totalPages={10} />);

    const prevButton = screen.getByText(/Previous/i);
    expect(prevButton.tagName).toBe('SPAN');
    expect(prevButton.getAttribute('href')).toBeNull();
  });

  it('debe deshabilitar el botón Next si está en la última página', () => {
    render(<Pagination currentPage={10} totalPages={10} />);

    const nextButton = screen.getByText(/Next/i);
    expect(nextButton.tagName).toBe('SPAN');
    expect(nextButton.getAttribute('href')).toBeNull();
  });
});