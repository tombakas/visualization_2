import * as drawing from "/static/js/drawing.js";

function run() {

  // Gross Per Genre
  $("#grossPerGenre").on("click", function() {
    $.getJSON("/grossPerGenre", function( data ) {
      drawing.clear();
      drawing.drawBars(data, 1, true);

      $(".bar-container").on("click", function() {
        let genre = $(this).data("genre");
        let url = "/genreGrossPerMonth/" + encodeURIComponent(genre);
        $.getJSON(url, function( data ) {
          drawing.clear();
          drawing.drawCalendarBars(data);
        });
      });
    });
  });
}

export { run };
