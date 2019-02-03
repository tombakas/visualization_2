import * as drawing from "/static/js/drawing.js"

window.onload = function() {
  let url = "/api/scatter/year-genre/"

  $.getJSON( url, function( data ) {
    $(".loader-wrapper").hide();
    let genres = data["genres"]

    drawing.clear();

    let gWidth = 1250;
    let gHeight = 800;

    let yearRange = data["year_min_max"]

    let y_f = d3.scaleLinear()
      .domain([yearRange[0], yearRange[1]+3])
      .range([gHeight - 40, 40]);

    let x_f = (v) => {return genres.indexOf(v) * ((gWidth - 25) / genres.length) + 85};
    let r_f = d3.scaleLinear()
    .domain([0, data["max"]])
    .range([2, 24]);

    var xAxis = d3.axisLeft(y_f)
      .tickFormat(d3.format("d"))
      .ticks(20);

    let parent = d3.select(".visualization")
      .append("div")

    let svg = parent
      .append("svg")
      .attr("width", gWidth)
      .attr("height", gHeight)

    svg.append("g").selectAll(".circ")
      .data(data["data"])
      .enter()
      .append("circle")
      .attr("class", "scatter-dot")
      .attr("cx", v => x_f(v[1]))
      .attr("cy", v => y_f(Number(v[0])))
      .attr("r", v => r_f(v[2]))
      .append("svg:title")
      .text(d => `Year: ${d[0]}, Count: ${d[2]}`);

    svg.append('g')
      .attr('class', 'x-axis').selectAll("g")
      .data(genres)
      .enter()
      .append("text").text(d => d.split("/")[0])
      .classed("x-text", true)
      .style("font", "px")
      .attr("y", gHeight - 5)
      .attr("x", d => x_f(d) - d.split("/")[0].length * 3.5);

    svg.append('g')
      .attr('class', 'y-axis')
      .attr("transform", "translate(40,0)")
      .call(xAxis);
  });
};
