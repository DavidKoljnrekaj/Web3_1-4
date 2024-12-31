import { Hand } from './Hand';

export default class Game {
  private players: string[] = [];
  private scores: Map<string, number> = new Map<string, number>();
  private currentHand: Hand | null = null;
  hasEnded: boolean = false;

  constructor(player: string) {
    this.players.push(player);
    this.scores.set(player, 0);
  }

  addPlayer(username: string): void {
    if (!this.players.includes(username)) {
      this.players.push(username);
      this.scores.set(username, 0);
    }
  }

  startNewHand(): Hand {
    this.currentHand = new Hand(this);
    return this.currentHand;
  }

  getScores(): Map<string, number> {
    return new Map([...this.scores.entries()].sort((a, b) => b[1] - a[1]));
  }

  updateScores(winner: string, score: number): void {
    const currentScore = this.scores.get(winner) || 0;
    this.scores.set(winner, currentScore + score);
    if (currentScore + score >= 500) {
      this.hasEnded = true;
    }
  }

  getPlayers(): string[] {
    return this.players;
  }

  endHand(winner: string, score: number): number {
    const current = this.scores.get(winner) || 0;
    this.scores.set(winner, current + score);
    if ((this.scores.get(winner)|| 0) >= 500)
    {
      this.hasEnded = true;
    }
    return this.scores.get(winner)!;
  }

  getHand(): Hand | null {
    return this.currentHand;
  }
}
