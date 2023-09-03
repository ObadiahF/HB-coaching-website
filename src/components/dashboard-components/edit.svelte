
<script>
    import { colors } from "../../utils/colors";
    import { dashState } from "../../utils/store";

    let newImage;
    let pfpInput;
    let pictureInput;
    let coach = true;
    let state;
    let mainBackground, color, activeColor, checkedColor, lineColor = { colors };

$: {
    state = $dashState;
    if (state[1] === 'light-mode') {
            mainBackground = 'white';
            color = '#242529'
            activeColor = 'grey';
            checkedColor = '#242529';
            lineColor = '#D3D3D3';
        } else {
            mainBackground = '#242529';
            color = 'white'
            activeColor = '#353537';
            checkedColor = '#242529';
            lineColor = '#2c2d32';
        }
}

let goalsOrTags = [];
let images = [
    'https://www.muscleandfitness.com/wp-content/uploads/2013/06/intro-ez-bar.jpg?quality=86&strip=all',
    'https://yt3.googleusercontent.com/_jCI5T_p1HCJO8JV0JZ4DMRHw6EEZ3VUnuGZsr5GQMsGR11TVXg47BIbBksQqltirrTrS_uYaQ=s900-c-k-c0x00ffffff-no-rj'
];
let currentImage = [images[0]]
let usersFavoriteImg = '';


const clickPfp = () => {
    pfpInput.click();
}

const chooseNewPhoto = () => {
    pictureInput.click();
}

const getData = async () => {

}

const switchImage = (num) => {
    let newValue = images.indexOf(currentImage) + num;
    if (newValue === images.length) newValue = 0;
    if (newValue < 0) newValue = images.length - 1;
    currentImage = images[newValue];
}

const favoriteImg = () => {
    usersFavoriteImg = currentImage.toLocaleString();
}

const deleteImg = () => {

}

</script>

<main style="  
    --main-background: {mainBackground};
    --color: {color};
    --active: {activeColor};
    --checked: {checkedColor};
    --line: {lineColor};
">
    <div class="column" id='first-column'>
        <div class="changepfp">
            <h1>Edit Profile</h1>
            <img src="https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg" alt="user">
            <input type="file" bind:value={newImage} bind:this={pfpInput}>
            <button class="button" on:click={clickPfp}>Choose Image</button>
        </div>
        <div class="change-name">
            <h2>Brian Kim</h2>
            <button>Edit</button>
        </div>
        <div class="local-time">
            <h6>5:21 PM local time</h6>
            <button class="button">Change Time Zone</button>
        </div>

        <div class="info">
        {#if coach}
                <h3>Tags</h3>
                <ul>
                    <li>Weight Lost</li>
                    <li>Fat Lost</li>
                    <li>Muscle Gain</li>
                </ul>
        {:else}
                <h3>Goals</h3>
                <ul>
                    <li>Lose Fat</li>
                    <li>Bench Press 315lbs</li>
                    <li>Weigh 180lbs</li>
                </ul>
        {/if}
        <input type="text" placeholder="Add new {coach ? "tag" : "goal"}...">
        <button class="button">Add</button>
            </div>
    </div>
    <div class="column" id='second-column'>
        
        <div class="slideshow-container">
            <div class="img-container">
                <img src="{currentImage}" alt="" id='img'>
                <div class="img-btn-container">
                    <button on:click={favoriteImg} class='{usersFavoriteImg === currentImage ? 'fav' : ''} icon-btn'>⭐</button>
                    <button on:click={deleteImg} class="icon-btn"><i class="fa-solid fa-x" style="color: #ff0000;"></i></button>
                </div>
            </div>
        </div>
        <div class="switch-btns">
            <button class="button" on:click={(() => {switchImage(1)})}><i class="fa-solid fa-arrow-left" style="color: #ffffff;"></i></button>
            <input type="file" bind:this={pictureInput} style="display: none;">
            <button class="button" on:click={chooseNewPhoto}>Add Photo</button>
            <button class="button" on:click={(() => {switchImage(-1)})}><i class="fa-solid fa-arrow-right" style="color: #ffffff;"></i></button>
        </div> 
    </div>
    
</main>

<style>
    main {
        background-color: var(--main-background);
        display: grid;
        grid-template-columns: 20% 70%;
        padding: 2rem;
        gap: 5rem;
        border-top-right-radius: 32px;
        border-bottom-right-radius: 32px;
    }

    #first-column {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .changepfp {
        display: flex;
        align-items: center;
        flex-direction: column;
        color: var(--color);
    }

    .changepfp h1 {
        font-size: 32px;
        text-align: center;
    }

    .changepfp img {
        height: 10rem;
        border-radius: 50%;
        padding: 1rem 0;
    }

    .changepfp input, .add-images input {
        display: none;
    }

    .change-name {
        margin-top: 2rem;
        padding: 1rem;
        display: flex;
        gap: 1rem;
        color: var(--color);
        align-items: center;
    }

    .change-name h2 {
        font-size: 26px;
        margin: 0;
    }

    .change-name button {
        background-color: transparent;
        font-size: 18px;
        color: white;
        border: none;
        cursor: pointer;
        text-decoration: underline;
    }

    .button {
        cursor: pointer;
        font-size: 18px;
        width: 10rem;
        padding: 0.3rem;
        background-color: var(--active);
        color: white;
        border: none;
        border-radius: 18px;
    }

    .button:hover {
        transition: 200ms ease;
        opacity: 0.8;
    }

    .local-time {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        color: var(--color);
    }

    .local-time h6 {
        font-size: 18px;
        margin: 0;
    }

    .local-time button {
        margin-top: 1rem;
        width: 130%;
        height: 150%;
    }

    .info {
        display: flex;
        align-items: center;
        flex-direction: column;
        color: var(--color);
    }

    .info h3 {
        font-size: 32px;
        margin: 0;
        margin-top: 2rem;
    }

    .info ul {
        list-style-type: decimal;
    }

    .info ul li {
        padding: 0.4rem;
        font-size: 24px;
        cursor: pointer;
    }

    .info ul li:hover {
        text-decoration: line-through;
    }

    .info input {
        border: none;
        border-radius: 24px;
        font-size: 19px;
        width: 12rem;
        background-color: var(--line);
        color: white;
    }

    .info input:focus {
        outline: none;
    }

    .info input::placeholder {
        text-align: center;
    }

    .info button {
        margin-top: 0.5rem;
    }



    .slideshow-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 40rem;
        border: 2px solid var(--active);
        border-radius: 32px;
        margin-top: 2rem;
    }

    .img-container {
        display: flex;
        height: 100%;
        width: 100%;
        position: relative;
    }

    .switch-btns {
        display: flex;
        justify-content: center;
        gap: 3rem;
        margin-top: 1rem;
    }

    .slideshow-container img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        padding: 1rem;
        border-radius: 32px;
    }

    .img-btn-container {
        display: flex;
        gap: 0.5rem;
        position: absolute;
        top: 30px;
        right: 30px;
    }

    .img-btn-container button {
        cursor: pointer;
        font-size: 32px;
        min-width: 4rem;
        background-color: var(--active);
        border-radius: 32px;
        border: none;
        padding: 0.3rem;
        position: relative;
    }

    .img-btn-container button:hover {
        opacity: 0.7;
    }

    .img-btn-container button:hover::after {
        background-color: var(--color);
        padding: 0.3rem;
        font-size: 12px;
        position: absolute;
        width: 6rem;
        bottom: -1.5rem;
        left: -50%;
    }

    .img-btn-container button:hover:nth-child(1)::after {
        content: "Make First Image";
    }

    .img-btn-container button:hover:nth-child(2)::after {
        content: "Delete";
    }

    .fav {
        display: none;
    }

    @media screen and (max-width: 983px) {
        main {
            display: flex;
            align-items: center;
            flex-direction: column;
        }
    }
    
</style>