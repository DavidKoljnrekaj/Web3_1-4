import type { ICard } from '../interfaces/IDeck'; 
import type { IDeck } from '../interfaces/IDeck';  

export class Deck implements IDeck {
    private cards: ICard[] = [];
  
    // Initialize the deck with 108 cards, including special cards
    initialize(): ICard[] {
      const colors: ICard['color'][] = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
      const deck: ICard[] = [];
  
      // Numbered cards (0 to 9, two of each except for 0)
      colors.forEach((color) => {
        for (let i = 0; i <= 9; i++) {
          deck.push({ type: 'NUMBERED', color, number: i });
          if (i > 0) deck.push({ type: 'NUMBERED', color, number: i });
        }
      });
  
      // Special cards (two of each per color)
      colors.forEach((color) => {
        for (let i = 0; i < 2; i++) {
          deck.push({ type: 'BLOCK', color });
          deck.push({ type: 'REVERSE', color });
          deck.push({ type: 'DRAW2', color });
        }
      });
  
      // Wild and Draw4 cards (four of each, color is null)
      for (let i = 0; i < 4; i++) {
        deck.push({ type: 'WILD', color: 'BLACK' });
        deck.push({ type: 'DRAW4', color: 'BLACK'});
      }
  
      this.cards = deck;
      return this.cards;
    }
  
    // Shuffle the deck using the Fisher-Yates algorithm
    shuffle(): void {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; // Swap cards
      }
    }
  
    // Deal a card from the deck (removes the card from the deck)
    deal(): ICard {
      const card = this.cards.shift();
      if (!card) {
        throw new Error('The deck is empty. No more cards to deal.');
      }
      return card;
    }
    // Return the current size of the deck
    size(): number {
      return this.cards.length;
    }
  }
  
      