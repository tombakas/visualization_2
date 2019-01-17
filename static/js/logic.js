let months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
}

// Gross Per Genre
$("#grossPerGenre").on("click", function() {
  $.getJSON("/grossPerGenre", function( data ) {
    let sortedData = data.sort((a, b) => a[1] < b[1]);

    let maxDomestic = Math.max(...(data.map(row => row[1])));
    let maxWorldwide = Math.max(...(data.map(row => row[2])));
    let max = Math.max(maxDomestic, maxWorldwide);

    d3.select(".visualization").selectAll("div").remove();

    let bars = d3.select(".visualization")
      .selectAll("div")
      .data(sortedData)
      .enter()
      .append("div")
      .attr("data-genre", d => d[0])
      .classed("bar-container", true);

    bars.data(sortedData).append("span").text(d => d[0]);
    bars.data(sortedData).append("div")
      .classed("bar-style", true)

    bars.data(sortedData).append("span")
      .classed("bar-value", true)
      .text(d => "$ " + numeral(d[1]).format("0,0"));

    bars.selectAll("div.bar-style").transition()
      .duration(500)
      .style("width", d => (d[1] / maxWorldwide * 1000 + "px"));

    $(".bar-container").on("click", function() {
      let genre = $(this).data("genre");
      let url = "/genreGrossPerMonth/" + encodeURIComponent(genre);
      $.getJSON(url, function( data ) {
        let sortedData = data.sort((a, b) => a[0] > b[0]);
        let maxDomestic = Math.max(...(data.map(row => row[1])));
        let maxWorldwide = Math.max(...(data.map(row => row[2])));
        let max = Math.max(maxDomestic, maxWorldwide);

        d3.select(".visualization").selectAll("div").remove();

        let bars = d3.select(".visualization")
          .selectAll("div")
          .data(sortedData)
          .enter()
          .append("div")
          .classed("bar-container", true);

        bars.data(sortedData).append("span").text(d => months[Number(d[0])]);
        bars.data(sortedData).append("div")
          .classed("bar-style", true)

        bars.data(sortedData).append("span")
          .classed("bar-value", true)
          .text(d => "$ " + numeral(d[1]).format("0,0"));

        bars.selectAll("div.bar-style").transition()
          .duration(500)
          .style("width", d => (d[1] / maxWorldwide * 1000 + "px"));

        $(".bar-container").on("click", function() {
          let genre = $(this).data("genre");
          let url = "/genreGrossPerMonth/" + encodeURIComponent(genre);
          $.getJSON(url, function( data ) {

          });
        });
      });
    });
  });
});
