import { months } from "/static/js/vars.js";

function getMax(data, columnOne, columnTwo) {
  if (!columnOne && !columnTwo) {
    columnOne = 1;
    columnTwo = 2;
  }

  let maxDomestic = Math.max(...(data.map(row => row[columnOne])));
  let maxWorldwide = Math.max(...(data.map(row => row[columnTwo])));
  let max = Math.max(maxDomestic, maxWorldwide);

  return max;
}

function clear() {
  d3.select(".visualization").selectAll("div").remove();
}

function drawBars(data, sortColumn, attributes) {
  // data strucure: | Genre | Domestic Gross | Worldwide Gross |

  let sortedData = data.sort((a, b) => a[sortColumn] < b[sortColumn]);

  let max = getMax(data);

  let labels =  sortedData.map(x => x[0]);
  let values =  sortedData.map(x => x[1]);

  setUpBars(values, labels, max, attributes);
}

function drawCalendarBars(data, sortColumn, attributes) {
  // data strucure: | Release month | Domestic Gross | Worldwide Gross | Genre |

  let sortedData = data.sort((a, b) => a[sortColumn] < b[sortColumn]);
  let max = getMax(data);

  let labels = sortedData.map(x => months[Number(x[0])]);
  let values = sortedData.map(x => x[1]);

  setUpBars(values, labels, max);
}

function setUpBars(values, labels, max, attributes) {
  console.log("pop");
  let bars = d3.select(".visualization")
    .selectAll("div")
    .data(labels)
    .enter()
    .append("div")
    .classed("bar-container", true);

  if (attributes) {
    bars.attr("data-genre", d => d);;
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

export {clear, drawBars, drawCalendarBars};
