import { Deck, ICard } from './Deck';
import { PlayerHand } from './PlayerHand';
import Game from './Game';

export class Hand {
  private players: string[];
  private deck: Deck;
  private playerHands: Map<string, PlayerHand>; // Map of players and their hands
  private previousPlayer: string = '';
  private direction: number = 1;
  private block: number = 0;
  private game: Game;
  currentPlayer: string = '';
  discardPile: ICard;
  drawAmount: number = 0;
  hasEnded: boolean = false;
  winner: string = '';
  winnerScore: number = 0;
  saidUno: boolean = false;

  constructor(game: Game) {
    this.game = game;
    this.players = game.getPlayers();
    this.playerHands = new Map();

    this.deck = new Deck();
    this.deck.initialize();
    this.deck.shuffle();

    // Initialize hands for all players and deal 7 cards each
    this.players.forEach((player) => {
      const hand = new PlayerHand(player);
      for (let i = 0; i < 7; i++) {
        hand.addCard(this.deck.deal());
      }
      this.playerHands.set(player, hand);
    });

    this.discardPile = this.deck.deal();
    this.currentPlayer = this.players[0];
  }

  play(card: ICard, player: string, chosenColor?: string): boolean {
    console.log(card);
    if (
      !(
        card.color == this.discardPile.color ||
        card.number == this.discardPile.number ||
        (card.type == 'REVERSE' && this.discardPile.type == 'REVERSE') ||
        (card.type == 'BLOCK' && this.discardPile.type == 'BLOCK') ||
        (card.type == 'DRAW2' && this.discardPile.type == 'DRAW2') ||
        ['WILD', 'DRAW4'].includes(card.type)
      )
    ) {
      console.warn("Cannot play that card");
      return false;
    }

    const playerHand = this.playerHands.get(player);
    if (!playerHand) {
      console.warn("Player not found");
      return false;
    }

      playerHand.removeCard(card);

    this.discardPile = card;

    if (card.type === 'BLOCK') {
      this.block = 1;
    } else if (card.type === 'REVERSE') {
      this.direction = -1 * this.direction;
    } else if (card.type === 'WILD') {
      if (chosenColor) {
        this.discardPile.color = chosenColor as "RED" | "BLUE" | "GREEN" | "YELLOW" | "BLACK";
      } else {
        console.warn("No color chosen for wild card");
        return false;
      }
    } else if (card.type === 'DRAW2') {
      this.drawAmount = 2;
    } else if (card.type === 'DRAW4') {
      this.drawAmount = 4;
      if (chosenColor) {
        this.discardPile.color = chosenColor as "RED" | "BLUE" | "GREEN" | "YELLOW" | "BLACK";
      } else {
        console.warn("No color chosen for wild card");
        return false;
      }
    }
    this.checkWin(player);
    return true;
  }

  drawCard(player: string) {
    const playerHand = this.playerHands.get(player);
    if (!playerHand) {
      console.warn("Player not found");
      return;
    }

    const card = this.deck.deal();
    playerHand.addCard(card);
  }

  setPlayers(x: number) {
    const y = this.players.indexOf(this.currentPlayer) + x * this.direction;
    this.previousPlayer = this.currentPlayer;
    this.currentPlayer = this.players[
      (y % this.players.length + this.players.length) % this.players.length
    ];
  }

  endTurn(player: string, saidUno?: boolean) {
    const playerHand = this.playerHands.get(player);
    if (!playerHand) {
      console.warn("Player not found");
      return;
    }

    if (saidUno !== undefined) {
      this.saidUno = saidUno;

      if (player === this.currentPlayer && saidUno) {
        playerHand.sayUno();
      }
    }

    this.setPlayers(1 + this.block);

    if (this.hasEnded) {
      console.log("Game ended");
      return;
    }

    console.log(this.currentPlayer + "'s turn");

    const currentPlayerHand = this.playerHands.get(this.currentPlayer);
        if (currentPlayerHand) {
          currentPlayerHand.resetUno();
          if (this.drawAmount !== 0) {    
        for (let i = 0; i < this.drawAmount; i++) {
          currentPlayerHand.addCard(this.deck.deal());
        }
        }
      }
    

    this.block = 0;
    this.drawAmount = 0;
  }

  checkWin(player: string) {
    const playerHand = this.playerHands.get(player);
    if (!playerHand) {
      console.warn("Player not found");
      return;
    }

    if (playerHand.getCards().length === 0) {
      this.hasEnded = true;
      this.winner = player;
      this.drawAmount = 0;
      this.calculateScore();
    }
  }

  calculateScore() {
    let score = 0;

    this.players.forEach((player) => {
      const playerHand = this.playerHands.get(player);
      if (playerHand) {
        score += this.calculatePoints(playerHand.getCards());
      }
    });

    this.winnerScore = score;
    this.game.endHand(this.winner, this.winnerScore);
  }

  calculatePoints(hand: ICard[]): number {
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
  }

  getPlayerHand(player: string): PlayerHand | undefined {
    return this.playerHands.get(player);
  }

  getTopCard(): ICard {
    return this.discardPile;
  }

  getCurrentPlayer(): string {
    return this.currentPlayer;
  }

  getPlayersHands(): { username: string; cards: ICard[] }[] {
    const playersHands: { username: string; cards: ICard[]; hasSaidUno: boolean }[] = [];
    this.playerHands.forEach((hand, username) => {
      playersHands.push({
        username: username,
        cards: hand.getCards(),
        hasSaidUno: hand.hasSaidUno
      });
    });
    console.log("asdas "+this.playerHands)
    return playersHands;
  }

  calloutUno(callingPlayer: string): string | null {
    let penalizedPlayer: string | null = null;

    this.playerHands.forEach((playerHand, username) => {
        if (playerHand.getCards().length === 1 && !playerHand.hasSaidUno) {
            // This player didn't say UNO with 1 card, apply penalty
            for (let i = 0; i < 4; i++) {
                playerHand.addCard(this.deck.deal());
            }
            penalizedPlayer = username;
            console.log(`${username} penalized for not saying UNO!`);
        }
    });

    if (penalizedPlayer) {
        console.log(`${callingPlayer} successfully called out ${penalizedPlayer}!`);
        return penalizedPlayer; // Return penalized player's username
    } else {
        console.log(`Callout by ${callingPlayer} was unsuccessful. No penalties applied.`);
        return null; // No penalties applied
    }
}

}
