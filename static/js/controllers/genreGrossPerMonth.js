import * as drawing from "/static/js/drawing.js";
import { drawBars } from "/static/js/controllers/genreGrossBars.js";

window.onload = function() {
  let u = window.location.pathname.split("/");
  let url = "/api/genreGrossPerMonth/" + u[u.length - 2];
  $.getJSON( url, function( data ) {
    drawing.clear();
    drawBars(data, 0, 1, 0, 1, true, "separateFilmGrossPerMonth");
  });
}
