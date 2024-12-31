import { IPlayer } from '../models/IPlayer';

export function calculateScores(players: IPlayer[]): Record<string, number> {
  return players.reduce((scores, player) => {
    const score = player.hand.reduce((total, card) => {
      if (card.type === 'NUMBERED') return total + (card.number ?? 0);
      if (card.type === 'DRAW2' || card.type === 'REVERSE' || card.type === 'BLOCK') return total + 20;
      if (card.type === 'WILD' || card.type === 'DRAW4') return total + 50;
      return total;
    }, 0);

    return { ...scores, [player.id]: score };
  }, {});
}
