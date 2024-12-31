export interface ICard {
  type: 'NUMBERED' | 'BLOCK' | 'REVERSE' | 'DRAW2' | 'WILD' | 'DRAW4';
  color: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK'; // Wild cards have null color
  number?: number; // Only present for NUMBERED cards
}

export interface IDeck {
  // Initialize the deck with 108 cards, including special cards
  initialize(): ICard[];

  // Shuffle the deck using a provided shuffling method
  shuffle(): void;

  // Deal a card from the deck (removes the card from the deck)
  deal(): ICard;

  // Return the current size of the deck
  size(): number;
}
