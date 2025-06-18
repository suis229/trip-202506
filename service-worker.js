/* =============================
   Service Worker for trip-202506
   ============================= */

/**
 * 変更したら **CACHE_VERSION** を上げると確実。
 * skipWaiting / clients.claim で即時反映するので
 * 通常は手動で上げなくても自動更新されます。
 */
const CACHE_VERSION = "v1";                 // 必要に応じて v2, v3 …
const CACHE_NAME    = `trip-202506-${CACHE_VERSION}`;

/** precache したいファイルを列挙 */
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",

  /* 画像類（必要に応じて追加） */
  "./icons/東京ビッグサイト.jpg",
  "./icons/東京ビッグサイト_地図.jpg",
  "./icons/東京ビッグサイト_前回.jpg",

  /* 例：PDF を置いている場合
  "./pdf/6-21 横浜_東京_fancy.pdf",
  */

  /* 外部 CDN を除き、GitHub Pages に置いたファイルはここに列挙 */
];

/* ---------- install ---------- */
self.addEventListener("install", event => {
  // 新 SW がインストールされたら即アクティベートさせる
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

/* ---------- activate ---------- */
self.addEventListener("activate", event => {
  // 古いキャッシュを一括削除
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  // すべてのクライアントを即座に新 SW の制御下へ
  self.clients.claim();
});

/* ---------- fetch ---------- */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
