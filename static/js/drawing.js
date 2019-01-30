function getMax(data, ...columns) {
  let maxes = [];
  columns.forEach(function(column) {
    maxes.push(Math.max(...(data.map(row => row[column]))));
  })

  return Math.max(maxes);
}

function clear() {
  d3.select(".visualization").selectAll("div").remove();
}

export {clear, getMax};
