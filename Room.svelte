<script>
  import { onMount, onDestroy } from 'svelte'
  import { roomData, userData } from './store.ts'
  import GameHost from './GameHost.svelte'
  import RoomStatus from './RoomStatus.svelte'
  import Game from './Game.svelte'
  import { BASE_URL } from "./config.ts";

  let ws: WebSocket

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
      const json = JSON.parse(event.data)
      console.log('parsed message', json)
      if (json.type === 'room-update') {
        roomData.set(json.payload)
      }
    })
  })

</script>


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

  <!-- <GameLog /> -->
</div>