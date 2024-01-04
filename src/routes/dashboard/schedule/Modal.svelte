<script>
    import { onMount } from "svelte";
	import { setMeetingAvailability } from "../../../utils/firebase";
	export let showModal; // boolean
	let dialog; // HTMLDialogElement
	let errormsg = "";

  export let isCoach = false;
  export let date;
  const options = {
    weekday: 'long', // Displays the full weekday name
    month: 'long',   // Displays the full month name
    day: 'numeric'    // Displays the day of the month
};



	$: if (dialog && showModal) dialog.showModal();


	const backBtn = () => {
		dialog.close();
	}

	const cancle = async () => {
		//cancle meeting
	};

	let timeOfDayBtns = {
		startAm: true,
		endPm: true
	}

	let startHour;
	let startMin;
	let endHour;
	let endMin;

	

	let repeat = false;

	const convertTo24HourFormat = (hour, minute, isPM) => {
		let convertedHour = parseInt(hour);
		
		if (isPM && convertedHour !== 12) {
			convertedHour += 12;
		} else if (!isPM && convertedHour === 12) {
			convertedHour = 0;
		}

		return new Date(Date.UTC(0, 0, 0, convertedHour, minute));
};

	const scheduleSubmit = () => {
		errormsg = "";
		//convert times to 24hours for checks
		const start = convertTo24HourFormat(startHour, startMin, timeOfDayBtns.startPm);
		const end = convertTo24HourFormat(endHour, endMin, timeOfDayBtns.endPm);

		if (end <= start) {
			errormsg = "End time Can't be before or during start time."
			return;
		}
		
		setMeetingAvailability(repeat, start.toISOString(), end.toISOString());

	};

</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => {
		dialog.close()
		}}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal" on:click|stopPropagation>
  <div class="modal-content">
    	<span class="close-button font" autofocus on:click={() => dialog.close()}>&times;</span>
		{#if isCoach}
			<h1 class='font header'>Set Availability</h1>
			{#if errormsg}
				<h3 style="color: red;">{errormsg}</h3>
			{/if}

			<div class="content">
				<h2 class="font">{date.toLocaleDateString('en-US', options)}</h2>
				
				<div class="time-container">
				 <div class="select-time">
					<h2 class="font">Select Start Time</h2>
					<div>
					 <select bind:value={startHour}>
						<option>01</option>
						<option>02</option>
						<option>03</option>
						<option>04</option>
						<option>05</option>
						<option>06</option>
						<option>07</option>
						<option>08</option>
						<option>09</option>
						<option>10</option>
						<option>11</option>
						<option>12</option>
					</select>

					<h1 style="color: white; font-size: 32px;">:</h1>

					<select bind:value={startMin}>
						<option>00</option>
						<option>30</option>
					</select>
					<div class="btn-container">
						<button class="timeBtns button {timeOfDayBtns.startAm ? "active" : ""}" on:click={() => timeOfDayBtns.startAm = true}>AM</button>
						<button class="timeBtns button {timeOfDayBtns.startAm ? "" : "active"}" on:click={() => timeOfDayBtns.startAm = false}>PM</button>
					</div>
					</div>
				 </div>

				<div class="select-time">
					<h2 class="font">Select End Time</h2>
					<div>
					 <select bind:value={endHour}>
						<option>01</option>
						<option>02</option>
						<option>03</option>
						<option>04</option>
						<option>05</option>
						<option>06</option>
						<option>07</option>
						<option>08</option>
						<option>09</option>
						<option>10</option>
						<option>11</option>
						<option>12</option>
					</select>

					<h1 style="color: white; font-size: 32px;">:</h1>

					<select bind:value={endMin}>
						<option>00</option>
						<option>30</option>
					</select>

					<div class="btn-container">
						<button class="timeBtns button {timeOfDayBtns.endPm ? "" : "active"}" on:click={() => timeOfDayBtns.endPm = false}>AM</button>
						<button class="timeBtns button {timeOfDayBtns.endPm ? "active" : ""}" on:click={() => timeOfDayBtns.endPm = true}>PM</button>
					</div>
				 </div>
				 </div>
				</div>
				 
				 <h2 style="margin-top: 3rem;" class="font">Repeat:</h2>
				 <div class="repeat-container">
					<button class="button {repeat === false ? "active" : ""}" on:click={() => repeat = false}>Don't Repeat</button>
					<button class="button {repeat === true ? "active" : ""}" on:click={() => repeat = true}>This month</button>
				 </div>
				<button class="button" on:click={scheduleSubmit}>Submit</button>
			</div>
		{:else}
			<h1 class='font header'>Client Page</h1>
			{#if errormsg}
				<h3 style="color: red;">{errormsg}</h3>
			{/if}
			<div class="content">
				<h2 class="font">Are you sure you want to cancle your meeting?</h2>
				<button on:click={cancle}>Confirm</button>
				<button class="button" style="margin-top: -1rem;" on:click={backBtn}>Back</button>
			</div>
		{/if}

  </div>
</div>
</dialog>

<style>
 
 select {
	background-color: inherit;
	border-radius: 2px solid #67676f;
	border-radius: 14px;
	color: white;
	font-size: 32px;
 }

 .select-time {
	display: flex;
	justify-content: center;
	flex-direction: column;
 }

 .select-time div {
	display: flex;
	justify-content: center;
 }

 .time-container {
	display: flex;
	justify-content: center;
	gap: 10rem;
	align-items: center;
 }

 option {
	background-color: #353537;
	appearance: none;
  }

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
    min-width: 75vw;
    min-height: 70vh;
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

  .button {
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

  .button:hover {
	transition: 300ms ease;
	background-color: #55555f;
  }

  .content input:focus {
	outline: none;
  }

  .font {
	color: white;
  }

  .timeBtns {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
  }

  .repeat-container {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	margin-bottom: 2rem;
  }

  .repeat-container button {
	width: 20rem;
	margin: 0;
  }

  .timeBtns:nth-child(1) {
	top: -35%;
  }

  .timeBtns:nth-child(2) {
	bottom: -35%;
  }

  .timeBtns:nth-child(3) {
	top: -35%;
  }

  .timeBtns:nth-child(4) {
	bottom: -35%;
  }

  .active {
	transition: 300ms ease;
	background-color: #55555f;
  }

  .btn-container {
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 1rem;
  }


  @media screen and (max-width: 660px) {
	.time-container {
		flex-direction: column;
		gap: 1rem;
	}
	.timeBtns {
		position: relative;
	}
	.btn-container {
		display: flex;
	}

	.select-time div {
		flex-direction: column;
	}

	.modal {
		min-width: 80vw;
	}
  }

</style>
