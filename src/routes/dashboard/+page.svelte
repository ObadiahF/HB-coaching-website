<svelte:head>
    <title>HumbleBeast | Dashboard</title>
    <script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import Modal from './Modal.svelte';
    import { getUserData } from '../../utils/firebase';
    

    let isCoach = true;
    let showModal = false;

    let event = [];

    let total = 600;
    let newQuestionsNum = 0;


    //elements
    let goalsInput;
    let clientSelectionEl;
    let questionBox;

    onMount(async () => {
        const data = await getUserData();
        if (data === null) {
            alert('Error loading data');
            return;
        }

        //show Data



    })

    const showModalData = (section) => {
        showModal = !showModal;
        alert(section);
    }

    //Goals functions
    const deleteGoal = (goal) => {
        const goalIndex = goalsOrTags.indexOf(goal);

        if (goalIndex === -1) return;

        goalsOrTags.splice(goalIndex, 1);
        goalsOrTags = goalsOrTags;
    };

    const addGoal = () => {
        const goal = goalsInput.value;

        if (goal === "") return;

        goalsOrTags = [...goalsOrTags, goal];
        
        goalsInput.value = "";
    };

    const switchClientAndGetTheirGoals = () => {
        const clientInfo = clients[clientSelectionEl.selectedIndex];

        goalsOrTags = clientInfo.goals;
    };

    //questions functions

    const sendMessage = () => {
        const message = questionBox.value;

        if (message === "") return;

        //send message

        questionBox.value = "";
    }
</script>

<div class="container">
    <h1 class='title'>Dashboard</h1>
    <div class="grid-container">
      <div class="grid-item">
        <h2>Next Meeting</h2>
        <div class="details">
            <h3>Aaron Kauffman at 6:00</h3>
            <div class="btn-container">
                <button>Join Meeting</button>
                <button>Message Client</button>
            </div>
            <div>
                <button class="disabled" on:click={(() => showModalData("Cancel"))}>Cancel Meeting</button>
            </div>
        </div>
      </div>
      <div class="grid-item">
        {#if isCoach}
            <h2>Total Earnings</h2>
            <div class="details">
                <h3>${total}</h3>
                <div>
                    <button>View Total Earnings</button>
                </div>
            </div>
        {:else}
            <h2>Next Payment Due</h2>
            <div class="details">
                <h3>January 15th, 2023</h3>
                <h2 style="display: inline-block;">Plan:</h2>
                <h3 style="display: inline-block; color: white;">Premium</h3>
            </div>  
            <button on:click={(() => showModalData("Invoices"))} class='invoice-btn'>Invoices</button>
            <button class='invoice-btn'>Change Plan</button>
        {/if}
        
      </div>
      <!--
      <div class="grid-item">
        {#if isCoach}
            <h2>Client Goals</h2>
            <div class="info" style="margin-top: -1rem;">
                <h3>Select Client</h3>
                <select name="" id="clientSelection" on:change={switchClientAndGetTheirGoals} bind:this={clientSelectionEl}>
                    {#each clients as client}
                        <option value={client.name}>{client.name}</option>
                    {/each}
                </select>
                <ul>

                    {#each goalsOrTags as goal}
                        <li>{goal}</li>
                    {/each}
                </ul>

                {#if goalsOrTags.length === 0}
                    <h3>No Goals Set</h3>
                {/if}
            </div>
        {:else}
        <h2>Goals</h2>
        <div class="info">
            <ul>
                    {#each goalsOrTags as goal}
                    <li on:click={(() => deleteGoal(goal))} class="clientInfo">{goal}</li>
                    {/each}
                    {#if goalsOrTags.length === 0}
                    <h3>No Goals Set</h3>
                    {/if}
            </ul>
        </div>
        <input type="text" placeholder="Add new {isCoach ? "tag" : "goal"}..." class="GoalInput" bind:this={goalsInput}>
        <button style="padding: 0.8rem 3rem;" on:click={addGoal}>Add</button>
        {/if}
      </div>
      <div class="grid-item">
        {#if isCoach}
             <h2>Questions</h2>
             <div class="details">
                <h3>New Questions: 0</h3>
                 <div class="btn-container">
                    <button on:click={(() => showModalData("New"))}>View New Questions</button>
                    <button on:click={(() => showModalData("All"))}>View All Questions</button>
                 </div>
             </div>
        {:else}
             <h2>Ask Questions</h2>
             <div class="details">
                <textarea id="ask-question" cols="40" rows="8" bind:this={questionBox}></textarea>
                 <div class="btn-container">
                    <button on:click={sendMessage}>Send</button>
                    <button on:click={(() => showModalData("Answered"))}>Answered Questions</button>
                 </div>
             </div>
        {/if}
      </div>

    -->
    </div>
    <Modal bind:showModal events={event}/>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        height: fit-content;
    }

    .title {
        margin-left: 9%;
        color: white;
        font-size: 48px;
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 2fr);
        width: 90%;
        height: 70%;
        place-items: center;
        grid-gap: 1rem;
        margin: 0 auto;
    }
    
    .grid-item {
        background-color: #353537;
        padding: 20px;
        width: 65%;
        height: 70%;
        aspect-ratio: 1;
        text-align: center;
        border-radius: 8px; /* Add some border-radius for rounded corners */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Add a subtle box shadow */
        transition: 300ms ease;
    }

    .grid-item h2 {
        color: white;
        margin-bottom: 2rem;
        font-weight: bold;
        font-size: 32px;
    }

    .grid-item h3 {
        color: #ccd8e3;
        font-size: 24px;
    }

    .grid-item button {
        font-size: 18px;
        background-color: #242529;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 16px;
        border: 2px solid #60606a;
        cursor: pointer;
        margin-bottom: 0.5rem;
    }

    .grid-item button:hover {
        transition: 300ms ease;
        background-color: #60606a;
        border: 2px solid #242529;
    }

    .grid-item .details div{
        margin-top: 1rem;
    }

    .details {
        margin-top: 3rem;
    }

    .btn-container {
        padding-top: 1rem;
    }
    .grid-item .disabled {
        background-color: #60606a;
        cursor: not-allowed;
    }

    .info {
        display: flex;
        align-items: center;
        flex-direction: column;
        color: white;
    }

    .info ul {
        list-style-type: decimal;
        overflow-y: auto;
        max-height: 8rem;
        padding-right: 1rem;
    }

    .info ul li {
        padding: 0.4rem;
        font-size: 24px;
    }

    .clientInfo:hover {
        text-decoration: line-through;
        cursor: pointer;
    }

    .GoalInput{
        border: none;
        border-radius: 24px;
        font-size: 19px;
        width: 90%;
        background-color: var(--line);
        padding: 1rem;
        color: white;
        margin-bottom: 0.5rem;
    }

    .invoice-btn {
        min-width: 10rem;
    }


    /* Media Query for Responsive Layout */
    @media (max-width: 768px) {
        .grid-container {
            display: flex;
            flex-direction: column;
        }
    }

    @media (max-width: 1450px) {
        .grid-item {
            height: 90%;
        }
    }

    #ask-question {
        color: white;
        background-color: #242529;
        border: none;
        border-radius: 8px;
        outline: none;
        padding: 1rem;
        resize: none;
        width: 90%;

    }

   
</style>
