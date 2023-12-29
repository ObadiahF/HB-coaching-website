<script>
    import { onMount } from "svelte";
	import { updateFullNameOnServer } from '../../utils/firebase';
	export let showModal; // boolean
	let dialog; // HTMLDialogElement
	let name;
	let canClose = true;

	let errormsg = "";

  export let events = [];
  export let data = {};
  export let mode = "";

	$: if (dialog && showModal) dialog.showModal();
	$: if (mode === "name") {
		canClose = false;
	} else {
		canClose = true;
	}

	const setName = async () => {
		if (!name) {
			errormsg = "Field is required!"
		} else {
			errormsg = "";
			await updateFullNameOnServer(name);
			dialog.close();
		}
	};

	const backBtn = () => {
		dialog.close();
	}

	const cancle = async () => {
		//cancle meeting
	};

</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => {
		if (!canClose) return;
		dialog.close()
		}}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal" on:click|stopPropagation>
  <div class="modal-content">
	{#if canClose}
    	<span class="close-button font" autofocus on:click={() => dialog.close()}>&times;</span>
	{/if}
		{#if mode === "name"}
			<h1 class='font header'>Set Name</h1>
			{#if errormsg}
				<h3 style="color: red;">{errormsg}</h3>
			{/if}

			<div class="content">
				<input type="text" bind:value={name}>
				<button on:click={setName}>Submit</button>
			</div>
		
		{:else if mode === "Cancel"}
			<h1 class='font header'>Cancle Meeting</h1>
			{#if errormsg}
				<h3 style="color: red;">{errormsg}</h3>
			{/if}
			<div class="content">
				<h2 class="font">Are you sure you want to cancle your meeting?</h2>
				<button on:click={cancle}>Confirm</button>
				<button style="margin-top: -1rem;" on:click={backBtn}>Back</button>
			</div>

			<button style="margin-top: -1rem;" on:click={backBtn}>Back</button>
		{:else if mode === "change"}
			<h1 class='font header'>Change Plan</h1>

			{#if errormsg}
				<h3 style="color: red;">{errormsg}</h3>
			{/if}
		{/if}

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
    min-width: 50vw;
    min-height: 40vh;
    position: relative;
    text-align: center;
	background-color: #353537;
  }

  .close-button {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 3rem;
    cursor: pointer;
  }

  .header {
	margin-bottom: 3rem;
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }

  .content input {
	background-color: #67676f;
	font-size: 16px;
	width: 50%;
	padding: 0.5rem 1rem;
	margin: auto;
	border-radius: 32px;
	border: 2px solid grey;
	color: white;
  }

  .content button {
	font-size: 24px;
	padding: 0.5rem 2rem;
	border-radius: 16px;
	border: 2px solid #67676f;
	background-color: #353537;
	color: white;
	width: 60%;
	margin: 1rem auto;
	cursor: pointer;
  }

  .content button:hover {
	transition: 300ms ease;
	background-color: #55555f;
  }

  .content input:focus {
	outline: none;
  }

  .font {
	color: white;
  }

</style>
