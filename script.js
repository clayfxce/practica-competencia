/* ---------- elementos ---------- */
const btnTodos = document.getElementById('button-filtro-todos');
const btnCategoria = document.getElementById('button-filtrar-by-categoria');
const btnDificultad = document.getElementById('button-filtrar-by-dificultad');

const spanCategorias = document.querySelector('.span-buttons-categorias');
const spanDificultad = document.querySelector('.span-buttons-dificultad');

const botonesPrincipales = [btnTodos, btnCategoria, btnDificultad];
const botonesCategoria = document.querySelectorAll('.span-buttons-categorias button');
const botonesDificultad = document.querySelectorAll('.span-buttons-dificultad button');

const cards = document.querySelectorAll('.card');

/* qué valor filtra cada botón */
const valorCategoria = {
    'button-filtro-algoritmos': 'Algoritmos',
    'button-filtro-web': 'Web',
    'button-filtro-datos': 'Datos'
};

const valorDificultad = {
    'button-filtro-facil': 'facil',
    'button-filtro-normal': 'normal',
    'button-filtro-dificil': 'dificil'
};

/* ---------- leer datos de cada card ---------- */
function obtenerCategoria(card){
    return card.querySelector('#card-categoria').textContent.trim();
}

function obtenerDificultad(card){
    if (card.querySelector('.card-span-dificultad-facil')) return 'facil';
    if (card.querySelector('.card-span-dificultad-normal')) return 'normal';
    return 'dificil';
}

/* ---------- mostrar / ocultar cards ---------- */
function mostrarCards(criterio){
    cards.forEach(card => {
        const visible = criterio(card);
        card.classList.toggle('oculto', !visible);

        if (visible){
            // reinicia la animación de entrada
            card.classList.remove('entrando');
            void card.offsetWidth;
            card.classList.add('entrando');
        }
    });
}

/* ---------- estado visual de botones ---------- */
function marcarActivo(grupo, boton){
    grupo.forEach(b => b.classList.remove('activo'));
    if (boton) boton.classList.add('activo');
}

function limpiarSecundarios(){
    marcarActivo(botonesCategoria, null);
    marcarActivo(botonesDificultad, null);
}

/* ---------- botones principales ---------- */
btnTodos.addEventListener('click', () => {
    marcarActivo(botonesPrincipales, btnTodos);
    spanCategorias.classList.add('oculto');
    spanDificultad.classList.add('oculto');
    limpiarSecundarios();
    mostrarCards(() => true);
});

btnCategoria.addEventListener('click', () => {
    marcarActivo(botonesPrincipales, btnCategoria);
    spanCategorias.classList.remove('oculto');
    spanDificultad.classList.add('oculto');
    limpiarSecundarios();
    mostrarCards(() => true);
});

btnDificultad.addEventListener('click', () => {
    marcarActivo(botonesPrincipales, btnDificultad);
    spanDificultad.classList.remove('oculto');
    spanCategorias.classList.add('oculto');
    limpiarSecundarios();
    mostrarCards(() => true);
});

/* ---------- botones de categoría ---------- */
botonesCategoria.forEach(boton => {
    boton.addEventListener('click', () => {
        marcarActivo(botonesCategoria, boton);
        const categoria = valorCategoria[boton.id];
        mostrarCards(card => obtenerCategoria(card) === categoria);
    });
});

/* ---------- botones de dificultad ---------- */
botonesDificultad.forEach(boton => {
    boton.addEventListener('click', () => {
        marcarActivo(botonesDificultad, boton);
        const dificultad = valorDificultad[boton.id];
        mostrarCards(card => obtenerDificultad(card) === dificultad);
    });
});

/* ---------- estado inicial ---------- */
spanCategorias.classList.add('oculto');
spanDificultad.classList.add('oculto');
marcarActivo(botonesPrincipales, btnTodos);

/* ---------- contadores del header ---------- */
const textoResueltos = document.getElementById('cantidad-problemas-resueltos');
const textoTotal = document.getElementById('cantidad-problemas-total');
const textoPuntos = document.getElementById('cantidad-puntos-acumulados');

function actualizarContadores(){
    let resueltos = 0;
    let puntos = 0;

    cards.forEach(card => {
        if (card.classList.contains('completada')){
            resueltos++;
            puntos += Number(card.querySelector('#card-puntaje').textContent);
        }
    });

    textoResueltos.textContent = resueltos;
    textoTotal.textContent = cards.length;
    textoPuntos.textContent = puntos;
}

/* ---------- marcar / desmarcar como completada ---------- */
document.querySelector('.cards').addEventListener('click', (e) => {
    const boton = e.target.closest('#card-accion-completado');
    if (!boton) return;

    const card = boton.closest('.card');
    const icono = boton.querySelector('i');

    const ahoraCompletada = card.classList.toggle('completada');

    boton.classList.toggle('desmarcar', ahoraCompletada);
    icono.classList.toggle('fa-check', !ahoraCompletada);
    icono.classList.toggle('fa-xmark', ahoraCompletada);

    actualizarContadores();
});

actualizarContadores();

/* ---------- marcar / desmarcar favorito ---------- */
document.querySelector('.cards').addEventListener('click', (e) => {
    const boton = e.target.closest('#card-accion-favorito');
    if (!boton) return;

    const icono = boton.querySelector('i');
    const marcado = boton.classList.toggle('marcado');

    icono.classList.toggle('fa-solid', marcado);
    icono.classList.toggle('fa-regular', !marcado);
});

function mostrarCards(criterio){
    cards.forEach(card => {
        const visible = criterio(card);
        card.classList.toggle('oculto', !visible);

        if (visible) prepararReveal(card);
    });
}

/* ---------- revelar cards al hacer scroll ---------- */
const observador = new IntersectionObserver((entradas) => {
    let orden = 0;

    entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return;

        const card = entrada.target;
        card.style.animationDelay = (orden * 70) + 'ms';
        orden++;

        card.classList.remove('por-revelar');
        card.classList.add('entrando');

        observador.unobserve(card);
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

function prepararReveal(card){
    card.classList.remove('entrando');
    card.classList.add('por-revelar');
    observador.observe(card);
}

cards.forEach(card => card.classList.add('por-revelar'));

/* ---------- pantalla de carga ---------- */
const DURACION_LOADER = 1000;

const loader = document.getElementById('loader');
const textoLoader = document.getElementById('loader-texto');

document.body.style.overflow = 'hidden';
setTimeout(() => {
    loader.classList.add('terminado');
    document.body.style.overflow = '';

    cards.forEach(prepararReveal);

    setTimeout(() => loader.remove(), 400);
}, DURACION_LOADER);

/* ---------- navegación entre pantallas ---------- */
const opcionesNav = document.querySelectorAll('nav>span');
const pantallas = document.querySelectorAll('.pantalla');
const header = document.querySelector('header');

function irAPantalla(destino){
    pantallas.forEach(pantalla => {
        pantalla.classList.toggle('oculto', pantalla.id !== destino);
    });

    header.classList.toggle('oculto', destino !== 'pantalla-inicio');

    opcionesNav.forEach(o => {
        o.classList.toggle('activo', o.dataset.pantalla === destino);
    });

    window.scrollTo({ top: 0 });
}

opcionesNav.forEach(opcion => {
    opcion.addEventListener('click', () => irAPantalla(opcion.dataset.pantalla));
});

document.querySelector('.usuario').addEventListener('click', () => {
    irAPantalla('pantalla-cuenta');
});