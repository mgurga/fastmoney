
<script>
    import { onMount } from 'svelte';

    import Chart from './chart.svelte'
    import Timer from './timer.svelte'
    import qa from './qa.json'

    let chart1;
    let chart2;
    let selectedChart;
    let userAnswer;
    let qnum = 0;
    let selectedAnswer;

    onMount(async () => {
        // chart1.addAnswer("Hello");
        // chart1.addPoint(51);
    });

    function hideChart1() { chart1.hideAll(); }
    function hideChart2() { chart2.hideAll(); }
    function showChart1() { chart1.showAll(); }
    function showChart2() { chart2.showAll(); }

    function addToChart(e) {
        if (e.key != "Enter" && e.type != "click") return;
        if (userAnswer == "") return;
        if (selectedChart == "chart1")
            chart1.addAnswer(userAnswer);
        else
            chart2.addAnswer(userAnswer);
        userAnswer = "";
    }

    function deleteLastAnswer() {
        if (selectedChart == "chart1")
            chart1.deleteLastAnswer();
        else
            chart2.deleteLastAnswer();
    }

    function submitAnswerPoints() {
        if (selectedChart == "chart1") {
            if (selectedAnswer == -1) {
                chart1.addPoint(0);
                return;
            }
            chart1.addPoint(qa[qnum].answers[selectedAnswer].points);
        } else {
            if (selectedAnswer == -1) {
                chart2.addPoint(0);
                return;
            }
            chart2.addPoint(qa[qnum].answers[selectedAnswer].points);
        }
        qnum++;
        selectedAnswer = "none";
    }
</script>

<style>
    .container {
        display: flex;
        justify-content: space-around;
    }

    footer {
        position:absolute;
        bottom:0;
        width:100%;
        height:80px;
    }
</style>

<Timer />
<br>
<br>

<div class="container">
    <Chart playernum=1 numrows=5 bind:this={chart1} />
    <Chart playernum=2 numrows=5 bind:this={chart2} />
</div>

<footer>
    <button on:click={hideChart1}>hide chart 1</button>
    <button on:click={hideChart2}>hide chart 2</button>
    <button on:click={showChart1}>show chart 1</button>
    <button on:click={showChart2}>show chart 2</button>
    <br>

    <select bind:value={selectedChart}>
        <option value="chart1">Chart 1</option>
        <option value="chart2">Chart 2</option>
    </select>
    <input bind:value={userAnswer} on:keyup={addToChart} type="text" name="player answer">
    <button on:click={addToChart}>Add</button>
    <button on:click={deleteLastAnswer}>Delete Last Answer</button>
    <br>

    <select bind:value={selectedAnswer}>
        <option value=-1>none</option>
        {#each qa[qnum].answers as a, i}
            <option value={i}>{a.answer}</option>
        {/each}
    </select>
    <button on:click={submitAnswerPoints}>Submit Answer</button>
</footer>