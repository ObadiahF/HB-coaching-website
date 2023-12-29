<script>
    import { onMount } from "svelte";
    import { checkIfUserIsLoggedIn, getUserData } from "../../utils/firebase";
    import { planLinks } from "../../credentials/stripe/stripeCreds.js"
    import Spinner from "../others/spinner.svelte";

    let data;
    let isLoading = false;

    const handleBtnClick = (value) => {
        //check if user is logged in.
        if (data.promiseResult  === null) {
            window.location = 'auth';
            return
        }

        const link = planLinks[value - 1];
        window.open(link, '_blank');
        isLoading = true;
    };

    onMount(() => {
        data = getUserData();
    });
</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>

<div class="container">
    {#if isLoading}
        <div class="loader">
            <div class="spinner">
                <Spinner />
            </div>
            <h2>Please refresh page when payment completed</h2>
        </div>
    {/if}
    
    <div class="title">
        <h1>Pricing</h1>
    </div>
    <div class="options-container">

        <div class="options">
            <h6>Standard</h6>
            <h1>$34.99/mo</h1>
            <ul class="parts">
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   Custom workouts</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   Nutrition guidance</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   Bi-weekly check-ins</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   Support</li>
            </ul>
            <button class="call-to-action" on:click={() => handleBtnClick(1)}>Get Started</button>
        </div>
    
        <div class="options">
            <h6>Premium</h6>
            <h1>$49.99/mo</h1>
            <ul class="parts">
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   All Standard</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   Progress tracking</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   Weekly check-ins</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   priority support</li>
            </ul>
            <button class="call-to-action" on:click={() => handleBtnClick(2)}>Go Premium</button>
        </div>
    
        <div class="options">
            <h6>Elite</h6>
            <h1>$59.99/mo</h1>
            <ul class="parts">
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   All Premium</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   Progress tracking</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   Weekly check-ins</li>
                <li><i class="fa-solid fa-check" style="color: #ffffff;"></i>   priority support</li>
            </ul>
            <button class="call-to-action" on:click={() => handleBtnClick(3)}>Go Elite</button>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Bowlby+One&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');


    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .loader {
  z-index: 70;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  position: absolute;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1;
  margin-left: -9rem;
  top: 20%;
}

    .loader h2 {
        color: white;
        margin-top: 25vh;
        text-align: center;
        padding: 1rem 2rem;
        font-size: 32px;
        font-weight: bold;
    }
    
    .title {
        padding: 0.5rem 5.5rem;
    }

    .title h1 {
        font-size: 62px;
        font-weight: bolder;
        color: white;
        font-family: 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    }


    .options-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 50vh;
        gap: 2rem;
    }

    .options {
        min-width: 35rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 40px 40px 40px 40px;
        box-shadow: 0px 10px 20px -20px rgba(0, 0, 0, 0.25);
        background-color: #0d0d0d;
        gap: 10;
        border-radius: 30px;
        position: relative;
    }

    .options::after {
        font-size: 48px;
        position: absolute;
        top: -3%;
        right: -3%;
    }

    .options:nth-child(1):after {
        content: '⚡';
    }

    .options:nth-child(2):after {
        content: '🚀';
    }

    .options:nth-child(3):after {
        content: '👑';
    }

    .options h6 {
        flex-shrink: 0;
        width: auto; /* 59px */
        height: auto; /* 21px */
        white-space: pre;
        position: relative;
        font-weight: 400;
        font-style: normal;
        font-family: "Schibsted Grotesk", "Schibsted Grotesk Placeholder", sans-serif;
        color: #ffffff;
        font-size: 18px;
        padding-bottom: 1rem;
    }

    .options h1 {
        font-family: "Bowlby One", sans-serif;
        color: #ffa69e;
        font-size: 40px;

    }

    .parts {
        box-sizing: border-box;
        flex-shrink: 0;
        width: 100%;
        height: min-content; /* 154px */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
        margin-left: 0.5rem;
        padding: 20px 0px 20px 0px;
        overflow: visible;
        position: relative;
        list-style-type: none;
        align-content: center;
        flex-wrap: nowrap;
        gap: 10;
        border-radius: 0px 0px 0px 0px;
    }

    .parts li {
        font-weight: 400;
        font-style: normal;
        font-family: "Schibsted Grotesk", "Schibsted Grotesk Placeholder", sans-serif;
        color: #ffffff;
        font-size: 14px;
        letter-spacing: 0em;
        line-height: 2.5rem;
        text-align: left;
    }

    .call-to-action {
        margin-top: 1rem;
        box-sizing: border-box;
        flex-shrink: 0;
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 15px;
        background-color: #ffa69e;
        border-radius: 8px;
        cursor: pointer;
        border: none;
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
        color: #0D0D0D;
    }

    .call-to-action:hover {
        transition: 300ms ease;
        background-color: #DDB8B0;
    }

    @media screen and (max-width: 1779px) {
        .options {
        min-width: auto;
        width: 35rem;
        }
    }

    @media screen and (max-width: 1025px) {
        .options-container {
            flex-direction: column;
        }

        .title {
            text-align: center;
        }

        .options {
            min-width: 35rem;
        }
    }

        @media screen and (max-width: 595px) {
            .options {
                min-width: auto;
                width: auto;
            }
        }

        @media screen and (max-width: 446px) {
            .container {
                margin-top: 5rem;
            }
        }
</style>