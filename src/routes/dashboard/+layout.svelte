
<script>
    import Nav from "../../components/dashboard-components/nav.svelte";
    import { colors } from "../../utils/colors";
    import { dashState } from "../../utils/store";
let state;

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


let mainBackground, color, activeColor, checkedColor, lineColor = { colors };

</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>

<body
style="
    --main-background: {mainBackground};
    --color: {color};
    --active: {activeColor};
    --checked: {checkedColor};
    --line: {lineColor};
">
    <div class="container">
        <Nav/>
        <slot />
    </div>
    
</body>

<style>

    body {
        background-color: #5E6872;
        padding: 4.5rem 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 100vh;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .container {
        background-color: var(--main-background);
        border-radius: 32px;
        display: grid;
        grid-template-columns: 10% 90%;
        width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
    }

    @media screen and (max-width: 1650px) {
        body {
            padding: 0;
        }

        .container {
            border-radius: 0;
        }
    }

    @media screen and (max-width: 1630px) {
        .container {
            width: 100vw;
            min-height: 100vh;
        }
    }

    @media screen and (max-width: 983px) {
        .container {
            grid-template-columns: 20% 80%;
            width: 100vw;
        }
    }

    @media screen and (max-width: 511px) {
        .container {
            grid-template-columns: 30% 70%;
            min-height: 100vh;
        }

        body {
            background-color: #242529;
        }
    }
</style>