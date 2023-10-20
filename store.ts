import { writable, derived } from 'svelte/store'

// let cards = ["♠️2", "♠️3", "❤️4", "❤️5", "♦️A", "♣️J"];
// const lastPlayedCards = ["❤️10", "❤️10"];
// const player0Cards = 4;
// const player1Cards = 8;
// const player2Cards = 10;
// let currentPlayerTurn = "player 1";
// let userId = "red-panda";
// let gameId = "1234";

export const gameData = writable();

export const currentPlayer = derived(gameData, ($gameData) => {
  if (!$gameData) return {}
  return $gameData.players[$gameData.currentPlayerTurn]
});

export const currentPlayerCards = derived(gameData, ($gameData) => {
  if (!$gameData) return []
  return $gameData.players[$gameData.currentPlayerTurn].cards.map(card => `${card.suite.charAt(0)}${card.value}`)
})

export const lastPlayedCards = derived(gameData, ($gameData) => {
  if (!$gameData?.lastPlayedCards) return []
  return $gameData.lastPlayedCards.map(card => `${card.suite.charAt(0)}${card.value}`)
})

export const currentPlayerId = derived(gameData, ($gameData) => {
  return $gameData?.currentPlayerTurn
})

export const gameOver = derived(gameData, ($gameData) => {
  return $gameData?.gameStatus === 'over'
})

export const playerLCards = derived(gameData, ($gameData) => {
  // this should be in the backend
  if (!$gameData?.players) return 0
  const pids = Object.keys($gameData?.players)
  console.log(pids)
  const index = pids.indexOf($gameData?.currentPlayerTurn)
  console.log('player R cards', $gameData?.players[pids[(index - 1 < 0 ? pids.length - 1 : index - 1)]])
  return $gameData?.players[pids[(index - 1 < 0 ? pids.length - 1 : index - 1)]]?.cards?.length || 0
})

export const playLName = derived(gameData, ($gameData) => {
  if (!$gameData?.players) return 'unknown'
  const pids = Object.keys($gameData?.players)
  const index = pids.indexOf($gameData?.currentPlayerTurn)
  return $gameData?.players[pids[(index - 1 < 0 ? pids.length - 1 : index - 1)]]?.id || 0
})

export const playTName = derived(gameData, ($gameData) => {
  if (!$gameData?.players) return 'unknown'
  const pids = Object.keys($gameData?.players)
  const index = pids.indexOf($gameData?.currentPlayerTurn)
  return $gameData?.players[pids[(index - 2 < 0 ? pids.length - 2 : index - 2)]]?.id || 0
})

export const playRName = derived(gameData, ($gameData) => {
  if (!$gameData?.players) return 'unknown'
  const pids = Object.keys($gameData?.players)
  const index = pids.indexOf($gameData?.currentPlayerTurn)
  return $gameData?.players[pids[(index - 3 < 0 ? pids.length - 3 : index - 3)]]?.id || 0
})

export const playerTCards = derived(gameData, ($gameData) => {
  // this should be in the backend
  if (!$gameData?.players) return 0
  const pids = Object.keys($gameData?.players)
  console.log(pids)
  const index = pids.indexOf($gameData?.currentPlayerTurn)
  console.log('player t cards', $gameData?.players[pids[(index - 2 < 0 ? pids.length - 2 : index - 2)]])
  return $gameData?.players[pids[(index - 2 < 0 ? pids.length - 2 : index - 2)]]?.cards?.length || 0
})

export const playerRCards = derived(gameData, ($gameData) => {
  // this should be in the backend
  if (!$gameData?.players) return 0
  const pids = Object.keys($gameData?.players)
  console.log(pids)
  const index = pids.indexOf($gameData?.currentPlayerTurn)
  return $gameData?.players[pids[(index - 3 < 0 ? pids.length - 3 : index - 3)]]?.cards?.length || 0
})