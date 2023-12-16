<svelte:head>
    <script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>

<script>
    import { scrollIntoView } from '../../utils/scrollHelper';
    import { checkIfUserIsLoggedIn } from '../../utils/firebase.js'
    import { onMount } from 'svelte';

    const scroll = (ref) => {
        let element;
        switch (ref) {
            case 'home':
                element = 'hero'
                break;
            case 'pricing':
                element = 'price'
                break;
            case 'resources':
                element = 'resources'
                break;

            case 'contact':
                element = 'contact'
                break;
        }

        scrollIntoView(element);
    }
    //toggle menu
    let open = false;

    let signedIn = false;
    
    const toggleMobileMenu = () => {
        open = !open;
    }

    const goToSignIn = () => {
        if (signedIn) {
            window.location = 'dashboard';
        } else {
            window.location = 'auth'
        }
    }

    onMount(() => {
        const userData = checkIfUserIsLoggedIn();

        if (userData) signedIn = true;
    })
</script>

<div class="nav-bar">
        <h1>HUMBLEBEAST</h1>
            <ul class={open === false ? 'nav-items' : 'mobile'}>
                <a on:click={() => {scroll('home')}}>home</a>
                <a on:click={() => {scroll('pricing')}}>pricing</a>
                <a on:click={() => {scroll('resources')}}>resources</a>
                <a on:click={() => {scroll('contact')}}>contact</a>
                <button id='signIn' on:click={goToSignIn}>{signedIn ? "dashboard" : "sign in"}</button>
            </ul>
       
        <button id='mobile' on:click={toggleMobileMenu}>
            {#if open}
                <i class="fa-solid fa-x" style="color: #ffffff;"></i>
            {:else}
                <i class="fa-solid fa-bars" style="color: #ffffff;"></i>
            {/if}
        </button>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .nav-bar {
        height: 80px;
        padding: 0 5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: black;
        border-bottom: 12px solid;
        border-image: linear-gradient(to right, #DDFFF7, #93E1D8, #FFA69E, #AA4465, #861657);
        border-image-slice: 1;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 10;
    }

    .nav-bar ul {
        margin-left: auto;
    }

    .nav-bar h1 {
        font-family: 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: #FFA69E;
        font-size: 48px;
        letter-spacing: -1.5%;
    }

    .nav-bar ul a {
        text-decoration: none;
        color: white;
        font-size: 24px;
        padding: 0 1.5rem;
        font-family: 'Roboto', sans-serif;

    }

    .nav-bar ul a:hover {
        transition: 300ms ease;
        color: rgb(155, 147, 147);
    }

    .fa-solid {
        display: none;
        font-size: 32px;
        transition: 400ms ease-in;
    }

    .nav-items {
        display: flex;
    }

    #signIn {
        font-size: 18px;
        padding: 0.3rem 2rem;
        background-color: #93E1D8;
        border-radius: 4px;
        cursor: pointer;
        color: black;
        border: none;
    }

    #signIn:hover {
        transition: 300ms ease background-color;
        background-color: #96ebdf;
    }

    @media screen and (max-width: 1135px) {
        .nav-bar {
            padding: 0.5rem;
        }

        .nav-bar h1 {
            font-size: 32px;
            padding: 0 0.3rem;
        }
        
        .nav-bar ul a {
            font-size: 18px;
        }
    }

    @media screen and (max-width: 812px) {
        .nav-bar ul {
        position: absolute;
        top: 10%; /* Adjust this value to position the dropdown below the navigation bar */
        left: 0;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        background-color: black;
        z-index: 5;
        width: 100%;
        padding: 1rem;

    }
    
    .nav-items {
        display: none;
    }
    .nav-bar ul a {
        font-size: 42px;
    }

    #signIn {
        font-size: 42px;
        border-radius: 16px;
    }

    .mobile {
        display: flex;
    }

    .fa-solid {
        display: block;
        z-index: 5;
        color: white;
    }

    .fa-solid {
    display: block;
}
    }

    #mobile {
        background-color: inherit;
        border: none;
    }

    .nav-bar .modal a {
        font-size: 32px;
    }


.nav-bar #mobile .fa-x {
    z-index: 1000;
    position: absolute;
    top: 40%;
    right: 5%;
}

a {
    cursor: pointer;
}

</style>