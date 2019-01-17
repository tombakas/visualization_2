// Gross Per Genre
$("#grossPerGenre").on("click", function() {
  $.getJSON("/grossPerGenre", function( data ) {
    let sortedData = data.sort((a, b) => a[1] < b[1]);

    let maxDomestic = Math.max(...(data.map(row => row[1])));
    let maxWorldwide = Math.max(...(data.map(row => row[2])));
    let max = Math.max(maxDomestic, maxWorldwide);

    d3.select(".visualization").selectAll("p").remove();

    let bars = d3.select(".visualization")
      .selectAll("div")
      .data(sortedData)
      .enter()
      .append("div")
      .classed("bar-container", true);

    bars.data(sortedData).append("span").text(d => d[0]);
    bars.data(sortedData).append("div")
      .classed("bar-style", true)
      .style("width", d => (d[1] / maxWorldwide * 1000 + "px"));

    bars.data(sortedData).append("span")
      .classed("bar-value", true)
      .text(d => "$ " + numeral(d[1]).format("0,0"));

  })
});
