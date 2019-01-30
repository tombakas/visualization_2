import * as drawing from "/static/js/drawing.js";
import { drawBars } from "/static/js/controllers/genreGrossBars.js";

window.onload = function() {
  $.getJSON("/api/grossPerGenre", function( data ) {
    drawing.clear();
    drawBars(data, 0, 1, 1, 1, false, "genreGrossPerMonth");
  });
}
