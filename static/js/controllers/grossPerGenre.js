import * as drawing from "/static/js/drawing.js";

window.onload = function() {
  $.getJSON("/api/grossPerGenre", function( data ) {
    drawing.clear();
    drawing.drawBars(data, 1, "genreGrossPerMonth");
  });
}
