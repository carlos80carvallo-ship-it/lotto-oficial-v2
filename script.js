// Función para el Reloj en Vivo
function actualizarReloj() {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');
    if(document.getElementById('reloj')) {
        document.getElementById('reloj').textContent = `${horas}:${minutos}:${segundos}`;
    }
}
setInterval(actualizarReloj, 1000);

// Función para ocultar o mostrar botones según la página
window.onload = function() {
    const esAdmin = window.location.pathname.includes('admin');
    const botonesAdmin = document.querySelector('.botones-admin');
    const btnGuardar = document.getElementById('btn-guardar');

    if (!esAdmin) {
        // Si NO es la página admin, ocultamos los controles de edición
        if (botonesAdmin) botonesAdmin.style.display = 'none';
        if (btnGuardar) btnGuardar.style.display = 'none';
        console.log("Vista de cliente activa");
    } else {
        console.log("Vista de administrador activa");
    }
};
