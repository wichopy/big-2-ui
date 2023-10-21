<script>
  import { onMount } from 'svelte'
  import { gameData, currentPlayerCards, lastPlayedCards, currentPlayerId, gameOver,
    playerLCards, playerRCards, playerTCards,
    playLName, playRName, playTName,
    youHaveToGo,
  } from './store.ts'

  import Entry from './Entry.svelte'
  import Game from './Game.svelte'

  let clientSideUserId


  onMount(() => {
    const storedUserId = localStorage.getItem('BIG_TWO_clientSideUserId')
    if (!storedUserId) {
      clientSideUserId = (Math.random() * 1000000000000).toString(32)
      localStorage.setItem('BIG_TWO_clientSideUserId', clientSideUserId)
    }
  })
</script>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<main>
  <h1>Big Two</h1>

  <br />

  <Entry />

  <Game />
</main>