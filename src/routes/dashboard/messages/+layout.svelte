<script>
    import User from "../../../components/dashboard-messages-comp/user.svelte";
    import MediaQuery from "../../../utils/MediaQuery.svelte";
</script>
<main>
    <MediaQuery query="(max-width: 522px)" let:matches>
        {#if !matches}
        <User/>
        {/if}
    </MediaQuery>
    <slot />
</main>

<style>
    main {
        display: flex;
    }
</style>