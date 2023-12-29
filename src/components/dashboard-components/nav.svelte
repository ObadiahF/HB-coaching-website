<script>
    import MediaQuery from '../../utils/MediaQuery.svelte'
    import { colors } from '../../utils/colors.js';
    import { dashState, state } from '../../utils/store';
    import { onMount } from 'svelte';
    import { logout, uploadPfp, readPfp } from '../../utils/firebase';
    //reactive 'active' navBar
    let current = 'Dashboard';
    let lightMode = false;
    let pfpInput;
    let name;
    let error = false;
    let errorMsg = "File is to big!";

    export let data;
    let pfp;

    //default colors for dark mode
    let mainBackground, color, activeColor, checkedColor, lineColor = { colors };


    $: {
        if (lightMode) {
            mainBackground = 'white';
            color = '#242529'
            activeColor = 'grey';
            checkedColor = '#242529';
            lineColor = '#D3D3D3';
            dashState.set(["dash", "light-mode"]);
        } else {
            mainBackground = '#242529';
            color = 'white'
            activeColor = '#353537';
            checkedColor = '#242529';
            lineColor = '#2c2d32';
            dashState.set(["dash", "dark-mode"]);
        }
    }

    onMount(() => {
        const page = getCurrentPage(window.location.href);
        const seperated = page[0].split('');
        seperated[0] = seperated[0].toUpperCase();
        
        current = seperated.join('');

        name = localStorage.getItem('name');
        if (!name) {
            const nameFromServer = data.fullName;
            if (nameFromServer) {
                name = nameFromServer;
                return;
            }
            name = "Error getting name."
        }
    });

    onMount(async () => {
        const pfpLink = await readPfp(data.id);
            if (pfpLink) {
                pfp.src = pfpLink;
            };
    });

    const getCurrentPage = (url) => {
        return url.split('/').slice(-1);
    }

    const logOut = async () => {
        await logout(); //sign out of firebase
        window.location = "/";
    }

    const handleEditBtnClick = () => {
        current = ''
        pfpInput.click();
    };

    const fileSelected = () => {
        const selectedFile = pfpInput.files[0];
        const twoMegaBytes = 1_000_000 * 2; 
        if (selectedFile.size > twoMegaBytes) {
            errorMsg = 'File must be smaller than 2 Megabytes';
            error = true;
            return;
        }

        if (selectedFile.type.split('/')[0] !== 'image') {
            errorMsg = 'File must be an image!';
            error = true;
            return;
        }

        uploadPfp(selectedFile, data.id);

        if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const dataURL = e.target.result;
            pfp.src = dataURL;
            error = false;
        };

        reader.readAsDataURL(selectedFile);
    }
    };

</script>

<svelte:head>
<script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>

<div class="container" style="  
    --main-background: {mainBackground};
    --color: {color};
    --active: {activeColor};
    --checked: {checkedColor};
    --line: {lineColor};
">
    <div class="logo-container">
        <h3>HB</h3>
    </div>

    <div class="profile-container">
        <div class="img-container">
            <img src="https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg" alt="user" bind:this={pfp}>
        </div>
        <div class="name-container">
            <h3>{name}</h3>
            {#if error}
            <h3 style="color: red;">{errorMsg}</h3>
            {/if}
        </div>
        <div class="profile-btn-container">
            <button on:click={handleEditBtnClick}>Edit</button>
        </div>
    </div>


    <div class="nav-container">
        <input type="file" bind:this={pfpInput} on:change={fileSelected} style="display: none;" accept="image/*">
        <ul>

            <MediaQuery query="(max-width: 1500px)" let:matches>
        {#if matches}
            <li class="list-items {current === 'Dashboard' ? 'active' : ''}"><a href="/dashboard" on:click={() => (current = 'Dashboard')}><i class="fa-solid fa-grip-vertical nav-icon"></i></a></li>
            <li class="list-items {current === 'Messages' ? 'active' : ''}"><a href="/dashboard/messages" on:click={() => (current = 'Messages')}><i class="fa-solid fa-envelope nav-icon"></i></a></li>
            <li class="list-items {current === 'Schedule' ? 'active' : ''}"><a href="/dashboard/schedule" on:click={() => (current = 'Schedule')}><i class="fa-regular fa-calendar-days nav-icon"></i></a></li>
            
            <li class="list-items {current === 'Management' ? 'active' : ''}"><a href="/dashboard/manage" on:click={() => (current = 'Management')}><i class="fa-solid fa-users nav-icon"></i></a></li>
            {#if data.isCoach === true}
            <li class="list-items {current === 'Settings' ? 'active' : ''}"><a href="/dashboard/settings" on:click={() => (current = 'Settings')}><i class="fa-solid fa-gear nav-icon"></i></a></li>
            {/if}
            {:else}
            <li class="list-items {current === 'Dashboard' ? 'active' : ''}"><a href="/dashboard" on:click={() => (current = 'Dashboard')}><i class="fa-solid fa-grip-vertical nav-icon"></i>Dashboard</a></li>
            <li class="list-items {current === 'Messages' ? 'active' : ''}"><a href="/dashboard/messages" on:click={() => (current = 'Messages')}><i class="fa-solid fa-envelope nav-icon"></i>Messages</a></li>
            <li class="list-items {current === 'Schedule' ? 'active' : ''}"><a href="/dashboard/schedule" on:click={() => (current = 'Schedule')}><i class="fa-regular fa-calendar-days nav-icon"></i>Schedule</a></li>
            {#if data.isCoach === true}
            <li class="list-items {current === 'Management' ? 'active' : ''}"><a href="/dashboard/manage" on:click={() => (current = 'Management')}><i class="fa-solid fa-users nav-icon"></i>Management</a></li>
            {/if}
            <li class="list-items {current === 'Settings' ? 'active' : ''}"><a href="/dashboard/settings" on:click={() => (current = 'Settings')}><i class="fa-solid fa-gear nav-icon"></i>Settings</a></li>
        {/if}
    </MediaQuery>
        </ul>
    </div>

    <div class="mode-container">
        <!--
        <MediaQuery query="(max-width: 1500px)" let:matches>
            {#if matches}
                <input type="checkbox" bind:checked={lightMode}>
            {:else}
                <label for="toggle on Dark Mode">Dark</label>
                <input type="checkbox" bind:checked={lightMode}>
                <label for="toggle on Light Mode">Light</label>
            {/if}
            </MediaQuery>
        -->
        <span class="logout-btn" on:click={logOut}>Logout</span>
    </div>
</div>

<style>
    
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container {
    background-color: var(--main-background);
    height: 100%;
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;
    padding: 3rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-right: 2px solid var(--line);
}

.logo-container {
    margin-bottom: 2rem;
    color: var(--color);
    font-size: 24px;
}

.profile-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 3rem;
}

.img-container {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    overflow: hidden;
}

.img-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-container .name-container {
    width: 100%;
    text-align: center;
    flex-wrap: wrap;
    height: fit-content;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color);
}

.profile-container .profile-btn-container button {
    font-size: 16px;
    padding: 0.1rem;
    width: 4rem;
    border-radius: 30px;
    border: 1px solid var(--color);
    background-color: inherit;
    color: var(--color);
    cursor: pointer;
    transition: 200ms ease-in;
}

.profile-container .profile-btn-container button:hover {
    opacity: 0.7;
}

.nav-container {
    width: 200%;
}

.nav-container ul {
    list-style-type: none;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
}

.list-items {
    padding: 1rem;
    width: 9rem;
    text-align: left;
    border-radius: 12px;
    background-color: inherit;
}

.list-items a {
    color: var(--color);
    text-decoration: none;
}

.list-items a:hover {
    transition: 200ms ease;
    opacity: 0.8;
}

.active {
    background-color: var(--active);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    color: white;
}

.nav-icon {
    margin-right: 0.5rem;
}

.mode-container {
    margin-top: auto;
    display: flex;
    align-items: center;
}

.logout-btn {
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    background-color: #353537;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 1rem;
}

.logout-btn:hover {
    opacity: 0.8;
}

.mode-container label {
    color: var(--color);
    padding: 0.2rem;
}

input[type="checkbox"] {
    position: relative;
    width: 80px;
    height: 40px;
    -webkit-appearance: none;
    appearance: none;
    background: grey;
    outline: none;
    border-radius: 2rem;
    cursor: pointer;
    box-shadow: inset 0 0 5px rgb(0 0 0 / 50%);
    scale: .8;
    border: 2px solid var(--color);
}

input[type="checkbox"]::before {
    content: "";
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: var(--color);
    position: absolute;
    top: 0;
    left: 0;
    transition: 0.5s;
    }

input[type="checkbox"]:checked::before {
    transform: translateX(100%);
    background: white;
}

input[type="checkbox"]:checked {
    background: var(--active);
}

@media screen and (max-width: 1650px) {
        .container {
            border-radius: 0;
        }
}

@media screen and (max-width: 1500px) {
    .list-items {
        text-align: center;
        width: 4.5rem;
    }
    .nav-icon {
        font-size: 32px;
        margin: 0;
    }
}
</style>