<svelte:head>
    <title>HumbleBeast | Messages</title>
    <script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>

<script>
    import User from "../../../components/dashboard-messages-comp/user.svelte";

    let input;
    let inputVal;
    let usersName;

    //state
    let mobileUserSelection = false;

    const clickInput = () => {
        input.click();
    }

    const sendMessage = () => {
        const message = inputVal;

        if (!message) return;

        //handle message here
    };
</script>

<div class="container">
    {#if !mobileUserSelection}
        <div class="mobile-menu">
                    <div>
                        <i class="fa-solid fa-angle-left" style="color: #ffffff;" on:click={() => {mobileUserSelection = !mobileUserSelection}}></i>
                    </div>
                    <div class="user-info">
                        <img src="https://wallpaperaccess.com/full/6295120.jpg" alt="#">
                        <span>Obadiah Fusco</span>
                    </div>
                </div>

        <div class="messages-container">
            <div class="message sent">
                <div class="sender-info">
                    <span class="sender-name">Obadiah Fusco</span>
                    <span class="message-time">10:30 AM</span>
                </div>
                <div class="message-content">
                    <h3>Aye bro, you wanna hit chest on saturday? I wanna see if I can bench 185.</h3>
                </div>
            </div>

            <div class="message">
                <div class="sender-info">
                    <span class="sender-name">You</span>
                    <span class="message-time">10:31 AM</span>
                </div>
                <div class="message-content">
                    <h3>Bet bro! Hope you'be been doing dips! Ima do 400 for 5 :)</h3>
                </div>
            </div>

            <div class="message sent">
                <div class="sender-info">
                    <span class="sender-name">Obadiah Fusco</span>
                    <span class="message-time">10:33 AM</span>
                </div>
                <div class="message-content">
                    <h3>:0</h3>
                </div>
            </div>

        </div>

        
        <div class="input-container">
                <button id="file-select" on:click={clickInput}><i class="fa-solid fa-paperclip" style="color: #ffffff;"></i></button>
                <input type="file" bind:this={input} style="display: none;">
                <input type="text" placeholder="Type your message here..." bind:value={inputVal}>
                <button id='send' on:click={sendMessage}><i class="fa-sharp fa-solid fa-paper-plane"></i></button>
        </div>

        {:else}
       <User /> 
    {/if}
    

</div>

<style>

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        overflow-x: hidden;
    }
    .mobile-menu {
        display: none;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 15%;
        background-color: #353537;
        color: white;
    }

    .mobile-menu div {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 0 2rem;
    }

    .mobile-menu div i {
        font-size: 32px;
    }

    .mobile-menu img {
        height: 3rem;
        border-radius: 50%;
    }

    .messages-container {
        height: 100%;
        padding: 0.5rem;
        width: 100%;
    }

    .input-container {
        margin-top: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 8%;
        gap: 0.5rem;
        background-color: #19191b;
    }

    .input-container input {
        width: 80%;
        height: 60%;
        border-radius: 8px;
        border: none;
        padding: 0 0.5rem;
    }

    .input-container #send {
        height: 60%;
        width: 8%;
        cursor: pointer;
        color:#242529;
    }

    .input-container #file-select {
        background-color: inherit;
        border: none;
        font-size: 24px;
        cursor: pointer;
    }

    .input-container button:hover {
        transition: 200ms ease;
        opacity: 0.7;
    }

    .message {
  background-color: #007bff;
  color: white;
  border-radius: 15px;
  max-width: 70%;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 50px;
  margin: 0.5rem;
}

.sender-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  opacity: 0.7;
}

.sender-name {
  font-weight: bold;
}

.message-content {
  margin-top: 5px;
  font-size: 16px;
  white-space: pre-wrap;
}

.sent {
    background-color: rgb(128, 102, 102);
    margin-left: auto;
}

@media screen and (max-width: 522px) {
    .mobile-menu {
        display: flex;

    }
}
</style>