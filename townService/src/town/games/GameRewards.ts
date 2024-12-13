// function takes in updatedState: GameInstance<>, and a gameArea: GameArea
// Handles updating the winner and loser coin rewards and winstreaks.

import userController from '../../db/controllers/userController';
import {
  ConnectFourGameState,
  GameInstance,
  TicTacToeGameState,
} from '../../types/CoveyTownSocket';

async function processGameRewards(winner: string | undefined, loser: string | undefined) {
  // Update the coins and winstreaks for the winner and loser
  // winner block
  if (winner !== undefined) {
    // get user.id from userName
    const winnerUser = await userController.getUser(winner);
    // update winnerUser winstreak, get new winstreak/user
    const updatedWinner = await userController.updateUserWinstreak(winnerUser?._id, true);
    const winnerWinstreak = updatedWinner.playerstats.winstreak;
    const winnerCoins = updatedWinner.playerstats.coins + 100 + winnerWinstreak * 20;
    userController.setUserCoins(winner, winnerCoins);
  }
  // loser block
  if (loser !== undefined) {
    const loserUser = await userController.getUser(loser);
    const updatedLoser = await userController.updateUserWinstreak(loserUser?._id, false);
    const loserCoins = updatedLoser.playerstats.coins + 25; // loser coins + 25
    userController.setUserCoins(loser, loserCoins);
  }
}

// handle game over rewards for ConnectFour
async function connectFourRewardHandler(
  updatedState: GameInstance<ConnectFourGameState>,
  redName: string | undefined,
  yellowName: string | undefined,
) {
  const { winner, red, yellow } = updatedState.state; // red, yellow: PlayerID
  // loser = not winner, it reads really ugly- sorry
  const loser = winner === red ? yellowName : redName;

  await processGameRewards(winner, loser);
}

// handle game over rewards for TicTacToe
async function ticTacToeRewardHandler(
  updatedState: GameInstance<TicTacToeGameState>,
  xName: string | undefined,
  oName: string | undefined,
) {
  const { winner, x, o } = updatedState.state; // Use object destructuring to extract the 'winner' property from 'updatedState.state'
  const loser = winner === x ? oName : xName;

  await processGameRewards(winner, loser);
}

export default { connectFourRewardHandler, ticTacToeRewardHandler };
