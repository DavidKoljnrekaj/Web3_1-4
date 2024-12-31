import { IHand } from './IHand';

export interface IGame {
  scores: Record<string, number>;
  players: string[];
  currentHand: IHand;
  targetScore: number;
}
