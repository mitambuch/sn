import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PublicEvent } from '@/types/event';

const openAccessRequest = vi.fn();

vi.mock('@context/useAccessRequestModal', () => ({
  useAccessRequestModal: () => ({
    openAccessRequest,
    isOpen: false,
    closeAccessRequest: vi.fn(),
  }),
}));

// Controlled by each test — LandingEvents must render nothing until a real
// public event exists (no mock fallback on the public home).
let mockEvents: readonly PublicEvent[] = [];
let mockLoading = false;
vi.mock('@features/landing/usePublicEvents', () => ({
  usePublicEvents: () => ({ events: mockEvents, loading: mockLoading }),
}));

const { LandingEvents } = await import('../LandingEvents');

const sampleEvent: PublicEvent = {
  id: 'e1',
  slug: 'gala-2026',
  title: 'Gala 2026',
  category: 'gala',
  dateMode: 'free',
  dateLabel: 'Sur demande',
  city: 'Genève',
  countryCode: 'CH',
  venue: 'Beau-Rivage',
  images: [],
};

beforeEach(() => {
  mockEvents = [];
  mockLoading = false;
});

afterEach(() => {
  cleanup();
  openAccessRequest.mockClear();
});

describe('LandingEvents', () => {
  it('renders nothing when there are no public events', () => {
    mockEvents = [];
    const { container } = render(<LandingEvents />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing while still loading', () => {
    mockLoading = true;
    mockEvents = [sampleEvent];
    const { container } = render(<LandingEvents />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders one real card per event plus three locked teasers', () => {
    mockEvents = [sampleEvent];
    render(<LandingEvents />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    // 1 real event + 3 locked teasers = 4 activatable cards.
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });

  it('opens the access request when a card is activated', () => {
    mockEvents = [sampleEvent];
    render(<LandingEvents />);
    const [first] = screen.getAllByRole('button');
    if (!first) throw new Error('expected at least one card button');
    fireEvent.click(first);
    expect(openAccessRequest).toHaveBeenCalledWith('request');
  });
});
