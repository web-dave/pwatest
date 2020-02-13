const imgExt = ['jpg', 'png', 'svg'];

const isImage = url => {
  let img = false;
  imgExt.forEach(ext => {
    if (url.includes(ext)) {
      img = true;
    }
  });
  return img;
};

self.addEventListener('fetch', e => {
  console.log(e.request.url);
  // Cache all *.js responds
  if (e.request.url.indexOf('manifest.json') != -1) {
    // Handle manifest.json
    const affe = {
      name: 'pwatest',
      short_name: 'pwatest',
      theme_color: '#1976d2',
      background_color: '#fafafa',
      display: 'standalone',
      scope: '/',
      start_url: '/affe',
      icons: [
        {
          src: 'assets/icons/coffee-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    };
    const manifest = new Response(JSON.stringify(affe), {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(manifest);
    // e.respondWith(
    //   caches.open('MANIFEST-CACHE').then(cache => {
    //     cache.put(e.request.url, manifest.clone());
    //     return manifest.clone();
    //   })
    // );
    console.log('manifest logic goes here!', 'But doesnt WOrk :(');
  } else if (e.request.url.indexOf('.js') != -1) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          return caches.open('JS-CACHE').then(cache => {
            cache.put(e.request.url, response.clone());
            return response.clone();
          });
        })
        .catch(error => {
          return caches.match(e.request).then(response => {
            return response;
          });
        })
    );
  } else if (e.request.url.indexOf('.css') != -1) {
    // Cache all *.css responds
    e.respondWith(
      fetch(e.request)
        .then(response => {
          return caches.open('CSS-CACHE').then(cache => {
            cache.put(e.request.url, response.clone());
            return response.clone();
          });
        })
        .catch(error => {
          return caches.match(e.request).then(response => {
            return response;
          });
        })
    );
  } else if (isImage(e.request.url)) {
    // Cache all *.css responds
    e.respondWith(
      fetch(e.request)
        .then(response => {
          return caches.open('IMG-CACHE').then(cache => {
            cache.put(e.request.url, response.clone());
            return response.clone();
          });
        })
        .catch(error => {
          return caches.match(e.request).then(response => {
            return response;
          });
        })
    );
  } else {
    // Cache all other
    e.respondWith(
      fetch(e.request)
        .then(response => {
          return caches.open('DATA-CACHE').then(cache => {
            cache.put(e.request.url, response.clone());
            return response.clone();
          });
        })
        .catch(error => {
          // In case of Offline we return the cached Data
          return caches.match(e.request).then(response => {
            return response;
          });
        })
    );
  }
});
/*
self.addEventListener('fetch', function(event) {
  var regex = /https:\/\/www.googleapis.com\/youtube\/v3\/playlistItems/;
  if (event.request.url.match(regex)) {
    // Only call event.respondWith() if this looks like a YouTube API request.
    // Because we don't call event.respondWith() for non-YouTube API requests, they will not be
    // handled by the service worker, and the default network behavior will apply.
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (!response.ok) {
          // An HTTP error response code (40x, 50x) won't cause the fetch() promise to reject.
          // We need to explicitly throw an exception to trigger the catch() clause.
          throw Error('response status ' + response.status);
        }

        // If we got back a non-error HTTP response, return it to the page.
        return response;
      }).catch(function(error) {
        console.warn('Constructing a fallback response, ' +
          'due to an error while fetching the real response:', error);

        // For demo purposes, use a pared-down, static YouTube API response as fallback.
        var fallbackResponse = {
          items: [{
            snippet: {title: 'Fallback Title 1'}
          }, {
            snippet: {title: 'Fallback Title 2'}
          }, {
            snippet: {title: 'Fallback Title 3'}
          }]
        };

        // Construct the fallback response via an in-memory variable. In a real application,
        // you might use something like `return fetch(FALLBACK_URL)` instead,
        // to retrieve the fallback response via the network.
        return new Response(JSON.stringify(fallbackResponse), {
          headers: {'Content-Type': 'application/json'}
        });
      })
    );
  }
});*/
