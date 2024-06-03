import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dropzone', () => {
  render(<App />);
  const linkElement = screen.getByText(/Drop here your survey results to start. CSV, XLS, and XLSX files are accepted./i);
  expect(linkElement).toBeInTheDocument();
});
