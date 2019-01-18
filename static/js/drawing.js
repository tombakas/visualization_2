import { months } from "/static/js/vars.js";

function clear() {
  d3.select(".visualization").selectAll("div").remove();
}

function drawBars(data, sortColumn, attributes) {
  let sortedData = data.sort((a, b) => a[sortColumn] < b[sortColumn]);

  let maxDomestic = Math.max(...(data.map(row => row[1])));
  let maxWorldwide = Math.max(...(data.map(row => row[2])));
  let max = Math.max(maxDomestic, maxWorldwide);

  let labels = data.map(x => x[0]);
  let values = data.map(x => x[1]);

  let bars = d3.select(".visualization")
    .selectAll("div")
    .data(sortedData)
    .enter()
    .append("div")
    .classed("bar-container", true);

  if (attributes) {
    bars.attr("data-genre", d => d[0]);;
  }

  bars.data(labels).append("span").text(labels => labels);
  bars.data(labels).append("div")
    .classed("bar-style", true)

  bars.data(values).append("span")
    .classed("bar-value", true)
    .text(d => "$ " + numeral(d).format("0,0"));

  d3.selectAll("div.bar-style").data(values).transition()
    .duration(500)
    .style("width", values => values / max * 1000 + "px");
}

function drawCalendarBars(data, sortColumn, attributes) {
  let sortedData = data.sort((a, b) => a[sortColumn] < b[sortColumn]);

  let maxDomestic = Math.max(...(data.map(row => row[1])));
  let maxWorldwide = Math.max(...(data.map(row => row[2])));
  let max = Math.max(maxDomestic, maxWorldwide);

  let labels = data.map(x => x[0]);
  let values = data.map(x => x[1]);

  let bars = d3.select(".visualization")
    .selectAll("div")
    .data(sortedData)
    .enter()
    .append("div")
    .classed("bar-container", true);

  if (attributes) {
    bars.attr("data-genre", d => d[0]);;
  }

  bars.data(labels).append("span").text(labels => months[Number(labels)]);
  bars.data(labels).append("div")
    .classed("bar-style", true)

  bars.data(values).append("span")
    .classed("bar-value", true)
    .text(d => "$ " + numeral(d).format("0,0"));

  console.log(values);
  d3.selectAll("div.bar-style").data(values).transition()
    .duration(500)
    .style("width", values => values / max * 1000 + "px");
}

export {clear, drawBars, drawCalendarBars};
