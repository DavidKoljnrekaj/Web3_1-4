import type { ICard } from './IDeck'; // Assuming Card interface is in Deck.ts
import type { IHand } from './IHand';

// Define the Bot interface
export interface IBot {
  // Bot's hand (array of cards)
  hand: ICard[];

  hasSaidUno: boolean;

  //Get name
  getName():string;

  // The bot makes a play based on the current discard pile
  playCard(hand: IHand): void;

  // The bot draws a card (you can implement the draw logic separately)
  drawCard(newCard: ICard, botNumber: number): void;
  // Check if the bot has forgotten to say UNO (if it has only one card left)
  shouldSayUno(): boolean;

  // Bot announces UNO
  sayUno(botNumber: number): void;

  addCard(card: ICard): void;

  getCards(): ICard[];

  resetUno(): void;
}
