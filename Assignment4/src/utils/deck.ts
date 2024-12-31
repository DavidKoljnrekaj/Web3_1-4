import { ICard } from '../models/ICard';

export function initializeDeck(): ICard[] {
  const colors: ICard['color'][] = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
  const deck: ICard[] = [];

  // Add numbered cards (0-9 twice, except 0)
  colors.forEach(color => {
    for (let i = 0; i <= 9; i++) {
      deck.push({ type: 'NUMBERED', color, number: i });
      if (i !== 0) deck.push({ type: 'NUMBERED', color, number: i });
    }
  });

  // Add special cards (BLOCK, REVERSE, DRAW2) twice per color
  colors.forEach(color => {
    ['BLOCK', 'REVERSE', 'DRAW2'].forEach(type => {
      deck.push({ type: type as ICard['type'], color });
      deck.push({ type: type as ICard['type'], color });
    });
  });

  // Add wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({ type: 'WILD', color: 'BLACK' });
    deck.push({ type: 'DRAW4', color: 'BLACK' });
  }

  return deck;
}

// Shuffle Deck
export function shuffleDeck(deck: ICard[]): ICard[] {
  return [...deck].sort(() => Math.random() - 0.5);
}