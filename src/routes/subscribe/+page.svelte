<svelte:head>
    <title>HumbleBeast | Subscribe</title>
    <script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import { checkIfUserIsLoggedIn } from '../../utils/firebase';
    import Pricing from '../../components/home-components/pricing.svelte';

    onMount(() => {
        const userData = checkIfUserIsLoggedIn();

        if (!userData) window.location = 'auth';
    });

    const handleBack = () => {
        window.location = 'dashboard';
    };
</script>

<main>
    <button on:click={handleBack}>Back</button>
    <Pricing />
</main>

<style>
    main {
        background-color: black;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        margin-top: 1rem;
        box-sizing: border-box;
        flex-shrink: 0;
        height: 40px;
        width: 6rem;
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
        position: absolute;
        top: 1%;
        right: 1%;
    }

    button:hover {
        transition: 300ms ease;
        background-color: #DDB8B0;
    }
</style>