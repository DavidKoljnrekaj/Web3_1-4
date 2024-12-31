import type { ICard } from './IDeck';
export interface IPlayerHand {
  hasSaidUno: boolean;  

  //Get name
  getName():string;

  // Add a card to the player's hand
  addCard(card: ICard): void;

  // Remove a card from the player's hand
  removeCard(card: ICard): void;

  // Get all the cards in the player's hand
  getCards(): ICard[];

  // Check if the player can play a card based on the top card of the discard pile
  getPlayableCard(topCard: ICard): ICard | undefined;

  // Check if the player has exactly one card left
  hasUno(): boolean;

  sayUno(): void;

  hasUno(): boolean;

  resetUno(): void;
}
