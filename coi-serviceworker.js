let c=window.crossOriginIsolated;
if(!c){
  const n=window.navigator;
  if(n.serviceWorker){
    n.serviceWorker.register(window.document.currentScript.src).then(
      (r)=>console.log("sw reg",r),
      (e)=>console.error("sw err",e)
    );
  }else{
    console.log("no sw");
  }
  if(!window.sessionStorage.getItem("r")){
    window.sessionStorage.setItem("r","1");
    window.location.reload();
  }
}
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",(e)=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",(e)=>{
  const {request:r}=e;
  if(r.cache==="only-if-cached"&&r.mode!=="same-origin")return;
  e.respondWith(
    fetch(r).then((p)=>{
      if(p.status===0)return p;
      const h=new Headers(p.headers);
      h.set("Cross-Origin-Embedder-Policy","require-corp");
      h.set("Cross-Origin-Opener-Policy","same-origin");
      return new Response(p.body,{status:p.status,statusText:p.statusText,headers:h});
    })
  );
});