<svelte:head>
    <title>HumbleBeast | Schedule</title>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import CircleLoad from './CircleLoad.svelte';
  import MediaQuery from '../../../utils/MediaQuery.svelte'
  
  let isCalendlyLoaded = false;

  onMount(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      isCalendlyLoaded = true;
    };
  });

</script>
<MediaQuery query="(min-width: 812px)" let:matches>
<div class={isCalendlyLoaded ? "" : "container"}>
  {#if isCalendlyLoaded}
    {#if matches}

    <!-- Calendly inline widget begin -->
    <div class="calendly-inline-widget" data-url="https://calendly.com/humblebeastcoaching/30min" style="min-width:320px;height:680px;"></div>
    <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
    <!-- Calendly inline widget end -->

    {:else}
      <div class="mobile">
        <div class="calendly-inline-widget mobile-widget" data-url="https://calendly.com/humblebeastcoaching/30min"></div>
        <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
      </div>
    {/if}
  {:else}
    <CircleLoad />
  {/if}
</div>

</MediaQuery>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mobile {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-widget {
    height: 100%;
    width: 100%;
    margin-top: 20%;
  }
</style>