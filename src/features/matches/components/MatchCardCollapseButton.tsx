import React from 'react';

interface MatchCardCollapseButtonProps {
  open: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const MatchCardCollapseButtonComponent: React.FC<
  MatchCardCollapseButtonProps
> = ({ open, onClick }) => (
  <button
    className='absolute right-4 bottom-4 bg-base-100/90 glass rounded-full shadow-lg p-2 border-2 border-primary/30 transition z-20 focus:outline-none focus:ring-2 focus:ring-primary/40'
    onClick={onClick}
    aria-label={open ? 'Hide details' : 'Show details'}
    tabIndex={0}
    type='button'
  >
    <span
      className='text-2xl text-primary transition-transform duration-200 font-bold'
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      {open ? '▲' : '▼'}
    </span>
  </button>
);

const MatchCardCollapseButton = React.memo(MatchCardCollapseButtonComponent);
MatchCardCollapseButton.displayName = 'MatchCardCollapseButton';

export default MatchCardCollapseButton;
