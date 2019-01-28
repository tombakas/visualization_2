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

function drawBars(data, sortColumn, link) {
  // data strucure: | Genre | Domestic Gross | Worldwide Gross |

  let sortedData = data.sort((a, b) => a[sortColumn] < b[sortColumn]);

  let max = getMax(data);

  let labels =  sortedData.map(x => x[0]);
  let values =  sortedData.map(x => x[1]);

  setUpBars(values, labels, max, link);
}

function drawNarrowBars(data, sortColumn, link) {
  // data strucure: | Genre | Domestic Gross | Worldwide Gross |

  let sortedData = data.sort((a, b) => a[sortColumn] < b[sortColumn]);

  let max = getMax(data, 2, 3);

  let labels =  sortedData.map(x => x[0]);
  let values =  sortedData.map(x => x[3]);

  setUpNarrowBars(values, labels, max, link);
}

function drawCalendarBars(data, link) {
  // data strucure: | Release month | Domestic Gross | Worldwide Gross | Genre |

  let max = getMax(data);

  let labels = data.map(x => months[Number(x[0])]);
  let values = data.map(x => x[1]);

  setUpBars(values, labels, max, link);
}

function setUpBars(values, labels, max, link) {
  let bars;

  if (link) {
    bars = d3.select(".visualization")
      .selectAll("div")
      .data(labels)
      .enter()
      .append("a")
      .attr("href", labels => `/${link}/` + encodeURIComponent(labels))
      .append("div")
      .classed("bar-container", true);
  } else {
    bars = d3.select(".visualization")
      .selectAll("div")
      .data(labels)
      .enter()
      .append("div")
      .classed("bar-container", true);
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

function setUpNarrowBars(values, labels, max, link) {
  let bars = d3.select(".visualization")
      .selectAll("div")
      .data(labels)
      .enter()
      .append("div")
      .classed("narrow-bar-container", true);

  // bars.data(labels).append("span").text(labels => labels);
  bars.data(labels).append("div")
    .classed("narrow-bar-style", true)
    .append("span").text((labels) => labels);

  // bars.data(values).append("span")
    // .classed("bar-value", true)
    // .text(d => "$ " + numeral(d).format("0,0"));

  d3.selectAll("div.narrow-bar-style").data(values).transition()
    .duration(500)
    .style("width", values => values / max * 1000 + "px");
}

export {clear, drawBars, drawCalendarBars, drawNarrowBars};
