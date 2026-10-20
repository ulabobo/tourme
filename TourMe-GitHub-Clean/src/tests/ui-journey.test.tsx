import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppRoutesContent } from '../app/AppRouter';
import { useAppStore } from '../store/useAppStore';

describe('Uzbekistan Travel Companion — UI Screen Rendering & Navigation Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.getState().resetDemoData();
  });

  it('renders A1 Welcome and navigates through A2, A3, A4, and B1', () => {
    render(
      <MemoryRouter
        initialEntries={['/onboarding/welcome']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppRoutesContent />
      </MemoryRouter>
    );

    expect(screen.getByText(/without the stress/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));
    expect(screen.getByText(/Create your/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText(/Tell us about/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Check visa & customs' }));
    expect(screen.getByText(/Stay up to 30 days/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Plan my trip' }));
    expect(screen.getByText(/Where do you/i)).toBeInTheDocument();
  });

  it('renders D1 Home, toggles Safety Heartbeat, and navigates to F1 Safety & F3 Are You Safe', () => {
    render(
      <MemoryRouter
        initialEntries={['/home']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppRoutesContent />
      </MemoryRouter>
    );

    expect(screen.getByText('Safety Heartbeat')).toBeInTheDocument();
    const toggle = screen.getByRole('switch', { name: 'Toggle Safety Heartbeat' });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Safety' }));
    expect(screen.getByTestId('test-sos-alarm-btn')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('test-sos-alarm-btn'));
    expect(screen.getByText('SAFETY CHECK')).toBeInTheDocument();

    // Cancel alarm
    fireEvent.click(screen.getByTestId('sos-cancel-im-safe-btn'));
    expect(useAppStore.getState().safetyState.sosStatus).toBe('SAFE');
  });

  it('renders Professional TourMe Navbar, switches languages (EN/RU/UZ), and opens Legal/Data Permissions modal', () => {
    render(
      <MemoryRouter
        initialEntries={['/onboarding/sign-in']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppRoutesContent />
      </MemoryRouter>
    );

    expect(screen.getByText('TourMe')).toBeInTheDocument();

    // Switch language to Uzbek (UZ) and Russian (RU)
    fireEvent.click(screen.getByTestId('lang-btn-uz'));
    expect(useAppStore.getState().userProfile.preferences.language).toBe('Uzbek');

    fireEvent.click(screen.getByTestId('lang-btn-ru'));
    expect(useAppStore.getState().userProfile.preferences.language).toBe('Russian');

    fireEvent.click(screen.getByTestId('lang-btn-en'));
    expect(useAppStore.getState().userProfile.preferences.language).toBe('English');

    // Open Terms of Use modal on Sign-In screen
    fireEvent.click(screen.getByText('Terms of Use'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
