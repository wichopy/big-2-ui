<script>
  import { onMount } from 'svelte'
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import CardHand from "./CardHand.svelte";
  import PlayArea from "./PlayArea.svelte";
  import HiddenCard from "./HiddenCard.svelte";
  import { gameData, currentPlayerCards, lastPlayedCards, currentPlayerId, gameOver,
    playerLCards, playerRCards, playerTCards,
    playLName, playRName, playTName,
    youHaveToGo,
  } from './store.ts'
  import { BASE_URL } from "./config.ts";

  let gameId
  $: toggledCards = [];

  function toggleCard(value) {
    const index = toggledCards.findIndex(c => c === value);
    if (index > -1) {
      toggledCards = [...toggledCards.slice(0,index), ...toggledCards.slice(index+1)]
    } else {
      toggledCards = [...toggledCards, value]
    }
  }

  async function makeNewGame() {
    const makeGameResp = await fetch(`${BASE_URL}/game`, {
      method: "POST",
      body: JSON.stringify({
        // need to send an empty object or it will die on the server
        // numPlayers: 2,
      })
    })
    const makeGameJson = await makeGameResp.json()
    gameId = makeGameJson.id
    const resp = await fetch(`${BASE_URL}/game/${makeGameJson.id}`)
    const json = await resp.json()

    gameData.set(json)
  }

  onMount(() => {
    makeNewGame()
  })

  async function handlePlay() {
    await fetch(`${BASE_URL}/game/${gameId}/actions/play-cards`, {
      method: "POST",
      body: JSON.stringify({
        playerId: $currentPlayerId,
        cards: toggledCards,
      }),


    })

    const resp = await fetch(`${BASE_URL}/game/${gameId}`)
    const json = await resp.json()
    
    onAfterTurn(json)
  }

  async function onAfterTurn (newGameState) {
    toggledCards = []
    gameData.set(newGameState)
  }

  async function handlePass() {
    await fetch(`${BASE_URL}/game/${gameId}/actions/pass-turn`, {
      method: 'POST',
      body: JSON.stringify({
        playerId: $currentPlayerId,
      }),
    })
    const resp = await fetch(`${BASE_URL}/game/${gameId}`)
    const json = await resp.json()

    onAfterTurn(json)
  }
</script>

<style>
  .game-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "tl-corner top-player tr-corner"
      "left-player play-area right-player"
      "bl-corner current-player-area br-corner";
  }
  .left-player {
    grid-area: left-player;
    display: flex;
    flex-direction: column;
    max-height: 500px;
    align-items: end;
  }
  .right-player {
    grid-area: right-player;
    display: flex;
    flex-direction: column;
    max-height: 40vh;
  }
  .top-player {
    grid-area: top-player;
    display: flex;
    flex-direction: row;
    max-width: 500px;
  }
  .current-player {
    grid-area: current-player-area;
  }

  .play-area {
    grid-area: play-area;
  }
</style>

{#if $gameOver}
  <h2>Gameover!</h2>
{:else }
  <h2>playersTurn: {$currentPlayerId}</h2>
{/if}
<br />

<div class="game-grid">
  <div class="left-player">
    {$playLName}
    Cards left: {$playerLCards}
    {#each Array($playerLCards) as card}
      <HiddenCard />
    {/each}  
  </div>

  <div class="right-player">
    {$playRName}
    Cards left: {$playerRCards}
    {#each Array($playerRCards) as card}
      <HiddenCard />
    {/each}  
  </div>

  <div class="top-player">
    {$playTName}
    Cards left: {$playerTCards}
    {#each Array($playerTCards) as card}
      <HiddenCard />
    {/each}  
  </div>

  <div class="play-area">
    <PlayArea>
      {#each $lastPlayedCards as card}
        <Card value={card} />
      {/each}  
    </PlayArea>
  </div>

  <div class="current-player">
    <CardHand>
    {#each $currentPlayerCards as card}
      <Card value={card} toggleCard={toggleCard} selected={toggledCards?.includes(card)} />
    {/each}
    </CardHand>
    {$currentPlayerId}
    <Button handleClick={handlePlay} disabled={!toggledCards.length}>Play cards</Button>
    <Button handleClick={handlePass} disabled={$youHaveToGo}>Pass</Button>
  </div>
</div>

{#if $gameOver}
  <Button variant="action" handleClick={makeNewGame} >Play again</Button>
{/if}