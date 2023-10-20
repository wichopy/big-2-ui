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