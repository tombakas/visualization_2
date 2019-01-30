import * as drawing from "/static/js/drawing.js";
import { drawBars } from "/static/js/controllers/genreGrossBars.js";

window.onload = function() {
  let url = "/api/genreGrossPerMonth/" + window.location.pathname.split("/").pop();
  $.getJSON( url, function( data ) {
    drawing.clear();
    drawBars(data, 0, 1, 0, 1, true, "separateFilmGrossPerMonth");
  });
}
