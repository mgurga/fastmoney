
<script>
    import { onMount } from 'svelte';

    import Chart from './chart.svelte'

    let chart1;
    let chart2;

    onMount(async () => {
        chart1.addAnswer("Hello");
        chart1.addPoint(51);
    });
</script>

<style>
    .container {
        display: flex;
        margin: 0 auto;
        width: fit-content;
    }
</style>

<div class="container">
    <Chart playernum=1 bind:this={chart1} />
    <div style="min-width: 25px" />
    <Chart playernum=2 bind:this={chart2} />
</div>