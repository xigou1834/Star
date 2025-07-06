async function loadComponent(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`${file} 加载失败`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("header", "header.html"),
    loadComponent("footer", "footer.html")
  ]);

  const mainScript = document.createElement("script");
  mainScript.src = "script.js";
  document.body.appendChild(mainScript);
});
