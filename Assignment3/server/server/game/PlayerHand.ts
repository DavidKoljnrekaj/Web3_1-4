import type { ICard } from './Deck';

export class PlayerHand {
    private cards: ICard[] = [];
    private name: string;
    hasSaidUno = false;
  
    constructor(player: string) {
      this.name = player
    }

    getName(): string {
      return this.name;
    }

    // Add a card to the hand
    addCard(card: ICard): void {
      this.cards.push(card);
    }
  
    // Remove a card from the hand
    removeCard(card: ICard): boolean {
      const cardIndex = this.cards.findIndex(
        (c) =>
          c.type === card.type &&
          c.color === card.color &&
          c.number === card.number
      );
    
      if (cardIndex === -1) {
        console.warn("Card not found in hand");
        return false;
      }
    
      this.cards.splice(cardIndex, 1); // Remove the card at the found index
      return true;
    }
  
    // Get all cards in the player's hand
    getCards(): ICard[] {
      return this.cards;
    }
  
    // Check if the player can play a card based on the top card in the discard pile
    getPlayableCard(topCard: ICard): ICard | undefined {
      return this.cards.find(card => 
        card.color === topCard.color || 
        card.number === topCard.number || 
        card.type === 'WILD' || 
        card.type === 'DRAW4'
      );
    }
  
    // Check if the player has only one card left (for UNO call)
    hasUno(): boolean {
      return this.cards.length === 1;
    }

    sayUno() {
      if (this.getCards().length === 1) {
        this.hasSaidUno = true; // Set the UNO state
      }
    }
  
    resetUno() {
      this.hasSaidUno = false; // Reset the UNO state
    }
  }