/*
Recordatorio actividad:

Objetivo: Implementar eventos (click, input/change, submit) para modificar cantidades,
recalcular importes por línea y totales del carrito. Se trabajará con delegación de eventos
y el parámetro "evt" de addEventListener.

Requisitos mínimos:
1) Botones +/− por línea para incrementar/decrementar cantidad.
2) Campo numérico editable por línea (input type="number").
3) Recalcular importes y totales (subtotal, IVA 21%, total) en cada interacción.
4) Botón eliminar por línea.
5) Delegación de eventos en el <tbody> del carrito (un solo manejador para múltiples
botones/inputs).
6) Campo de “código descuento” (por ejemplo, DESCUENTO10 aplica 10%).
7) Inicialización con DOMContentLoaded.

*/

/*
JSDOC INFO
*/

/**
 * @typedef {Object} Producto
 * @property {number} id
 * @property {string} nombre
 * @property {number} precio
 */

/**
 * @typedef {Object} LineaCarrito
 * @property {number} id
 * @property {HTMLInputElement} inputCantidad
 * @property {HTMLElement} precioElemento
 * @property {HTMLElement} importeElemento
 */


/*
Listado de variables globales
*/

/**
 * Factor de descuento
 * 1 = sin descuento
 * 0.90 = 10% descuento
 * @type {number}
 */

let descuento = 1;   // 1 = sin descuento, 0.90 = 10%

/*
Listado de referencias que apuntan al DOM */

/**
 * Contenedor de las filas del carrito
 * @type {HTMLTableSectionElement}
 */
const inputCantidad1 = document.getElementById("cantidad1");
const inputCantidad2 = document.getElementById("cantidad2");
const inputCantidad3 = document.getElementById("cantidad3");

const precio1Elemento = document.getElementById("precio1");
const precio2Elemento = document.getElementById("precio2");
const precio3Elemento = document.getElementById("precio3");

const importe1Elemento = document.getElementById("importe1");
const importe2Elemento = document.getElementById("importe2");
const importe3Elemento = document.getElementById("importe3");

const subtotalElemento = document.getElementById("subtotal");
const ivaElemento = document.getElementById("iva");
const descuentoElemento = document.getElementById("descuento");
const totalElemento = document.getElementById("total");

const tbody = document.getElementById("cart-body");


/**
 * Formulario de descuento
 * @type {HTMLFormElement}
 */
const formDescuento = document.getElementById("dto-form");

/**
 * Input donde se escribe el codigo de descuento
 * @type {HTMLInputElement}
 */
const inputDescuento = document.getElementById("dto");

/*
Funcion para recalcular el carrito, la llamaremos tanto al cargar la web
como ante la mayoria de eventos detectados*/

/**
 * Recalcula todos los importes del carrito:
 * - importes por linea
 * - subtotal
 * - IVA (21%)
 * - total aplicando descuento
 */
function recalcularCarrito() {

  // Precios (texto a Float, para numeros decimales)
  const precio1 = parseFloat(precio1Elemento.textContent);
  const precio2 = parseFloat(precio2Elemento.textContent);
  const precio3 = parseFloat(precio3Elemento.textContent);

  // Cantidades (texto a Int, para numeros entero, luego entero * decimal = decimal)
  const cantidad1 = parseInt(inputCantidad1.value);
  const cantidad2 = parseInt(inputCantidad2.value);
  const cantidad3 = parseInt(inputCantidad3.value);
  

  // Calcular importes
  const importe1 = precio1 * cantidad1;
  const importe2 = precio2 * cantidad2;
  const importe3 = precio3 * cantidad3;

  const subtotal = importe1+importe2+importe3;
  const IVA = subtotal*0.21;
  const TOTAL = subtotal+IVA;
  const DTO = TOTAL *(1-descuento);
  const TOTALconDTO = TOTAL*descuento;

  // Ponerlos en el DOM
  importe1Elemento.textContent = importe1.toFixed(2);
  importe2Elemento.textContent = importe2.toFixed(2);
  importe3Elemento.textContent = importe3.toFixed(2);
  subtotalElemento.textContent = subtotal.toFixed(2);
  ivaElemento.textContent = IVA.toFixed(2);
  descuentoElemento.textContent = DTO.toFixed(2);
  totalElemento.textContent = TOTALconDTO.toFixed(2);
}

/*
Usamos el DOMContentLoaded para que el carrito inicie bien,
tengamos en cuenta que los valores por defecto de los 3 colchones son una cantidad de 1 en
cada uno. Si no hicieramos este evento de carga de DOM el carrito iniciaria con los valores de
la columna de importes a 0.00 */

document.addEventListener("DOMContentLoaded", () => {
  recalcularCarrito();
});

/*
Una vez asimilado todos los conceptos de escucha de eventos uno a uno, ahora
vamos a hacer lo mismo, pero usando una Delegacion de eventos, de esta manera,
en vez de escuchar cada evento de "click" de manera indiviual en cada boton, lo
que haremos es "Escuchar todos los clicks que ocurran dentro de la tabla del carrito"

Si lo comparamos con la version sin delegacion, antes haciamos 9 escuchas, con sus 9 codigos,
de esta forma lo que hacemos es una escucha general, y luego deducimos a cual de los 9 posibles
botones se ha hecho el click*/

/**
 * Gestiona todos los clicks del carrito:
 * botones +, − y eliminar
 * usando delegacion de eventos
 * @param {MouseEvent} evt
 */
tbody.addEventListener("click", (evt) => {

  //constante donde guardamos quien hizo recibio el "click"
  const boton = evt.target;

  /* En la constante fila vamos a buscar que elemento va ligado a ese boton "clickado"
   closest("tr") sube por el HTML hasta encontrar el <tr> mas cercano. */
  const fila = boton.closest("tr");

  /* Estamos "escuchando" TODOS los clicks, tenemos que ingorar los click que no vayan dirigido a 
  botones, por ejemplo un click a cualquier zona de texto. Con "si fila no existe entonces return" 
  salimos de la Delegacion sin hacer nada*/
  if (!fila) return;

  //sacamos la id de la fila apuntada, para diferenciar a que colchon apunta ese boton (cantidad1 2 o 3, que al final es lo que sube o baja con los clicks)
  const id = fila.dataset.id;
  const input = document.getElementById("cantidad" + id);//cantidad1 por ejemplo

  /* Ahora ponemos todos los candidatos a recibir click */

  //Boton +
  if (boton.id === "btn-mas-" + id) {
    input.value = parseInt(input.value) + 1;
    recalcularCarrito();
  }

  // Boton -
  if (boton.id === "btn-menos-" + id) {
    if (parseInt(input.value) > 0) {
      input.value = parseInt(input.value) - 1;
      recalcularCarrito();
    }
  }

  // Boton eliminar
  if (boton.id === "btn-eliminar" + id) {
    input.value = 0;
    recalcularCarrito();
  }
});

/* Escuchamos la entrada manual de cantidades */

tbody.addEventListener("input", (evt) => {
  const input = evt.target;

  // solo nos interesa si es un input de cantidad
  if (!input.id.startsWith("cantidad")) return;

  // evitar valores vacios o negativos
  if (input.value === "" || parseInt(input.value) < 0) {
    input.value = 0;
  }

  recalcularCarrito();
});

/* Formulario Codigo descuento*/

/**
 * Gestiona el envio del formulario de descuento
 * @param {SubmitEvent} evt
 */
formDescuento.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const codigo = inputDescuento.value.trim().toUpperCase();

  if (codigo === "DESCUENTO10") {
    descuento = 0.90;
    console.log("Descuento 10% aplicado");
  } else {
    descuento = 1;
    console.log("Codigo no valido");
  }

  recalcularCarrito();
});
