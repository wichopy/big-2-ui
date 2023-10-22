<script>
  import { roomData, userData, inRoom } from './store.ts'
  import Button from './Button.svelte'
  import { BASE_URL } from "./config.ts";

  async function createRoom() {
    const resp = await fetch(`${BASE_URL}/room`, {
      method: 'POST',
      body: JSON.stringify({
        userId: $userData.userId,
        userName: $userData.userName,
      })
    })
    const json = await resp.json()
    console.log('created room', json)
    roomData.set({
      gameCode: json.gameCode,
      hostName: json.hostName,
      status: json.status,
    })
    inRoom.set(true)
  }

  async function joinRoom() {
    const resp = await fetch(`${BASE_URL}/room/${$roomData.gameCode}/actions/join`, {
      method: 'POST',
      body: JSON.stringify({
        userId: $userData.userId,
        userName: $userData.userName,
        gameCode: $roomData.gameCode,
      })
    })
    const json = await resp.json()
    // this.gameCode = generateGameCode()
    // this.hostId = hostId
    // this.hostName = hostName
    // this.viewers = []
    // this.players = {}
    // this.currentGameId = ''
    // this.status = 'waiting'

    console.log('joined room', json)
    roomData.set({
      gameCode: json.gameCode,
      hostName: json.hostName,
      status: json.status,
      viewers: json.viewers,
      players: json.players,
    })
    inRoom.set(true)
  }
</script>


<style>
  .entry-page-section {
    margin: auto;
    row-gap: 16px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
</style>

<div class="entry-page-section">
  <div class="enter-page-section">
    <form>
      <label>Game Code</label>
      <input type="text" bind:value={$roomData.gameCode} />
    </form>

    <br/>

    <Button handleClick={joinRoom}>
      Join room
    </Button>
  </div>

  <div>
    <a on:click={createRoom}>
      Create a new room
    </a>
  </div>
</div>
