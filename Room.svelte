<script>
  import { onMount, onDestroy } from 'svelte'
  import { roomData, userData, currentPlayerData } from './store.ts'
  import GameHost from './GameHost.svelte'
  import Button from './Button.svelte'
  import RoomStatus from './RoomStatus.svelte'
  import Game from './Game.svelte'
  import { BASE_URL } from "./config.ts";

  let ws

  onDestroy(() => {
    ws.close()
  })
  
  onMount(async () => {
    const gameCode = $roomData.gameCode
    console.log('on room mount', gameCode)
    const res = await fetch(`${BASE_URL}/room/${gameCode}/actions/wstoken`, {
      method: 'POST',
      body: JSON.stringify({
        userId: $userData.userId,
        userName: $userData.userName,
        // gameCode: $roomData.gameCode,
      })
    })
    const token = await res.text()
    console.log('the token', token)
    ws = new WebSocket(`ws://localhost:3000/room/updates?token=${token}`)

    // subscribe to updates
    ws.addEventListener("message", (event) => {
      console.log('got message', event.data)
      if (!event.data) {
        return
      }
      const json = JSON.parse(event.data)
      console.log('parsed message', json)
      if (json.type === 'room-update') {
        roomData.set({
          ...json.payload,
          lastPlayed: json.payload?.lastPlayed?.map(card => `${card.suite.charAt(0)}${card.value}`) || [],
        })
      }

      if (json.type === 'player-update') {
        const { cards, slot, youHaveToGo, yourTurn } = json.payload
        currentPlayerData.set({
          cards: cards.map(card => `${card.suite.charAt(0)}${card.value}`),
          slot,
          youHaveToGo,
          yourTurn,
        })
      }
    })
  })

  console.log($roomData)


  async function handleJoin(slot) {
    await fetch(`${BASE_URL}/room/${$roomData.gameCode}/action/sit`, {
      method: 'POST',
      body: JSON.stringify({
        userId: $userData.userId,
        userName: $userData.userName,
        slot,
      }),
    })
  }

  async function startGame() {
    await fetch(`${BASE_URL}/room/${$roomData.gameCode}/action/start`, {
      method: 'POST',
      body: JSON.stringify({
        userId: $userData.userId,
        userName: $userData.userName,
      }),
    })
  }
</script>

<style>
  .slots {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

</style>

<div>
  <h3>
    Room {$roomData.gameCode}
  </h3>
  <GameHost />

  {#each $roomData.viewers || [] as viewer}
    <h4>
      Viewer: {viewer.name}
    </h4>
  {/each}

  <!-- {#each Object.values($roomData.players) as player}
    <h4>
      Player: {player.userName}
    </h4>
  {/each -->
  <!-- <Viewers /> -->
  <RoomStatus />

  <br />

  <Game />
  <!-- <Game /> -->
  {#each Object.entries($roomData?.players || {}) as slot}
    <div>Slot {slot[0]} has {slot[1]?.name}</div>
  {/each}
  <!-- <GameLog /> -->
  <div class="slots">
    {#each Object.keys($roomData?.players || {}) as slot}
      <Button disabled={!!$roomData?.players[slot]} handleClick={() => handleJoin(slot)}>
        Join slot {slot}
      </Button>
    {/each}
  </div>

  {#if $roomData?.hostId === $userData.userId}
    <Button handleClick={startGame}>
      Start game
    </Button>
  {/if}
</div>