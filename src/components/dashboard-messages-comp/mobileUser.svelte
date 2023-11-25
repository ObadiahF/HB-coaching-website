<svelte:head>
    <script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>
<script>
    import { colors } from "../../utils/colors";
    import { createEventDispatcher } from 'svelte';

    const { mainBackground, color, activeColor, checkedColor, lineColor } = colors;
    
    let isCoach = true;
    
    const userInfo = [
        {
            "name": "Obadiah Fusco",
            "pfpUrl": "https://wallpaperaccess.com/full/6295120.jpg",
            "userId": "dasd23423fdfsdfasd"
        },
        {
            "name": "Daniel Fusco",
            "pfpUrl": "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
            "userId": "dasd23423fdfsdfasd"
        },
        {
            "name": "Julia Hopkins",
            "pfpUrl": "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?5315ffb",
            "userId": "dasd23423fdfsdfasd"
        }
    ]
    
    let current = userInfo[0].name;

    const dispatch = createEventDispatcher();

    const handleCardClick = (user) => {
        current = user;

        dispatch('cardClicked', {user});
    };
    
</script>

<div class="container" 
style="
    --main-background: {mainBackground};
    --color: {color};
    --active: {activeColor};
    --checked: {checkedColor};
    --line: {lineColor};
">
    <div class="card header">
        <h1>{isCoach ? "Clients" : "Messages"}<i class="fa-solid fa-users" style="color: #ffffff;"></i></h1>
    </div>
    
    {#each userInfo as userInfo}

        <div class="card {current === userInfo.name ? 'active' : ''}">
            <img src="{userInfo.pfpUrl}" alt="profile">
            <a href="#" on:click={() => handleCardClick(userInfo.name)}>{userInfo.name}</a>
        </div>

    {/each}

</div>

<style>

    :root {
        --img-ratio: 3rem;
    }

    .container {
        overflow-y: auto;
        min-height: 100%;
        min-width: 100%;
    }

    .card {
        height: 4rem;
        display: flex;
        align-items: center;
        padding: 0.2rem 0.5rem;
    }

    .card a {
        text-decoration: none;
        color: var(--color);
        text-overflow: clip;
    }

    .card a:hover {
        transition: 200ms ease;
        opacity: 0.7;
    }

    .card img {
        height: var(--img-ratio);
        width: var(--img-ratio);
        border-radius: 50%;
        margin-right: 1rem;
    }
    
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 6rem;
        color: var(--color);
        text-align: center;
    }

    .active {
    background-color: var(--active);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    color: white;
}

    @media screen and (max-width: 1080px) {
        .container {
            width: 50%;
        }
}
</style>