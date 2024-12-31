import { IHand } from '../models/IHand';
import { IPlayer } from '../models/IPlayer';
import { initializeDeck, shuffleDeck } from '../utils/deck';

export function startHand(playerIds: string[]): IHand {
  const deck = shuffleDeck(initializeDeck());
  const players: IPlayer[] = playerIds.map(id => ({
    id,
    hand: deck.splice(0, 7), // Deal 7 cards
  }));

  const discardPile = [deck.pop()!]; // Start the discard pile

  return {
    players,
    deck: { drawPile: deck, discardPile },
    currentPlayerIndex: 0,
    direction: 1,
    saidUno: false,
  };
}
