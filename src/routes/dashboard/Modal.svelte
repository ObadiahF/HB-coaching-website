<script>
	export let showModal; // boolean
	let dialog; // HTMLDialogElement

  export let events = [];


	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal" on:click|stopPropagation>
  <div class="modal-content">
    <span class="close-button" autofocus on:click={() => dialog.close()}>&times;</span>
    <h2>Meetings</h2>
    <div class="content">
      {#if events.length === 0}
        <h2>No Events Found!</h2>
        {:else}
        {#each events as event}
           <li>{event}</li>
        {/each}
      {/if}
    </div>
  </div>
</div>
</dialog>

<style>
 
	dialog {
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

  .modal {
    min-width: 30rem;
    min-height: 15rem;
    position: relative;
    text-align: center;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 3rem;
    cursor: pointer;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }

</style>
