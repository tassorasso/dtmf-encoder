/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
let co = window.crossOriginIsolated;
if (!co) {
    const n = window.navigator;
    if (n.serviceWorker) {
        n.serviceWorker.register(window.document.currentScript.src).then(
            (r) => console.log("COI: registered", r),
            (e) => console.error("COI: failed", e)
        );
    }
    // Force reload to apply headers
    if (!window.sessionStorage.getItem("coiReloaded")) {
        window.sessionStorage.setItem("coiReloaded", "true");
        window.location.reload();
    }
}

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", function (e) {
    const r = e.request;
    if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;

    e.respondWith(
        fetch(r).then((response) => {
            if (response.status === 0) return response;

            const newHeaders = new Headers(response.headers);
            newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
            newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders,
            });
        })
    );
});