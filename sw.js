const cacheName = 'Puppy Care'

self.addEventListener('install', function(event){
    event.waitUntil(
        caches.open(cacheName).then(function (cache){
            cache.addAll([
                './',
                './adicionarPet.html',
                './adicionarpet.css',
                './Bluetooth.html',
                './bluetooth.css',
                './Cadastro.html',
                './cadastro.css',
                './home.html',
                './home.css',
                './inicio.html',
                './inicio.css',
                './Login.html',
                './login.css',
                './tutorial.final.html',
                './tutorialfinal.css',
                './tutorial1.html',
                './tutorial1.css',
                './tutorial2.html',
                './tutorial2.css',
                './tutorial3.html',
                './tutorial3.css',
                './manifest.json',
                './Login.html',
                './Login.js',
            ])
        })
    )
    return self.skipWaiting()
})

self.addEventListener('activate', e =>{
    self.clients.claim()
})

self.addEventListener('fetch', async e =>{
    const req = e.request
    const url = new URL(req.url)

    if(url.origin === location.origin){
        e.respondWith(cacheFirst(req))
    } else{
        e.respondWith(networkAndCache(req))
    }
})

async function cacheFirst(req){
    const cache = await caches.open(cacheName)
    const cached = await cache.match(req)

    return cached || fetch(req)
}

async function networkAndCache(req){
    const cache = await caches.open(cacheName);
    try{
        const refresh = await fetch(req)
        await cache.put(req, fresh.clone())
        return refresh
    } catch(e){
        const cached = await cache.match(req);
        return cached
    }
}