
<script>
    export let playernum;

    let chartvals = [];
    let pointvals = [];

    export function addAnswer(answer) {
        if (chartvals.length == 4) chartvals = [];
        chartvals = [...chartvals, answer];
    }

    export function addPoint(point) {
        if (pointvals.length == 4) pointvals = [];
        pointvals = [...pointvals, point];
    }
</script>

<style type="text/css">
    .tg  {border-collapse:collapse;border-spacing:0;}
    .tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
      overflow:hidden;padding:10px 5px;word-break:normal;}
    .tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
      font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
    .tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
</style>

<table class="tg" style="margin: 0; padding: 0;">
    <thead>
      <tr>
        <th class="tg-0pky">Player {playernum} Answers</th>
        <th class="tg-0pky">Points</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tg-0pky">{chartvals[0] == undefined ? "" : chartvals[0]}</td>
        <td class="tg-0pky">{pointvals[0] == undefined ? "" : pointvals[0]}</td>
      </tr>
      <tr>
        <td class="tg-0pky">{chartvals[1] == undefined ? "" : chartvals[1]}</td>
        <td class="tg-0pky">{pointvals[1] == undefined ? "" : pointvals[1]}</td>
      </tr>
      <tr>
        <td class="tg-0pky">{chartvals[2] == undefined ? "" : chartvals[2]}</td>
        <td class="tg-0pky">{pointvals[2] == undefined ? "" : pointvals[2]}</td>
      </tr>
      <tr>
        <td class="tg-0pky">{chartvals[3] == undefined ? "" : chartvals[3]}</td>
        <td class="tg-0pky">{pointvals[3] == undefined ? "" : pointvals[3]}</td>
      </tr>
    </tbody>
    </table>