import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Insider Game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/インサイダーゲーム/i);
  expect(titleElement).toBeInTheDocument();
});
