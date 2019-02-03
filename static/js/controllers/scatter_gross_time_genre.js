window.onload = function() {
  let url = "/api" + window.location.pathname;

  $.getJSON( url, function( data ) {

    let maxYear = d3.max(data, d => d[0]);
    let minYear = d3.min(data, d => d[0]);
    let maxGross = d3.max(data, d => d[2])
    let minGross = d3.min(data, d => d[2])

    let gWidth = 1450;
    let gHeight = 800;

    let y_f = d3.scaleLinear()
      .domain([minGross, maxGross])
      .range([gHeight - 40, 40]);

    let x_f = d3.scaleTime()
      .domain([
        new Date(Date.parse(minYear)),
        new Date(Date.parse(maxYear))
      ])
      .range([80, gWidth - 50]);

    let r_f = d3.scaleLinear()
    .domain([0, maxGross])
    .range([2, 30]);

    let parent = d3.select(".visualization")
      .append("div")

    let svg = parent
      .append("svg")
      .attr("width", gWidth)
      .attr("height", gHeight)

    svg.append("g").selectAll(".circ")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", d => "scatter-dot " + d[1].split("/")[0].toLowerCase())
      .attr("cx", v => x_f(new Date(Date.parse(v[0]))))
      .attr("cy", v => y_f(v[2]))
      .attr("r", v => r_f(v[2]))
      .append("svg:title")
      .text(d => `Year: ${d[0]}, Gross: $${d[2]}, Title: "${d[3]}"`);

    let xAxis = d3.axisBottom(x_f)
      .ticks(20);

    let yAxis = d3.axisLeft(y_f)
      .tickFormat(d3.format("d"))
      .ticks(20);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr("transform", `translate(0, ${gHeight - 30})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y-axis')
      .attr("transform", "translate(70,0)")
      .call(yAxis);

    d3.selectAll(".legend .genre")
      .on("mouseover", function(o) {
        let genre = this.className.split(" ")[1];
        console.log(genre);

        d3.selectAll(".scatter-dot")
          .style('opacity', '0');

        d3.selectAll(`.scatter-dot.${genre}`)
          .style('opacity', '0.3');
      })
      .on("mouseout", function() {
        d3.selectAll(".scatter-dot")
          .style('opacity', '0.3');
      })
    ;
  });
};
