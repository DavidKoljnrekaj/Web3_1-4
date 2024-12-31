import type { IHand } from './IHand';

export interface IGame {
  startNewHand(): IHand;
  endHand(winner: string, score: number): number;
  getScores(): Map<string, number>;   
  getPlayers(): string[]
}
