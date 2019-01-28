import * as drawing from "/static/js/drawing.js";

window.onload = function() {
  $.getJSON("/api/grossPerGenre", function( data ) {
    drawing.clear();
    drawing.drawBars(data, 1, true);

    // Gross Per Genre Per Month
    $(".bar-container").on("click", function() {
      let genre = $(this).data("genre");
      let url = "/api/genreGrossPerMonth/" + encodeURIComponent(genre);
      $.getJSON(url, function( data ) {
        drawing.clear();
        drawing.drawCalendarBars(data);
      });
    });
  });
}
