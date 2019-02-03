import { months } from "/static/js/vars.js";
import { getMax } from "/static/js/drawing.js";

function drawBars(data, labelColumn, valueColumn, sortColumn, maxColumn, reverse, link) {
  // data strucure: | Genre | Domestic Gross | Worldwide Gross |

  let sortedData = data.sort((a, b) => {
    if (reverse) {
      return Number(a[sortColumn]) > Number(b[sortColumn])
    } else {
      return Number(a[sortColumn]) < Number(b[sortColumn])
    }
  });

  let max = getMax(data, maxColumn);

  let values =  sortedData.map(x => x[valueColumn]);
  let labels =  sortedData.map(x => {
    if (x[labelColumn].match(/^[0-9]+$/)) {
      return months[Number(x[labelColumn])];
    } else {
      return x[labelColumn];
    }
  });

  bars(values, labels, max, link);
}

function bars(values, labels, max, link) {
  let bars = d3.select(".visualization")
    .selectAll("div")
    .data(labels)
    .enter()
    .append("div")
    .classed("genre-gross-bars", true)
    .append("a")
    .attr("href", l => `/${link}/${encodeURIComponent(l)}`)
    .append("div")
    .classed("bar-container", true);

  bars.data(labels).append("span").text(labels => labels);
  bars.data(labels).append("div")
    .classed("bar-style", true)

  bars.data(values).append("span")
    .classed("bar-value", true)
    .text(d => "$ " + numeral(d).format("0,0"));

  d3.selectAll("div.bar-style").data(values).transition()
    .duration(500)
    .style("width", values => values / max * 500 + "px");
}

export { drawBars };
