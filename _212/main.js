$(document).ready(function() {
  var sections = $('.main > section');
  var navBtns = $('nav > a')

  navBtns.click(function(evt) {
    navBtns.css('color', '#FFF');
    sections.css('display', 'none');
    $(evt.target).css('color', '#333');
    $(''+$(evt.target).attr('href')).css('display', 'block');
  });
});
