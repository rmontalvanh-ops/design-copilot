// ── FORMATO Y DESCARGA ────────────────────────────────────────────────────────
export function convertir(txt, fmt) {
  if(!txt) return "";
  if(fmt==="markdown") return txt;
  if(fmt==="texto") return txt.replace(/```[\s\S]*?```/g,"").replace(/#{1,6} /g,"").replace(/\*\*/g,"").replace(/\*/g,"").replace(/`/g,"").replace(/[═─]/g,"-").replace(/\n{3,}/g,"\n\n").trim();
  if(fmt==="html"){
    let h=txt.replace(/```[\s\S]*?```/g,m=>`<pre><code>${m.replace(/```\w*/g,"").trim()}</code></pre>`).replace(/^### (.+)$/gm,"<h3>$1</h3>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^# (.+)$/gm,"<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/^[-·•] (.+)$/gm,"<li>$1</li>").replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br/>");
    return `<div style="font-family:Arial,sans-serif;line-height:1.6;padding:12px"><p>${h}</p></div>`;
  }
  return txt;
}
export function descargarMd(contenido, nombre) {
  const blob=new Blob([contenido],{type:"text/markdown;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=nombre;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}
// Helper único de portapapeles con fallback execCommand (sandbox / navegadores sin Clipboard API)
export function copiarTexto(txt, onOk) {
  if(!txt) return;
  const fallback=()=>{const ta=document.createElement("textarea");ta.value=txt;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");onOk&&onOk();}catch{}document.body.removeChild(ta);};
  if(navigator.clipboard){navigator.clipboard.writeText(txt).then(()=>onOk&&onOk()).catch(fallback);}else fallback();
}

