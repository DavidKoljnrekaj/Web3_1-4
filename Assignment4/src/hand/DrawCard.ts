import { IHand } from '../models/IHand';


export function drawCard(hand: IHand): IHand {
    const { drawPile, discardPile } = hand.deck;
  
    if (drawPile.length === 0) {
      throw new Error('The draw pile is empty!');
    }
  
    const currentPlayer = hand.players[hand.currentPlayerIndex];
    const updatedHand = [...currentPlayer.hand, drawPile[0]];
  
    const updatedPlayers = hand.players.map(player =>
      player.id === currentPlayer.id ? { ...player, hand: updatedHand } : player
    );
  
    const updatedDeck = {
      drawPile: drawPile.slice(1),
      discardPile,
    };
  
    const nextPlayerIndex = (hand.currentPlayerIndex + hand.direction + hand.players.length) % hand.players.length;
  
    return {
      ...hand,
      players: updatedPlayers,
      deck: updatedDeck,
      currentPlayerIndex: nextPlayerIndex,
    };
  }
  