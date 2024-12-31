import type { SimpleBot } from '@/Classes/SimpleBot';
import type { ICard } from './IDeck';
import type { IPlayerHand } from './IPlayerHand';
export interface IHand {
  player:IPlayerHand,
  getPreviousPlayer(): string,
  play(card: ICard, chosenColor?: string): boolean;
  endTurn(saidUno?: boolean): void;
  getTopCard(): ICard;
  drawCard(): void;
  getBots(): Map<string, SimpleBot>;
  calloutUno(): void;
}
