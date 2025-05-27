import React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from '../MainLayout';

describe('MainLayout Component', () => {
  it('renders children content correctly', () => {
    const testContent = 'Test content for main layout';

    render(
      <MainLayout>
        <div>{testContent}</div>
      </MainLayout>
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('has proper container structure and styling', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const container = screen.getByText('Content').closest('div');
    const parentContainer = container?.parentElement;
    const rootContainer = parentContainer?.parentElement;

    // Check root container classes
    expect(rootContainer).toHaveClass(
      'min-h-screen',
      'flex',
      'flex-col',
      'px-4',
      'py-8',
      'bg-base-200'
    );

    // Check card container classes
    expect(parentContainer).toHaveClass(
      'flex-1',
      'card',
      'bg-base-100',
      'rounded-2xl',
      'shadow-xl',
      'p-6',
      'flex',
      'flex-col',
      'border',
      'border-primary/10'
    );
  });

  it('renders multiple children correctly', () => {
    render(
      <MainLayout>
        <h1>Title</h1>
        <p>Paragraph content</p>
        <button>Action button</button>
      </MainLayout>
    );

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Action button' })
    ).toBeInTheDocument();
  });

  it('maintains full height layout', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const rootContainer = screen.getByText('Content').closest('div')
      ?.parentElement?.parentElement;
    expect(rootContainer).toHaveClass('min-h-screen');
  });

  it('applies correct responsive padding', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const rootContainer = screen.getByText('Content').closest('div')
      ?.parentElement?.parentElement;
    expect(rootContainer).toHaveClass('px-4', 'py-8');
  });

  it('uses DaisyUI card styling', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const cardContainer = screen
      .getByText('Content')
      .closest('div')?.parentElement;
    expect(cardContainer).toHaveClass(
      'card',
      'bg-base-100',
      'rounded-2xl',
      'shadow-xl'
    );
  });

  it('has proper flex layout structure', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const rootContainer = screen.getByText('Content').closest('div')
      ?.parentElement?.parentElement;
    const cardContainer = screen
      .getByText('Content')
      .closest('div')?.parentElement;

    // Root should be flex column
    expect(rootContainer).toHaveClass('flex', 'flex-col');

    // Card should be flex-1 and flex column
    expect(cardContainer).toHaveClass('flex-1', 'flex', 'flex-col');
  });

  it('applies correct border styling', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const cardContainer = screen
      .getByText('Content')
      .closest('div')?.parentElement;
    expect(cardContainer).toHaveClass('border', 'border-primary/10');
  });

  it('handles empty children gracefully', () => {
    render(<MainLayout>{null}</MainLayout>);

    // Should render without errors
    const containers = document.querySelectorAll('.card');
    expect(containers).toHaveLength(1);
  });

  it('renders complex nested content correctly', () => {
    render(
      <MainLayout>
        <div>
          <header>Header</header>
          <main>
            <section>Section 1</section>
            <section>Section 2</section>
          </main>
          <footer>Footer</footer>
        </div>
      </MainLayout>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('maintains accessibility structure', () => {
    render(
      <MainLayout>
        <main>
          <h1>Main Content</h1>
          <p>This is the main content area</p>
        </main>
      </MainLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('provides consistent spacing with padding', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const cardContainer = screen
      .getByText('Content')
      .closest('div')?.parentElement;
    expect(cardContainer).toHaveClass('p-6');
  });

  it('uses consistent background colors', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    const rootContainer = screen.getByText('Content').closest('div')
      ?.parentElement?.parentElement;
    const cardContainer = screen
      .getByText('Content')
      .closest('div')?.parentElement;

    expect(rootContainer).toHaveClass('bg-base-200');
    expect(cardContainer).toHaveClass('bg-base-100');
  });

  it('handles React fragments as children', () => {
    render(
      <MainLayout>
        <>
          <div>Fragment child 1</div>
          <div>Fragment child 2</div>
        </>
      </MainLayout>
    );

    expect(screen.getByText('Fragment child 1')).toBeInTheDocument();
    expect(screen.getByText('Fragment child 2')).toBeInTheDocument();
  });
});
