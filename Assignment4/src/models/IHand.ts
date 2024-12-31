import { IDeck } from './IDeck';
import { ICard } from './ICard';
import { IPlayer } from './IPlayer';

export interface IHand {
  players: IPlayer[];
  deck: IDeck;
  currentPlayerIndex: number;
  direction: 1 | -1; // 1 for clockwise, -1 for counterclockwise
  saidUno: boolean; // Whether the current player has said UNO
}

