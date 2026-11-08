/**
 * pwa.js — registra o service worker (modo offline) e mostra o botão "Instalar o jogo".
 * Usado pelas duas páginas (index.html e tutorial.html).
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(erro =>
      console.warn('Modo offline indisponível:', erro)
    );
  });
}

// Android/Chrome: o navegador avisa quando o jogo pode ser instalado
const botao = document.querySelector('#instalar');
let pedido = null;

window.addEventListener('beforeinstallprompt', evento => {
  evento.preventDefault();       // guarda o pedido para usar no nosso botão
  pedido = evento;
  if (botao) botao.hidden = false;
});

botao?.addEventListener('click', async () => {
  if (!pedido) return;
  pedido.prompt();
  await pedido.userChoice;
  pedido = null;
  botao.hidden = true;
});

window.addEventListener('appinstalled', () => {
  if (botao) botao.hidden = true;
});
