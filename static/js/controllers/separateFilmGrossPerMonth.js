import * as drawing from "/static/js/drawing.js";

window.onload = function() {
  let urlParts = window.location.pathname.split("/");
  let url = "/api/separateFilmGrossPerMonth/" + urlParts.slice(2).join("/");
  console.log(url);

  $.getJSON( url, function( data ) {
    drawing.clear();

    let max = drawing.getMax(data, 3)
    let valueColumn = 3;
    let labelColumn = 0;

    let sortedData = data.sort((a, b) => {
        return Number(a[valueColumn]) < Number(b[valueColumn])
    });

    let values =  sortedData.map(x => x[valueColumn]);
    let labels =  sortedData.map(x => x[labelColumn]);

    let bars;

    bars = d3.select(".visualization")
      .selectAll("div")
      .data(labels)
      .enter()
      .append("div")
      .classed("separate-films-gross-bars", true)
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
  });
}
