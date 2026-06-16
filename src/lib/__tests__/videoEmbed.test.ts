import { describe, expect, it } from 'vitest';

import { toEmbedUrl } from '../videoEmbed';

describe('toEmbedUrl', () => {
  it('parses a youtu.be short link', () => {
    expect(toEmbedUrl('https://youtu.be/dQw4w9WgXcQ')).toEqual({
      provider: 'youtube',
      embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    });
  });

  it('parses a youtube.com/watch link', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ').embedUrl).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    );
  });

  it('parses a youtube shorts link', () => {
    expect(toEmbedUrl('https://youtube.com/shorts/abc123XYZ').provider).toBe('youtube');
  });

  it('parses a vimeo link', () => {
    expect(toEmbedUrl('https://vimeo.com/123456789')).toEqual({
      provider: 'vimeo',
      embedUrl: 'https://player.vimeo.com/video/123456789',
    });
  });

  it('parses a player.vimeo.com link', () => {
    expect(toEmbedUrl('https://player.vimeo.com/video/987654321').embedUrl).toBe(
      'https://player.vimeo.com/video/987654321',
    );
  });

  it('tolerates surrounding whitespace', () => {
    expect(toEmbedUrl('  https://vimeo.com/42  ').embedUrl).toBe(
      'https://player.vimeo.com/video/42',
    );
  });

  it('returns null provider for an unrecognised URL', () => {
    expect(toEmbedUrl('https://example.com/video.mp4')).toEqual({
      provider: null,
      embedUrl: null,
    });
  });
});
