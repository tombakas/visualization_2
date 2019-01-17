// Gross Per Genre
$("#grossPerGenre").on("click", function() {
  $.getJSON("/grossPerGenre", function( data ) {
    d = data;

    let maxDomestic = Math.max(...(data.map(row => row[1])));
    let maxWorldwide = Math.max(...(data.map(row => row[2])));
    let max = Math.max(maxDomestic, maxWorldwide);
    console.log(data.map(row => row[1]));
    console.log(maxDomestic);
    console.log(data.map(row => row[2]));
    console.log(maxWorldwide);
    console.log(max);

    d3.select(".visualization").selectAll("p").remove();

    let bars = d3.select(".visualization")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
      .classed("bar-container", true);

    bars.data(data).append("span").text(d => d[0]);
    bars.data(data).append("div")
      .classed("bar-style", true)
      .style("width", d => (d[1] / maxWorldwide * 1000 + "px"));

    bars.data(data).append("span")
      .classed("bar-value", true)
      .text(d => "$ " + d[1]);
      
  })
});
