<svelte:head>
    <title>HumbleBeast | Settings</title>
</svelte:head>

<script>
    let promos = [
        { 'code': 'gdsfgd', 'promo': '15%' }
    ]
</script>

<div class="settings-container">
        <div class="settings-item">
            <h3>Promo Codes</h3>
            <p>Configure your Promo Codes here.</p>
            <div class="promo-container">
                {#each promos as promo}
                     <p>{promo.code}</p>
                {/each}
            </div>
        </div>
        <div class="settings-item">
            <h3>Profile Settings</h3>
            <p>Update your profile information.</p>
            <button>Open</button>
        </div>
        <div class="settings-item">
            <h3>Privacy Settings</h3>
            <p>Manage your privacy preferences.</p>
            <button>Open</button>
        </div>
        <div class="settings-item">
            <h3>Security Settings</h3>
            <p>Enhance your account security.</p>
            <button>Open</button>
        </div>
</div>

<style>
    .settings-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 20px;
}

.settings-item {
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.settings-item:hover {
    transform: translateY(-5px);
}

h3 {
    font-size: 20px;
    margin: 0 0 10px;
}

p {
    font-size: 16px;
    margin: 0;
}

button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: #0056b3;
}

@media (max-width: 768px) {
        .settings-container {
            grid-template-columns: repeat(1, 1fr);
        }
    }
</style>