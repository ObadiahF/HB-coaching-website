<svelte:head>
    <title>HumbleBeast | Dashboard</title>
    <script src="https://kit.fontawesome.com/db3c0028dc.js" crossorigin="anonymous"></script>
</svelte:head>

<script>

</script>

<div class="container">
    <h1 class='title'>Dashboard</h1>
    <div class="grid-container">
      <div class="grid-item">1</div>
      <div class="grid-item">2</div>
      <div class="grid-item">3</div>
      <div class="grid-item">4</div>
      <div class="grid-item">5</div>
      <div class="grid-item">6</div>
    </div>
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
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 2fr);
        width: 90%;
        height: 70%;
        place-items: center;
        grid-gap: 1rem;
        margin: 0 auto;
    }
    
    .grid-item {
        cursor: pointer;
        background-color: #ccc;
        padding: 20px;
        width: 65%;
        height: 70%;
        aspect-ratio: 1;
        text-align: center;
        border-radius: 8px; /* Add some border-radius for rounded corners */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Add a subtle box shadow */
        transition: 300ms ease;
    }

    .grid-item:hover {
        transition: 300ms ease;
    transform: translateY(-5px);
}

    /* Media Query for Responsive Layout */
    @media (max-width: 768px) {
        .grid-container {
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>
