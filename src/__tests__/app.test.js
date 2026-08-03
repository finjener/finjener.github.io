import { render, screen } from '@testing-library/react';
import App from '../App';

// Smoke test: the full app mounts, static theme2 Navbar renders immediately,
// and the lazy-loaded Home route resolves with the hero greeting.
test('mounts and renders the home route', async () => {
  render(<App />);

  // Static Navbar (not lazy) renders right away — desktop + mobile menus
  // each render their own links, so assert on the collection.
  expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: 'Projects' }).length).toBeGreaterThan(0);

  // Lazy Home route resolves and shows the greeting from home.json
  expect(await screen.findByText(/Merhaba/)).toBeInTheDocument();
});
