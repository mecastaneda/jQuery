var playlist;
var promise = $.get('/playlist');
var editTemplate;
var formTarget;
var table;
var rowTemplate;

$(document).ready(function() {
  table = $('#pTable');
  editTemplate = $('#form-template').html();
  Mustache.parse(editTemplate);
  formTarget = $('#form-target');
  rowTemplate = $('#row-template').html();
  Mustache.parse(rowTemplate);

  promise.done(function(data) {
    playlist = data;
    if(!playlist.length) {
      alert('Server is not responding');
      return;
    }
    displayPlaylist(playlist);
  });
});

function displayPlaylist(playlist) {
  for (var i=0, tr; i<playlist.length; i++) {
    playlist[i].num = i;
    tr = Mustache.render(rowTemplate, playlist[i]);
    table.append(tr);
  }
  $('#pTable button').click(edit);
}

function edit(evt) {
  var elmId = $(evt.target).attr('id');
  var form = Mustache.render(editTemplate, playlist[elmId]);
  formTarget.append(form);
  formTarget.addClass('show');
  $('#submit').click({elmId:elmId}, accept);
  $('#cancel').click(close);
}

function close(evt) {
  formTarget.empty();
  formTarget.removeClass('show');
  return false;
}

var urlRe = new RegExp('^https?:\/\/.+\/.+\.(?:jpeg|jpg|gif|bmp|svg|png|ico)$', 'i');
function accept(evt) {
  evt.preventDefault();
  var urlInput = formTarget.find('input[name="image"]');
  var labelInput = formTarget.find('input[name="label"]');
  if(!labelInput.val().trim().length) {
    labelInput.next().addClass('show');
    labelInput.on('input', changed);
    return;
  }
  if(!urlRe.test(urlInput.val())) {
    urlInput.next().addClass('show');
    urlInput.on('input', changed);
    return;
  }
  var track = {};
  $.each(formTarget.find('input'), function(i, elm) {
    track[$(elm).attr('name')] = $(elm).val();
  });
  $.get('/edit/'+playlist[evt.data.elmId].artist_id, {track:track}, function(data) {
    playlist = data;
    table.find('tr').slice(1).remove();
    displayPlaylist(data);
  });
  close();
}

function changed(evt) {
  $(evt.target).next().removeClass('show');
}
