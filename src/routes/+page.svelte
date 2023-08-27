<svelte:head>
    <title>HUMBLEBEAST Coaching</title>
</svelte:head>
<script>
    import NavBar from "../components/home-components/nav-bar.svelte";
    import Hero from "../components/home-components/hero.svelte";
    import Pricing from "../components/home-components/pricing.svelte";
    import Resources from "../components/home-components/resources.svelte";
    import Contact from "../components/home-components/contact.svelte";
    import Footer from "../components/home-components/footer.svelte";

</script>

<body>
    <section id="nav">
           <NavBar/>
    </section>
    
    <section id="hero">
        <Hero/>
    </section>
   
    <section id="price">
           <Pricing/>
    </section>

    <section id="resources">
        <Resources/>
    </section>
   
    <section id="contact">
        <Contact/>
    </section>

    <section id="footer">
        <Footer/>
    </section>

</body>

<style>
    body {
        background-color: #000000;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 10rem;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
</style>