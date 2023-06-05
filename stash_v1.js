async function searchDb(filter = {}, skip = null, limit = null) {
  const url = "https://ap-south-1.aws.data.mongodb-api.com/app/data-jktzb/endpoint/data/v1/action/find";
  const payload = JSON.stringify({
    collection: "stash",
    database: "api",
    dataSource: "Cluster0",
    filter: filter,
    sort: { "Id": -1 },
    limit: limit,
    skip: skip
  });
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': 'oEMu1rIsWSQgMm20dBo9av7uQ1FxIvtNgvR61QwjmcmqEuxAOyIGGl0VwS4QftiA'
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: payload
  });
  const json = await response.json();
  return json.documents;
}
async function player(Id) {
  const url = "https://ap-south-1.aws.data.mongodb-api.com/app/data-jktzb/endpoint/data/v1/action/findOne";
  const payload = JSON.stringify({
    collection: "stash",
    database: "api",
    dataSource: "Cluster0",
    filter: {
      "Id": parseInt(Id)
    }
  });
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': 'oEMu1rIsWSQgMm20dBo9av7uQ1FxIvtNgvR61QwjmcmqEuxAOyIGGl0VwS4QftiA'
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: payload
  });
  const json = await response.json();
  return json.document;
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (pathname === '/') {
    const page = parseInt(url.searchParams.get('page')) || 1;
    const per_page = parseInt(url.searchParams.get('per_page')) || 40;
    const search_term = url.searchParams.get('search') || '';
    const pattern = '.*' + search_term.trim().split(" ").join('.*') + '.*';
    const query = { "$and": [{ "title": { "$regex": pattern, "$options": "i" } }] } || {};
    const skip = (page - 1) * per_page;
    const data = await searchDb(query, skip, per_page);
    const perv = page === 1 ? null : page - 1;
    const next = data.length !== 40 ? null : page + 1;
    const htmlResponse = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
        <title>MoviexDude</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="https://cdn.jsdelivr.net/gh/moviezmain/asper@main/showdata.js"></script>
        <style>
          .list-group-item:hover {
            cursor: pointer;
            background-color: #f8f9fa;
          }
        </style>
</head>
<body>
<nav class="navbar navbar-dark bg-primary">
          <div class="container">
            <a class="navbar-brand" href="/">MoviezDude</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarContent">
              <form class="form-inline my-2 my-lg-0 ml-auto" action="/" method="GET">
                <input type="text" class="form-control" name="search" value="${search_term || ''}" placeholder="Search...">
                <button class="btn btn-success my-2 my-sm-0" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
  <div class="container" style="margin-bottom:5px;">
  <div class="mt-1">
    <ul id="playlist" class="list-group">
      ${data.map(item => `
        <ul class="list-group">
        <li class="list-group-item" onclick="showData('${item.Id}',' ${item.title}')">
        ${item.title}
      </li>
      `).join('')}
  </ul>
</div>
</div>
<div class="modal fade" id="dataModal" tabindex="-1" role="dialog" aria-labelledby="dataModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <p class="modal-title" id="dataModalLabel"></p>
        </div>
        <div class="modal-body">
          <div id="itemData"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
<nav aria-label="..." style="margin-bottom:15px">
  <ul class="pagination justify-content-center">
    ${perv !== null ? `
    <li class="page-item">
      <a class="page-link" href="?page=${perv}&per_page=${url.searchParams.get('per_page') || 40}&search=${url.searchParams.get('search') || ''}">Pervious</a>
    </li>
    ` : ''}
    ${next !== null ? `
    <li class="page-item">
      <a class="page-link" href="?page=${next}&per_page=${url.searchParams.get('per_page') || 40}&search=${url.searchParams.get('search') || ''}">Next</a>
    </li>
    ` : ''}
  </ul>
</nav>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
`;
    const response = new Response(htmlResponse, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    return response;
  }
  if (pathname.startsWith('/play/')) {
    const id = pathname.substring('/play/'.length);
    const next = parseInt(id) + 1
    const prev = parseInt(id) - 1
    const data = await player(id)
    const htmlResponse = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
            <title>MoviexDude</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    </head>
    <body>
    <nav class="navbar navbar-dark bg-primary">
              <div class="container">
                <a class="navbar-brand" href="/">MoviezDude</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarContent">
                  <form class="form-inline my-2 my-lg-0 ml-auto" action="/" method="GET">
                    <input type="text" class="form-control" name="search" value="" placeholder="Search...">
                    <button class="btn btn-success my-2 my-sm-0" type="submit">Search</button>
                  </form>
                </div>
              </div>
            </nav>
    
    <div><h5 style="text-align: center;margin-top:8px;margin-bottom:8px" class="text-l font-bold ">${data.title}</h5></div>
    <div class="container mx-auto">
      <div id="dplayer-container"></div>
      <div class="flex flex-wrap justify-center mt-4">
        <a role="button" class="btn btn-outline-success" href="https://url.moviezdude.site/1001907601370/${data.Id}" style="margin-left:5px; margin-bottom:10px;">Download</i></a>
        <a role="button" class="btn btn-outline-danger" href="vlc://https://url.moviezdude.site/1001907601370/${data.Id}" style="margin-left:5px; margin-bottom:10px;">Play in VLC</i></a>
        <a role="button" class="btn btn-outline-warning" href= "infuse://x-callback-url/play?x-success=some-app://x-callback-url/playbackDidFinish&x-error=some-app://x-callback-url/playbackDidFail&url=https://url.moviezdude.site/1001907601370/${data.Id}" style="margin-left:5px; margin-bottom:10px;">Play in Infuse</i></i></a>
        <a role="button" class="btn btn-outline-primary" href="/play/${prev}" style="margin-left:5px; margin-bottom:10px;">Previous</i></a>
        <a role="button" class="btn btn-outline-primary" href="/play/${next}" style="margin-left:5px; margin-bottom:10px;">Next</i></a>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <script>
      const dp = new DPlayer({
        container: document.getElementById('dplayer-container'),
        preload: 'auto',
        theme: '#FADFA3',
        video: {
          url: 'https://url.moviezdude.site/1001907601370/${data.Id}',
          type: 'auto',
        },
      });
    </script>
  </body>
  </html>`
    const response = new Response(htmlResponse, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
    return response;
  }
}

