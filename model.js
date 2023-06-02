function showData(item, title) {
      // Set the title of the modal
      document.getElementById('dataModalLabel').innerText = title;

      // Set the clicked item's data in the modal
      document.getElementById('itemData').innerHTML = '<a role="button" class="btn btn-outline-primary" href="/play/'+item+'">Play</a><a role="button" class="btn btn-outline-success" href="https://url.moviezdude.site/1001907601370/'+item+'" style="margin-left:5px;">Download</a><a role="button" class="btn btn-outline-danger" href="vlc://https://url.moviezdude.site/1001907601370/'+item+'" style="margin-left:5px;">VLC</a><a role="button" class="btn btn-outline-warning" href= "infuse://x-callback-url/play?x-success=some-app://x-callback-url/playbackDidFinish&x-error=some-app://x-callback-url/playbackDidFail&url=https://url.moviezdude.site/1001907601370/'+item+'" style="margin-left:5px; ">Infuse</a>';

      $('#dataModal').modal('show');
    }
