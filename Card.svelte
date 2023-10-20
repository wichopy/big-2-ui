<script>
  export let value;
  export let toggleCard;
  export let selected;

  function formatValue(s) {
    if (s.charAt(0) === 'S') {
      return '♠'+s.slice(1)
    } else if (s.charAt(0) === 'H') {
      return '❤️'+s.slice(1)
    } else if (s.charAt(0) === 'D') {
      return '♦️'+s.slice(1)
    } else if (s.charAt(0) === 'C') {
      return '♣' + s.slice(1)
    }
  }
</script>

<style>
  .card {
    background-color: white;
    height: 50px;
    width: 40px;
    border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
  }
</style>

<div style={selected ? "background-color: pink;" : "" } class="card" on:keypress={() => {}} on:click={() => {
  toggleCard?.(value)
}} >
  {formatValue(value)}
</div>