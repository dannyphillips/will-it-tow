import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react';
import TowingCalculator from './calculator';

describe('TowingCalculator', () => {
  test('renders correctly', () => {
    render(<TowingCalculator />);
    expect(screen.getByText('Tow Vehicle')).toBeInTheDocument();
    expect(screen.getByText('Trailer')).toBeInTheDocument();
    expect(screen.getByText('Calculate')).toBeInTheDocument();
  });

  test('calculates correctly when trailer can be towed', () => {
    render(<TowingCalculator />);
    fireEvent.change(screen.getByLabelText('Towing Capacity (lbs)'), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText('Payload Capacity (lbs)'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Trailer Weight (lbs)'), { target: { value: '4000' } });
    fireEvent.change(screen.getByLabelText('Tongue Weight (lbs)'), { target: { value: '500' } });
    fireEvent.click(screen.getByText('Calculate'));
    expect(screen.getByText('Trailer can be towed')).toBeInTheDocument();
  });

  test('calculates correctly when trailer cannot be towed', () => {
    render(<TowingCalculator />);
    fireEvent.change(screen.getByLabelText('Towing Capacity (lbs)'), { target: { value: '4000' } });
    fireEvent.change(screen.getByLabelText('Payload Capacity (lbs)'), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText('Trailer Weight (lbs)'), { target: { value: '5000' } });
    fireEvent.change(screen.getByLabelText('Tongue Weight (lbs)'), { target: { value: '600' } });
    fireEvent.click(screen.getByText('Calculate'));
    expect(screen.getByText('Trailer cannot be towed')).toBeInTheDocument();
  });
});