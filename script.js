function moverReloj() {
    const ahora = new Date();
    const tiempo = ahora.toLocaleTimeString();
    if(document.getElementById('reloj')) {
        document.getElementById('reloj').textContent = tiempo;
    }
}
setInterval(moverReloj, 1000);
moverReloj();
