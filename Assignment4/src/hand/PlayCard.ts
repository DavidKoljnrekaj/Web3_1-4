import { IHand } from '../models/IHand';
import { ICard } from '../models/ICard';

export function playCard(
    hand: IHand,
    playerId: string,
    card: ICard,
    chosenColor?: ICard['color'],
    saidUno: boolean = false
  ): IHand 
   {
  const currentPlayer = hand.players[hand.currentPlayerIndex];

  
  // Ensure it's the current player's turn
  if (currentPlayer.id !== playerId) {
    throw new Error("It's not your turn!");
  }

  // Check if the player has the card in their hand
  const cardIndex = currentPlayer.hand.findIndex(c => c === card);
  if (cardIndex === -1) {
    throw new Error('Card not found in hand!');
  }

  // Get the top card on the discard pile
  const topCard = hand.deck.discardPile[hand.deck.discardPile.length - 1];

  // Validate the card based on UNO rules
  const isValid =
    card.color === topCard.color || // Match by color
    card.number !== undefined && card.number === topCard.number || // Match by color
    card.type === 'BLOCK' && topCard.type === 'BLOCK' ||  // Match by type
    card.type === 'REVERSE' && topCard.type === 'REVERSE' ||  // Match by type
    card.type === 'DRAW2' && topCard.type === 'DRAW2' ||  // Match by type
    card.type === 'WILD' ||        // Wild card can be played anytime
    card.type === 'DRAW4';         // Draw 4 can be played anytime (special rules apply)

    if (!isValid) {
        throw new Error('Invalid move! Card must match the top card by color, type, or number, or be a wild card.');
      }
    
      // Handle color selection for WILD or DRAW4
      let updatedCard = { ...card };
      if ((card.type === 'WILD' || card.type === 'DRAW4') && chosenColor) {
        if (!['RED', 'BLUE', 'GREEN', 'YELLOW'].includes(chosenColor)) {
          throw new Error('Invalid color choice. Choose one of: RED, BLUE, GREEN, YELLOW.');
        }
        updatedCard = { ...card, color: chosenColor }; // Update the card with the chosen color
      } else if (card.type === 'WILD' || card.type === 'DRAW4') {
        throw new Error('A color must be chosen when playing a WILD or DRAW4 card.');
      }
    
      // Remove the card from the player's hand
      const updatedHand = [...currentPlayer.hand];
      updatedHand.splice(cardIndex, 1);
    
      // Update players
      const updatedPlayers = hand.players.map(player =>
        player.id === playerId ? { ...player, hand: updatedHand } : player
      );
    
      // Add the played card to the discard pile
      const updatedDiscardPile = [...hand.deck.discardPile, updatedCard];
    
      // Determine the next player index
      let nextPlayerIndex = (hand.currentPlayerIndex + hand.direction + hand.players.length) % hand.players.length;
    

  // Handle special cards
  if (card.type === 'REVERSE') {
    // Reverse the direction of play
    hand.direction = (-hand.direction as 1 | -1);
  } else if (card.type === 'BLOCK') {
    // Skip the next player's turn
    nextPlayerIndex = (nextPlayerIndex + hand.direction + hand.players.length) % hand.players.length;
  } else if (card.type === 'DRAW2') {
    // Force the next player to draw 2 cards
    const nextPlayer = updatedPlayers[nextPlayerIndex];
    const cardsToDraw = hand.deck.drawPile.splice(0, 2);
    const updatedNextPlayerHand = [...nextPlayer.hand, ...cardsToDraw];
    updatedPlayers[nextPlayerIndex] = { ...nextPlayer, hand: updatedNextPlayerHand };
  }

  return {
    ...hand,
    players: updatedPlayers,
    deck: {
      ...hand.deck,
      discardPile: updatedDiscardPile,
    },
    currentPlayerIndex: nextPlayerIndex,
    saidUno, // Track whether the player said UNO
  }; 
}
