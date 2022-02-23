
<script>
    export let playernum;
    export let numrows;

    let chartvals = [];
    let pointvals = [];
    let empty = "________";
    let emptypoints = "__";
    let hidden = Array((numrows * 2));
    let hiddentext = "-";
    let totalpoints = 0;

    export function addAnswer(answer) {
        if (chartvals.length == numrows) chartvals = [];
        chartvals = [...chartvals, answer];
    }

    export function addPoint(point) {
        if (pointvals.length == numrows) pointvals = [];
        pointvals = [...pointvals, point];

        totalpoints = 0;
        pointvals.forEach((val) => {totalpoints += val});
    }

    export function hideAll() {
      for (var i = 0; i < (numrows * 2) + 1; i++) {
        hidden[i] = true;
      }
      hidden[-1] = true;
    }

    export function showAll() {
      for (var i = 0; i < (numrows * 2) + 1; i++) {
        hidden[i] = false;
      }
      hidden[-1] = false;
    }

    export function getCurrentNum() {
      return pointvals.length;
    }

    function unhide(hiddennum) {
      console.log(hiddennum);
      hidden[hiddennum] = false;
    }

    export function deleteLastAnswer() { chartvals = chartvals.slice(0, chartvals.length - 1) }
</script>

<style type="text/css">
    .tg  {border-collapse:collapse;border-spacing:0;background-color: black; color: white;}
    .tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
      overflow:hidden;padding:10px 5px;word-break:normal;}
    .tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
      font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal; width:auto;}
    .tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top; cursor:pointer;}
</style>

<table class="tg" style="margin: 0; padding: 0; width: 45%">
    <thead>
      <tr>
        <th class="tg-0pky">Group {playernum} Answers</th>
        <th class="tg-0pky">Points</th>
      </tr>
    </thead>
    <tbody>
      {#each {length: numrows} as _, i}
      <tr>
        <td class="tg-0pky" on:click={() => unhide(i)}>
          <span>{hidden[i] ? hiddentext : chartvals[i] == undefined ? empty : chartvals[i]}</span>
        </td>
        <td class="tg-0pky" on:click={() => unhide(Number(numrows) + i)}>
          <span>{hidden[Number(numrows) + i] ? hiddentext : pointvals[i] == undefined ? emptypoints : pointvals[i]}</span>
        </td>
      </tr>
      {/each}
      <tr style="border-color: yellow; border-width: thick;">
        <td class="tg-0pky">
          <span>Total Points</span>
        </td>
        <td class="tg-0pky" on:click={() => unhide(-1)}>
          <span>{hidden[-1] ? hiddentext : totalpoints}</span>
        </td>
      </tr>
    </tbody>
    </table>