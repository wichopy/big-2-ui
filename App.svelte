<script>
  import { onMount } from 'svelte'
  import { gameData, currentPlayerCards, lastPlayedCards, currentPlayerId } from './store.ts'
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import CardHand from "./CardHand.svelte";
  import PlayArea from "./PlayArea.svelte";
  import HiddenCard from "./HiddenCard.svelte";

  let gameId

  onMount(async () => {
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
  })

  let cards = ["♠️2", "♠️3", "❤️4", "❤️5", "♦️A", "♣️J"];
  // const lastPlayedCards = ["❤️10", "❤️10"];
  const player0Cards = 4;
  const player1Cards = 8;
  const player2Cards = 10;
  let currentPlayerTurn = "player 1";

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
    console.log("play cards");
    console.log(toggledCards);
    await fetch(`http://localhost:3000/game/${gameId}/actions/play-cards`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({
        playerId: $currentPlayerId,
        cards: toggledCards,
      }),


    })

    const resp = await fetch(`http://localhost:3000/game/${gameId}`)
    const json = await resp.json()
    toggledCards = []
    gameData.set(json)
  }

  function handlePass() {
    console.log("pass turn");
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

  playersTurn: {$currentPlayerId}

  <br />

  <div class="game-grid">
    <div class="left-player">
      {#each Array(player0Cards) as card}
        <HiddenCard />
      {/each}  
    </div>

    <div class="right-player">
      {#each Array(player1Cards) as card}
        <HiddenCard />
      {/each}  
    </div>

    <div class="top-player">
      {#each Array(player2Cards) as card}
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
        <Card value={card} toggleCard={toggleCard} toggledCards={toggledCards} />
      {/each}
      </CardHand>

      <Button handleClick={handlePlay}>Play cards</Button>
      <Button handleClick={handlePass}>Pass</Button>
    </div>
  </div>
</main>