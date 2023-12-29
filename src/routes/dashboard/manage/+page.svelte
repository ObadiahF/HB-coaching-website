<script>
    import { onMount } from 'svelte';
      import MediaQuery from '../../../utils/MediaQuery.svelte'
      import { getUserData } from '../../../utils/firebase';

      export let userData;

  let users = [
    { id: 1, name: "User 1", plan: "Basic" },
    { id: 2, name: "User 2", plan: "Pro" },
    { id: 3, name: "User 3", plan: "Premium" },
    { id: 4, name: "User 4", plan: "Premium" },
    { id: 5, name: "User 1", plan: "Basic" },
    { id: 6, name: "User 2", plan: "Pro" },
    { id: 7, name: "User 3", plan: "Premium" },
    { id: 8, name: "User 4", plan: "Premium" },
    { id: 9, name: "User 1", plan: "Basic" },
    { id: 10, name: "User 2", plan: "Pro" },
    { id: 11, name: "User 3", plan: "Premium" },
    { id: 12, name: "User 4", plan: "Premium" },
    { id: 13, name: "User 1", plan: "Basic" },
    { id: 14, name: "User 2", plan: "Pro" },
    { id: 15, name: "User 3", plan: "Premium" },
    { id: 16, name: "User 4", plan: "Premium" },
  ];

  // Function to handle button click for a user
  function handleButtonClick(userId) {
    alert(`Button clicked for User ${userId}`);
  }

  let plan = null;
  let name = "";

  let isCoach;

  onMount( () => {
    isCoach = userData.isCoach;
      if (!isCoach) {
        window.location = '/error';
      }
    })
</script>

<svelte:head>
  <title>HumbleBeast | Management</title>
</svelte:head>

<div class="table-container">
    <h1>User Management</h1>
  <div class="table-row table-header titles">
    <div class="titles">Users</div>
    <div class="plan titles">Plan</div>
    <div class="titles">Actions</div>
  </div>
  {#each users as user (user.id)}
    <div class="table-row">
      <MediaQuery query="(max-width: 445px)" let:matches>
        {#if matches}
            <div>
              <div>{user.name}</div>
              <div>{user.plan}</div>
            </div>
            {:else}
            <div>{user.name}</div>
            <div>{user.plan}</div>
        {/if}
    </MediaQuery>
        
      <div class="table-actions">
        <button on:click={() => handleButtonClick(user.id)}>View</button>
        <button on:click={() => handleButtonClick(user.id)}>Delete</button>
      </div>
    </div>
  {/each}
</div>

<style>
    h1 {
      text-align: center;
      color: white;
      font-size: 42px;
    }
.table-container {
    display: flex;
    flex-direction: column;
    overflow: auto;
    text-align: center;
    padding: 1rem;
}

.table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    padding: 8px;
    margin-bottom: 4px;
    color: white;
    text-align: center;
}

.plan {
    margin-right: 65px;
}

.table-header {
    font-weight: bold;
    background-color: #353537;
    font-size: 24px;
}

.table-actions {
    display: flex;
}

.table-actions button {
    margin-right: 5px;
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .table-actions button:hover {
    background-color: #0056b3;
  }

  @media screen and (max-width: 510px) {
    .titles {
      display: none;
    }
  }

  @media screen and (max-width: 374px) {
    .table-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
