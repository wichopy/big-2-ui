<script>
	export let handleClick;
	export let variant;
</script>

<style>
	button {
	  background: #ff3e00;
	  color: white;
		cursor: pointer;
	  border: none;
	  padding: 8px 12px;
	  border-radius: 2px;
	}
</style>

<button style={variant === 'action' ? 'background: blue;' : undefined} on:click={handleClick}>
  <slot />
</button>