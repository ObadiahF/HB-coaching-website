<script>
    import { scrollIntoView } from "../../utils/scrollHelper";

    const scrollToPricing = () => {
        scrollIntoView('price');
    }
</script>

<div class="container">
    <div class="black-column">
        <div class="gradient">
            <div class="hero-container">
                <div class='hero-title-container'>
                    <h1>Unleash your inner beast</h1>
                </div>
                <div class="paragraph-container">
                    <p>At HumbleBeast Coaching, we specialize in weightlifting, fat loss, and muscle building. Let our expert coach guide your transformation with personalized workout programs and tailored nutrition plans.</p>
                </div>
                <div class="btn-container">
                    <button id="meet" class='hero-btn'>Meet Our Coaches</button>
                    <button id="pricing" class='hero-btn' on:click={scrollToPricing}>View Pricing</button>
                </div>
            </div>
        </div>
    </div>
    <div class="picture-container">
        <img src="./brian2.jpg" alt="Brians a cool guy">
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .black-column {
        max-height: 100vh;
        background-color: black;
        min-width: 40%;
        z-index: 4;
    }

    .container {
        min-height: 80vh;
        display: flex;
        margin-top: 80px;
    }


    .picture-container {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .picture-container img {
        height: 50rem;
        /* mix-blend-mode: luminosity; */
        padding: 1rem;
        border-radius: 5%;
    }


    .gradient {
        min-height: 60%;
        width: 70%;
        background: linear-gradient(to top right, #DDFFF7, #93E1D8, #FFA69E, #AA4465, #861657);
        border-image-slice: 1;
        z-index: 2;
        margin-top: 15%;
        margin-left: 10%;
        border-radius: 8px;
        height: auto;
    }

    .hero-container {
        width: 98%;
        background-color: black;
        transform: translateY(-4%);
        padding: 0.5rem;
        border-radius: 8px;
        border-bottom-left-radius: 0;
        min-height: 25vw;
    }

    .hero-container h1 {
        font-family: 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        color: #FFA69E;
        text-transform: capitalize;
        font-size: 63px;
        font-weight: bold;
        letter-spacing: -0.5%;
    }

    .hero-title-container {
        width: 50%;
        border-bottom: 2px solid #861657;
    }

    .paragraph-container {
        margin-top: 2rem;
        display: flex;
        flex: 1;
    }

    .paragraph-container p {
        font-size: 28px;
        color: #FFFFFF;
    }

    .btn-container {
        padding: 1rem 0;
        margin-top: 1rem;
        display: flex;
        gap: 1rem;
    }

    #meet {
        background: #FFA69E;
    }

    #meet:hover {
        transition: 300ms ease;
        background-color: #DDB8B0;
    }
    
    #pricing {
        background-color: #1e1d1d;
        color: white;
    }

    #pricing:hover {
        transition: 300ms ease;
        background-color: #2e2d2d;
    }

    .hero-btn {
        cursor: pointer;
        border: none;
        border-radius: 8px;
        padding: 0.5rem;
        font-size: 24px;
        width: 40%;
    }

    @media screen and (max-width: 1025px) {
        .container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column-reverse;
        gap: 2rem;
    }

        .gradient {
            margin: 0 auto;
    }
}

 @media screen and (max-width: 427px) {
    .btn-container {
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .hero-btn {
        width: 80%;
    }
 }

    @media screen and (max-width: 385px) {
        .hero-container h1 {
            font-size: 52px;
        }
    }
</style>