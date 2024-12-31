/*import type { ICard } from '../interfaces/IDeck';
import type { IDeck } from '../interfaces/IDeck';
import type { IHand } from '../interfaces/IHand';
import { Hand } from './Hand';
import { PlayerHand } from './PlayerHand';
import { SimpleBot } from './SimpleBot';

export class Game {
  private hands: IHand[] = [];
  private deck: IDeck;
  private scores: number[] = [];
  private players: string[] = [];
  private bots: SimpleBot[] = [];
  private currentPlayerIndex: number = 0;
  private gameOver: boolean = false;
  private winningScore: number = 500;
  private discardPile: ICard[] = [];

  constructor(deck: IDeck) {
    this.deck = deck;
  }

  // Start the game and initialize players and bots
  start(players: string[]): void {
    this.players = players;
    this.scores = players.map(() => 0);
    this.deck.initialize();
    this.deck.shuffle();

    // Deal hands and create bots
    const playerHands = players.map(() => new PlayerHand());
    for (let i = 1; i < players.length; i++) {
      this.bots.push(new SimpleBot(playerHands[i].getCards()));  // Initialize bots with their hands
    }

    // Set discard pile's first card
    this.discardPile.push(this.deck.deal()!);

    // Create the first hand and deal cards
    const firstHand = new Hand(playerHands, this.discardPile, this.deck);
    this.hands.push(firstHand);
  }

  // Play a round of the game
  playRound(): void {
    const currentHand = this.hands[this.hands.length - 1];
    currentHand.play(this.currentPlayerIndex);

    if (currentHand.hasEnded()) {
      this.updateScores();
      if (this.scores.some(score => score >= this.winningScore)) {
        this.gameOver = true;
        console.log(`Game over! Winner: ${this.getWinner()}`);
      } else {
        this.startNewHand();
      }
    } else {
      this.nextPlayer();
    }
  }

  // Play the player's card
  playPlayerCard(index: number): void {
    const currentHand = this.hands[this.hands.length - 1];
    currentHand.play(index);
  }

  // Draw a card for the player
  drawPlayerCard(): void {
    const currentHand = this.hands[this.hands.length - 1];
    currentHand.draw();
  }

  // Bot takes their turn
  playBotTurns(botSaidUno: boolean[], botNames: string[]): void {
    this.bots.forEach((bot, index) => {
      const card = bot.playCard(this.discardPile);

      if (card) {
        this.discardPile.push(card);

        if (bot.hand.length === 1 && !botSaidUno[index]) {
          botNames[index] = `Bot ${index + 1} says UNO`;
          botSaidUno[index] = true;
        } else if (bot.hand.length === 0) {
          this.gameOver = true;
        }
      } else {
        const newCard = this.deck.deal();
        if (newCard) {
          bot.drawCard(newCard);
        }
      }
    });
  }

  // Update the scores based on cards left in hands
  public updateScores(): void {
    const currentHand = this.hands[this.hands.length - 1];
    const winnerIndex = currentHand.winner();
    if (winnerIndex !== undefined) {
      this.scores[winnerIndex] += this.calculatePoints();
    }
  }

  // Calculate points based on cards left in other players' hands
  private calculatePoints(): number {
    return this.players.reduce((total, _, index) => {
      if (index !== this.currentPlayerIndex) {
        const hand = this.hands[this.hands.length - 1].playerHand(index);
        return total + hand.getCards().reduce((handTotal, card) => {
          if (card.type === 'NUMBERED') {
            return handTotal + (card.number || 0);
          } else if (['BLOCK', 'REVERSE', 'DRAW2'].includes(card.type)) {
            return handTotal + 20;
          } else {
            return handTotal + 50;
          }
        }, 0);
      }
      return total;
    }, 0);
  }

  // Get the winner of the game if the game has ended
  getWinner(): string | undefined {
    if (this.gameOver) {
      const winningScoreIndex = this.scores.findIndex(score => score >= this.winningScore);
      return this.players[winningScoreIndex];
    }
    return undefined;
  }

  // Check if the game has ended
  hasGameEnded(): boolean {
    return this.gameOver;
  }

  // Return the current discard pile's top card
  currentDiscardCard(): ICard {
    return this.discardPile[this.discardPile.length - 1];
  }

  // Get the player's hand
  playerHand(): ICard[] {
    return this.hands[this.hands.length - 1].playerHand(0).getCards();
  }

  // Get the bot's hand
  botHand(index: number): ICard[] {
    return this.bots[index].hand;
  }

  private nextPlayer(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  private startNewHand(): void {
    const playerHands = this.players.map(() => new PlayerHand());

    // Create a new hand and deal cards
    const newHand = new Hand(playerHands, [this.deck.deal()!], this.deck);
    this.hands.push(newHand);

    // Reset current player index to the first player for the new hand
    this.currentPlayerIndex = 0;
  }

  public calculateFinalPoints(playerHand: ICard[], botHands: ICard[][], playerName: any, botNames: string[]): void {
    const formatCard = (card: ICard) => {
        if (card.type === 'NUMBERED') {
            return `${card.color}${card.number}`;
        } else {
            return `${card.color}${card.type}`;
        }
    };

    const calculatePoints = (hand: ICard[]): number => {
        return hand.reduce((totalPoints, card) => {
            if (card.type === 'NUMBERED') {
                return totalPoints + (card.number || 0);
            } else if (['BLOCK', 'REVERSE', 'DRAW2'].includes(card.type)) {
                return totalPoints + 20;
            } else if (['WILD', 'DRAW4'].includes(card.type)) {
                return totalPoints + 50;
            }
            return totalPoints;
        }, 0);
    };

    const playerPoints = calculatePoints(playerHand);
    let totalPoints = playerPoints;

    // Calculate bot points and add to total
    botHands.forEach((botHand) => {
        totalPoints += calculatePoints(botHand);
    });

    let winnerIndex: number | null = null;

    // Check if the player is the winner
    if (playerHand.length === 0) {
        winnerIndex = 0; // Player is the winner
    } else {
        // Check if any bot is the winner
        botHands.forEach((botHand, index) => {
            if (botHand.length === 0) {
                winnerIndex = index + 1; // Bot's index is +1 due to the player's position
            }
        });
    }
    
    
    
    //Update the points for the player and bots
    playerName.value = `I finished with ${playerPoints} points`;
    botHands.forEach((botHand, index) => {
      if((winnerIndex-1)!=index)
      {
        const botPoints = calculatePoints(botHand);
        botNames[index] = `${botNames[index]} finished with ${botPoints} points`;
      }
    });
    // Update the winner's name
    if (winnerIndex === 0) {
        playerName.value = `I won and gained ${totalPoints} points`;
    } else if (winnerIndex && winnerIndex > 0) {
        botNames[winnerIndex - 1] = `${botNames[winnerIndex - 1]} won and gained ${totalPoints} points`;
    }
}
}
*/

import type { ICard } from '../interfaces/IDeck';
import type { IDeck } from '../interfaces/IDeck';
import type { IHand } from '../interfaces/IHand';
import { Hand } from './Hand';
import { PlayerHand } from './PlayerHand';
import { SimpleBot } from './SimpleBot';

export class Game {
  private players: string[] = [];
  private scores: Map<string, number> = new Map<string, number>();
  private botNames: string[] = ["Lovre","Benjo","David"];
  hasEnded: boolean = false;

  constructor(player: string, noOfBots: number) {
    this.players = [player];
    for (let i = 0; i < noOfBots; i++) {
      this.players.push(this.botNames[i])
      console.log(noOfBots)
    }
    for (const playerName of this.players) {
      this.scores.set(playerName, 0); 
    }
  }

  startNewHand(): IHand {
    return new Hand(this);
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

  getScores(): Map<string, number> {
    const sortedScores = Array.from(this.scores.entries())
        .sort((a, b) => b[1] - a[1]);
    return new Map(sortedScores);
}

  getPlayers(): string[]{
    return this.players;
  }

  getBotNames(): string[]{
    return this.botNames;
  }
}