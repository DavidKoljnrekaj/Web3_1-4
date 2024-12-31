export interface ICard {
    type: 'NUMBERED' | 'BLOCK' | 'REVERSE' | 'DRAW2' | 'WILD' | 'DRAW4';
    color: 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK';
    number?: number;
  }
  