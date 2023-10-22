<script>
  import { onMount } from 'svelte'
  import { gameData, currentPlayerCards, lastPlayedCards, currentPlayerId, gameOver,
    playerLCards, playerRCards, playerTCards,
    playLName, playRName, playTName,
    youHaveToGo,
    userData,
    inRoom,
  } from './store.ts'
  import { generateUserName } from './util.ts'
  import Entry from './Entry.svelte'
  import Room from './Room.svelte'
  import Game from './Game.svelte'

  let clientSideUserId
  let clientSideUserName
  onMount(() => {
    const storedUserId = localStorage.getItem('BIG_TWO_clientSideUserId')
    const storedUserName = localStorage.getItem('BIG_TWO_clientSideUserName')
    if (!storedUserId) {
      clientSideUserId = (Math.random() * 1000000000000).toString(32)
      localStorage.setItem('BIG_TWO_clientSideUserId', clientSideUserId)
    }
    if (!storedUserName) {
      clientSideUserName = generateUserName()
      localStorage.setItem('BIG_TWO_clientSideUserName', clientSideUserName)
    }

    userData.set({
      userId: storedUserId,
      userName: storedUserName,
    })
  })
</script>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }

  main br {
    margin: 16px 0;
  }
</style>

<main>
  <h1>Big Two</h1>
  <h4>Welcome, {$userData.userName}</h4>

  <br />
  {#if !$inRoom}
    <Entry />
  {:else}
    <Room />
  {/if}

  <br />

</main>