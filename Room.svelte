<script>
  import { roomData } from './store.ts'
  import GameHost from './GameHost.svelte'
  import RoomStatus from './RoomStatus.svelte'
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
  <!-- <Game /> -->

  <!-- <GameLog /> -->
</div>