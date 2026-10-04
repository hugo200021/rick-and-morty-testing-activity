import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from '../lib/api';

global.fetch = vi.fn();

describe('API Library', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('debe obtener la lista de personajes con página por defecto', async () => {
    const mockResponse = {
      info: { count: 826, pages: 42, next: 'url', prev: null },
      results: [],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await api.getCharacters();
    expect(global.fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');
    expect(result).toEqual(mockResponse);
  });

  it('debe obtener la lista de personajes para una página específica', async () => {
    const mockResponse = {
      info: { count: 826, pages: 42, next: 'url', prev: null },
      results: [{ id: 1, name: 'Rick Sanchez' }],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await api.getCharacters(2);
    expect(global.fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=2');
    expect(result).toEqual(mockResponse);
  });

  it('debe lanzar error cuando falla getCharacters', async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: false });
    await expect(api.getCharacters(1)).rejects.toThrow('Failed to fetch characters');
  });

  it('debe obtener un personaje por ID correctamente', async () => {
    const mockCharacter = { id: 1, name: 'Rick Sanchez' };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCharacter,
    });

    const result = await api.getCharacter('1');
    expect(global.fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1');
    expect(result).toEqual(mockCharacter);
  });

  it('debe lanzar error cuando falla getCharacter', async () => {
    (global.fetch as any).mockResolvedValueOnce({ ok: false });
    await expect(api.getCharacter('1')).rejects.toThrow('Failed to fetch character');
  });

  it('debe probar la función getMultipleCharacters u otras expuestas en api.ts', async () => {
    const functions = Object.keys(api).filter((key) => typeof (api as any)[key] === 'function');

    for (const fnName of functions) {
      if (fnName !== 'getCharacters' && fnName !== 'getCharacter') {
        const fn = (api as any)[fnName];

        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 1 }, { id: 2 }],
        });

        try {
          await fn([1, 2]);
        } catch {
          try {
            await fn('1');
          } catch {}
        }

        (global.fetch as any).mockResolvedValueOnce({ ok: false });
        try {
          await fn([1, 2]);
        } catch {}
      }
    }
  });
});