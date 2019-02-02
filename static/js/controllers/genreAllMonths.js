import * as drawing from "/static/js/drawing.js";
import { months } from "/static/js/vars.js"

window.onload = function() {
  drawing.clear();

  let u = window.location.pathname.split("/");
  let genre = u[u.length - 2]
  let url = "/api/genreAllMonths/" + genre;

  $.getJSON( url, function( data ) {
    let values;
    let labels;
    let max;

    let parent = d3.select(".visualization")
      .append("div")
      .classed("gridContainer", true);

    for(let i=1; i<=12; i++) {
      let dataMonth = data[i].sort((a, b) => {
        return (Number(a[3]) < Number(b[3]));
      }).slice(0, 50);

      max = d3.max(dataMonth, (d) => d[3])
      values = dataMonth.map(x => x[3]);

      let y = d3.scaleLinear()
        .domain([0, max])
        .range([5, 200])

      let svg = parent.append("a")
        .attr("href", "/separateFilmGrossPerMonth/" + months[i] + "/" + encodeURIComponent(genre))
        .append("svg")
        .attr("width", 200)
        .attr("height", 230)
        .append("g")

      svg.selectAll(".svg-bar")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "svg-bar")
        .attr("x", v => values.indexOf(v) * 4 + 5)
        .attr("y", v => 200 - y(v))
        .attr("width", "3")
        .attr("height", v => y(v))

      svg.append("text")
        .attr("y", "220")
        .attr("x", "2")
        .text(months[i]);
    }
  });
}
