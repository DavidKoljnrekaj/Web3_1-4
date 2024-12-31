import type { ICard } from '../interfaces/IDeck';
import type { IBot } from '../interfaces/IBot';
import type { IHand } from '../interfaces/IHand';

export class SimpleBot implements IBot {
  hand: ICard[] = [];
  name: string;
  hasSaidUno = false; // New property to track "UNO" state

  

  constructor(name: string) {
    this.name = name;  // Store bot's name
  }

  getName(): string {
    return this.name;
  }

  playCard(hand: IHand) {
    this.checkCallout(hand);
    const topCard = hand.getTopCard()
    if (topCard.number == undefined)
    {topCard.number = -1;}
    const legalPlays = this.hand.filter(card => (
      card.color === topCard.color || 
      card.number === topCard.number || 
      card.type === 'DRAW2' && topCard.type === 'DRAW2' ||
      card.type === 'WILD' || 
      card.type === 'DRAW4'
    ));
    setTimeout(() => {
    if (legalPlays.length > 0) {
      const chosenCard = legalPlays[Math.floor(Math.random() * legalPlays.length)];
      if (chosenCard.color == 'BLACK')
      {
        let color = this.mostCommonColor()
        if(hand.play(chosenCard, color))
          {
          this.hand = this.hand.filter(card => card !== chosenCard);
          console.log(`${this.name} played: ${chosenCard.color} ${chosenCard.number || chosenCard.type}`);
          hand.endTurn();
          return;
          }
      }
      if(hand.play(chosenCard))
      {
      this.hand = this.hand.filter(card => card !== chosenCard);
      console.log(`${this.name} played: ${chosenCard.color} ${chosenCard.number || chosenCard.type}`);
      let sayUno = false;
      if(this.shouldSayUno())
      {
        sayUno = true;
      }
      hand.endTurn(sayUno);
      return;
      }
    }
      else
      {
        hand.drawCard()
        hand.endTurn();
      }; 
  }, 20);   
  }

  drawCard(newCard: ICard): void {
      this.hand.push(newCard);
    console.log(`${this.name} drew a card`);
  }

  shouldSayUno(): boolean {
    if (this.hand.length === 1) {
        return Math.random() < 0.8;
    }
    return false;
}
  sayUno() {
    console.log(`${this.name} says UNO!`);
    this.hasSaidUno = true; // Set the UNO state
  }

  resetUno() {
    this.hasSaidUno = false; // Reset the UNO state
  }

  removeCard(card: ICard): void {
    const index = this.hand.findIndex(c => c === card);
    if (index !== -1) {
      this.hand.splice(index, 1);
    }
  }

  addCard(card: ICard): void {
    this.hand.push(card);
  }

  getCards(): ICard[]{
    return this.hand;
  }

  mostCommonColor(): string | undefined {
    // Filter out cards that are black, then count each color

    const colorCounts: Record<string, number> = {};
    
    this.hand.forEach(card => {
      if (card.color !== 'BLACK') {
        colorCounts[card.color] = (colorCounts[card.color] || 0) + 1;
      }
    });
  
    // Find the color with the maximum count
    let mostCommon: string | null = null;
    let maxCount = 0;
  
    for (const color in colorCounts) {
      if (colorCounts[color] > maxCount) {
        maxCount = colorCounts[color];
        mostCommon = color;
      }
    }
  
    return mostCommon || undefined;
  }

  checkCallout(hand: IHand){

    if(hand.getBots().get(hand.getPreviousPlayer()))
    {
      if (hand.getBots().get(hand.getPreviousPlayer())?.getCards().length == 1 && Math.random() < 0.8)
      {
        hand.calloutUno();
      }  
    }
    else{
      if (hand.player.getCards().length == 1 && Math.random() < 0.8)
        {
          hand.calloutUno();
        }  
    }
  }
}
