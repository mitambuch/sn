import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // App renders providers + router — should not throw
    expect(document.getElementById('root') ?? document.body).toBeTruthy();
  });

  it('renders the toast container for notifications', async () => {
    render(<App />);
    const toastContainer = await screen.findByLabelText(/notifications/i);
    expect(toastContainer).toBeInTheDocument();
  });

  // NOTE: Header "main navigation" lives in PublicLayout (playground, lab).
  // The default / route redirects to /:locale → Home, which is mounted
  // outside PublicLayout. Header coverage lives in Header.test.tsx.
});
