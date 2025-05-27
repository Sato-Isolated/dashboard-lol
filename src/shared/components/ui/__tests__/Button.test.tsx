import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders button with children', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('renders with default variant and size', () => {
      render(<Button>Default Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-primary');
    });

    it('applies correct variant classes', () => {
      const variants = [
        'primary',
        'secondary',
        'outline',
        'ghost',
        'success',
        'error',
        'warning',
        'info',
      ] as const;

      variants.forEach(variant => {
        const { rerender } = render(<Button variant={variant}>Test</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass(`btn-${variant}`);
        rerender(<></>);
      });
    });

    it('applies correct size classes', () => {
      const sizes = ['xs', 'sm', 'md', 'lg'] as const;

      sizes.forEach(size => {
        const { rerender } = render(<Button size={size}>Test</Button>);
        const button = screen.getByRole('button');

        if (size === 'md') {
          // md is default, no additional class
          expect(button).toHaveClass('btn');
        } else {
          expect(button).toHaveClass(`btn-${size}`);
        }
        rerender(<></>);
      });
    });
    it('applies shape classes correctly', () => {
      const { rerender } = render(<Button shape='square'>Square</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-square');

      rerender(<Button shape='circle'>Circle</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-circle');
    });

    it('applies additional modifiers', () => {
      render(
        <Button wide glass>
          Wide Glass
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-wide', 'glass');
    });

    it('applies custom className', () => {
      render(<Button className='custom-class'>Custom</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('Loading State', () => {
    it('shows loading state correctly', () => {
      render(<Button isLoading>Loading Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('loading');
      expect(button).toHaveTextContent('Loading...');
      expect(button).toBeDisabled();
    });

    it('shows loading spinner', () => {
      render(<Button isLoading>Loading</Button>);

      const spinner = screen
        .getByRole('button')
        .querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables button when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables button when loading', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Event Handling', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} isLoading>
          Loading
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct button role', () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('passes through aria attributes', () => {
      render(
        <Button aria-label='Custom aria label' aria-describedby='description'>
          Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom aria label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('supports keyboard navigation', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyUp(button, { key: 'Enter' });
    });
  });

  describe('HTML Attributes', () => {
    it('passes through additional HTML attributes', () => {
      render(
        <Button data-testid='custom-button' title='Button title' type='submit'>
          Custom
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('title', 'Button title');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });
});
