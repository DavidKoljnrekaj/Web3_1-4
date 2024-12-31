import { ICard } from './ICard';

export interface IDeck {
  drawPile: ICard[];
  discardPile: ICard[];
}
