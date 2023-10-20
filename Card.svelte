<script>
  export let value;
  // export let selected
  export let toggleCard;
  export let toggledCards;
  // function handleClick() {
  //   selected = true;
  // }
  const { ...restProps } = $$props
  $: console.log(restProps)
  
  // $: console.log(selected, toggledCards)
  $: selected = toggledCards?.includes(value)

  function formatValue(s) {
    if (s.charAt(0) === 'S') {
      return '♠'+s.charAt(1)
    } else if (s.charAt(0) === 'H') {
      return '❤️'+s.charAt(1)
    } else if (s.charAt(0) === 'D') {
      return '♦️'+s.charAt(1)
    } else if (s.charAt(0) === 'C') {
      return '♣' + s.charAt(1)
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

<div style={toggledCards?.includes(value) ? "background-color: pink;" : "" } class="card" on:keypress={() => {}} on:click={() => {
  // selected = !selected
  toggleCard?.(value)
  // console.log('clicked', value, selected, toggledCards)
  // console.log(toggledCards?.includes(value))
}} >
  {formatValue(value)}
</div>