<svelte:head>
    <title>HumbleBeast | Schedule</title>
</svelte:head>

<script>
import { onMount } from 'svelte';
import Modal from './Modal.svelte';
//modal stuff
let showModal = false;
let event = [];

  //date stuff
  let currentDate = new Date();

  const prevMonth = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    currentDate = currentDate;
    renderCalendar();
  }

  const nextMonth = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate = currentDate;
    renderCalendar();
  }

  let days = [];

  onMount(() => {
    renderCalendar();
  });

    const renderCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

      let date = 1;
      const calendarRows = [];

      for (let i = 0; i < 6; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDayOfMonth) {
            week.push('');
          } else if (date > lastDayOfMonth) {
            week.push('');
          } else {
            week.push(date);
            date++;
          }
        }
        calendarRows.push(week);
      }

      days = calendarRows;
    }
</script>


<div class="calendar">
  <div class="calendar-header">
    <button on:click={prevMonth}>&lt;</button>
    <h2>{currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
    <button on:click={nextMonth}>&gt;</button>
  </div>
  <table class="calendar-table">
    <thead>
      <tr>
        <th>Sun</th>
        <th>Mon</th>
        <th>Tue</th>
        <th>Wed</th>
        <th>Thu</th>
        <th>Fri</th>
        <th>Sat</th>
      </tr>
    </thead>
    <tbody>
      {#each days as week, i}
        <tr>
          {#each week as day, j}
            <td on:click={() => (showModal = true)}>
                {day}
                <h1 class="event">Name: 4:00 pm</h1>
                <h1 class="event">Name: 5:00 pm</h1>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<Modal bind:showModal events={event}/>



<style>
  /* Adjust the calendar container */
.calendar {
  width: 100%;
  height: 80vh;
  overflow: auto;
  font-family: Arial, sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
}

/* Calendar header */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  color: #fff;
  padding: 10px;
}



/* Calendar header buttons */
.calendar-header button {
  background-color: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 2.5em;
}

/* Calendar table */
.calendar-table {
  flex: 1; /* Fill available vertical space */
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

/* Calendar table header (days of the week) */
.calendar-table th {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  padding: 8px;
}

/* Calendar table cells (days) */
.calendar-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  vertical-align: text-top;
  position: relative; /* Allow absolute positioning of numbers */
  color: white;
}

/* Highlight the current day */
.calendar-table td:hover {
  background-color: #353537;
  cursor: pointer;
}

.calendar-table td:hover > .event {
  color: white;
}

.calendar-table td:empty {
  visibility: hidden;
}

/* Create space for events */
.event {
  bottom: 4px;
  right: 4px;
  font-size: 0.8em;
  color: #626060;
}

</style>