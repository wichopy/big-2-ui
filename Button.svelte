<script>
	export let handleClick;
	export let variant;
	export let disabled = false;
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

	button:disabled,
	button[disabled]{
		border: 1px solid #999999;
		background-color: #cccccc;
		color: #666666;
	}
</style>

<button disabled={disabled} style={variant === 'action' ? 'background: blue;' : undefined} on:click={handleClick}>
  <slot />
</button>