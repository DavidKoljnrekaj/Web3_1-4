import { IHand } from '../models/IHand';
export function sayUno(hand: IHand, playerId: string): IHand {
    const currentPlayer = hand.players[hand.currentPlayerIndex];
  
    if (currentPlayer.id !== playerId) {
      throw new Error("It's not your turn!");
    }
  
    if (currentPlayer.hand.length !== 1) {
      throw new Error('You can only say UNO when you have exactly one card.');
    }
  
    return {
      ...hand,
      saidUno: true,
    };
  }
  