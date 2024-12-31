import { IGame } from '../models/IGame';
import { startHand } from '../hand/StartHand';

export function startGame(playerIds: string[]): IGame {
  const currentHand = startHand(playerIds);

  const scores = playerIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});

  return {
    scores,
    players: playerIds,
    currentHand,
    targetScore: 500,
  };
}
