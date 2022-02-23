
<script>
    let time = 60; // in seconds
    let countingdown = false;

    function toggle() {
        countingdown = !countingdown;
    }

    function reset() {
        time = 60;
        countingdown = false;
    }

    function addMin() {
        time += 60;
    }

    let countinterval = setInterval(function() {
        if (countingdown) time--;
    }, 1000);
</script>

<style>
    #timer {
        background-color: black;
        color: white;
    }

    p {
        background-color: black;
        border-radius: 5px;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>

<div id="timer">
    <button on:click={toggle}>{countingdown ? "Stop" : "Start"}</button>
    <button on:click={reset}>Reset</button>
    <button on:click={addMin}>Add 1 Minute</button>
    <p style="float: right; font-size: 28pt; margin: 0; color: red;">{time}</p>
</div>