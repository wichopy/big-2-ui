<script>
  import { onMount } from 'svelte'
  import { gameData, currentPlayerCards, lastPlayedCards, currentPlayerId, gameOver,
    playerLCards, playerRCards, playerTCards,
    playLName, playRName, playTName,
  } from './store.ts'
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import CardHand from "./CardHand.svelte";
  import PlayArea from "./PlayArea.svelte";
  import HiddenCard from "./HiddenCard.svelte";

  let gameId

  async function makeNewGame() {
    const makeGameResp = await fetch("http://localhost:3000/game", {
      method: "POST",
    })
    const makeGameJson = await makeGameResp.json()
    console.log(makeGameJson)
    gameId = makeGameJson.id
    const resp = await fetch(`http://localhost:3000/game/${makeGameJson.id}`)
    const json = await resp.json()

    console.log(json)
    gameData.set(json)
  }

  onMount(makeNewGame)

  $: toggledCards = [];

  function toggleCard(value) {
    const index = toggledCards.findIndex(c => c === value);
    if (index > -1) {
      toggledCards = [...toggledCards.slice(0,index), ...toggledCards.slice(index+1)]
    } else {
      toggledCards = [...toggledCards, value]
    }

    console.log(toggledCards);
  }

  async function handlePlay() {
    console.log("play cards", toggledCards);
    await fetch(`http://localhost:3000/game/${gameId}/actions/play-cards`, {
      method: "POST",
      body: JSON.stringify({
        playerId: $currentPlayerId,
        cards: toggledCards,
      }),


    })

    const resp = await fetch(`http://localhost:3000/game/${gameId}`)
    const json = await resp.json()
    
    onAfterTurn(json)
  }

  async function onAfterTurn (newGameState) {
    toggledCards = []
    gameData.set(newGameState)
  }

  async function handlePass() {
    await fetch(`http://localhost:3000/game/${gameId}/actions/pass-turn`, {
      method: 'POST',
      body: JSON.stringify({
        playerId: $currentPlayerId,
      }),
    })
    console.log("pass turn");
    const resp = await fetch(`http://localhost:3000/game/${gameId}`)
    const json = await resp.json()

    onAfterTurn(json)
  }
</script>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }

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

<main>
  <h1>Big Two</h1>

  <br />

  {#if $gameOver}
    <h2>Gameover!</h2>
  {:else }
    <h2>playersTurn: {$currentPlayerId}</h2>
  {/if}
  <br />

  <div class="game-grid">
    <div class="left-player">
      {$playLName}
      {#each Array($playerLCards) as card}
        <HiddenCard />
      {/each}  
    </div>

    <div class="right-player">
      {$playRName}
      {#each Array($playerRCards) as card}
        <HiddenCard />
      {/each}  
    </div>

    <div class="top-player">
      {$playTName}
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
      <Button handleClick={handlePlay}>Play cards</Button>
      <Button handleClick={handlePass}>Pass</Button>
    </div>
  </div>

  {#if $gameOver}
    <Button variant="action" handleClick={makeNewGame} >Play again</Button>
  {/if}
</main>