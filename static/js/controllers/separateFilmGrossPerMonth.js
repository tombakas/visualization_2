import * as drawing from "/static/js/drawing.js";

window.onload = function() {
  let urlParts = window.location.pathname.split("/");
  let url = "/api/separateFilmGrossPerMonth/" + urlParts.slice(2).join("/");

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

    d3.select(".y-axis").append("span").text("$" + numeral(max).format("0,0"));

    bars = d3.select(".visualization").selectAll("div")
      .data(sortedData)
      .enter()
      .append("a")
      .attr("href", sortedData => "/film/" + encodeURIComponent(sortedData[4]))
      .append("div")
      .classed("bar-container", true);

    // bars.data(labels).append("span").text(labels => labels);
    bars.data(labels).append("div")
      .classed("bar-style", true)

    let filmInfo = bars.data(sortedData)
      .append("div")
      .classed("film-info", true);

    filmInfo.append("div").text(sortedData => sortedData[0])
      .classed("title", true);

    filmInfo.append("div")
      .classed("budget", true)
      .insert("span").text(sortedData => "Budget: $ " + numeral(sortedData[1]).format("0,0"))

    filmInfo.append("div").text(sortedData => "Domestic Gross: $ " + numeral(sortedData[2]).format("0,0"))
      .classed("domestic-gross", true);

    filmInfo.append("div").text(sortedData => "Worldwide Gross: $ " + numeral(sortedData[3]).format("0,0"))
      .classed("worldwide-gross", true);

    // bars.data(values).append("span")
    // .classed("bar-value", true)
    // .text(d => "$ " + numeral(d).format("0,0"));

    d3.selectAll("div.bar-style").data(values).transition()
      .duration(500)
      .style("height", values => values / max * 100 + "%");
  });
}
