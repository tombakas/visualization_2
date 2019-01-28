import * as drawing from "/static/js/drawing.js";

window.onload = function() {
  let url = "/api/separateFilmGrossPerMonth/" + window.location.pathname.split("/").pop();

  $.getJSON( url, function( data ) {
    console.log(data);

    drawing.clear();
    drawing.drawNarrowBars(data, 3);
  });
}
