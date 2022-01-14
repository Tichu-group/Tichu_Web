import Game from '../model/game';

class GameManager {
  public games = new Map<string, Game>();
}

export default GameManager;
