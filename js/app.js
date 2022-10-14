const contadorCarrito = document.getElementById('contadorCarrito')
const contenedorCarrito = document.getElementById('lista-carrito')
const contenedorProductos = document.getElementById('contenedor-productos')
const botonLimpiar = document.getElementById('limpiar-carrito')
const botonComprar = document.getElementById('pagar-carrito')

let carrito = []
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        if (carrito[0] === 'ID-3452') {
            actualizarCarrito()
        } else {
            carrito = []
        }
    }
})

const agregarCarrito = (productoId) => {
    if (carrito.length == 0) {
        //le asigno un valor al carrito
        carrito.push('ID-3452')
    }
    fetch("./data.json")
        .then((resp) => resp.json())
        .then((productos) => {
            const existe = carrito.some(producto => producto.id === productoId)
            if (existe) {
                const producto = carrito.map(producto => {
                    if (producto.id === productoId) {
                        producto.stock++
                        return producto
                    }
                })
            } else {
                const item = productos.find((producto) => producto.id === productoId)
                carrito.push(item)
            }
            actualizarCarrito()
        }
        )
}

//MOSTRAR PRODUCTOS
const productos = document.querySelector("#contenedor-productos")
fetch("./data.json")
    .then((resp) => resp.json())
    .then((productos) => {
        productos.forEach((producto) => {
            let card = document.createElement("div")
            card.classList.add("card", "col-sm-12", "col-lg-3")
            card.innerHTML = `<img src = ${producto.imagen}  class=" card-img" alt=''>
        <div class="card-body">
        <h5 class = "card-title"> ${producto.nombre}</h5>
        <p class="card-text">$${producto.precio}</p>
        <p class="card-text">${producto.marca}</p>
        <button id="agregar ${producto.id}" class= "btn btn-info boton-agregar"> Agregar al carrito</button>
        <br>
        </div>`
            contenedorProductos.appendChild(card)
            const boton = document.getElementById(`agregar ${producto.id}`)
            boton.addEventListener('click', () => {
                agregarCarrito(producto.id)
            })
            boton.addEventListener('click', () => {
                Toastify({
                    text: ('Producto agregado al carrito'),
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right , #ff89b4, #ff3d83    )",
                    }
                }).showToast();
            })
        })
    })


//limpiar contenido carrito
botonLimpiar.addEventListener('click', () => {
    vaciarCarrito()
})
function vaciarCarrito() {
    if (carrito.length > 1) {
        Swal.fire({
            title: "¿Quiere vaciar su carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f15c8e",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Confirmar",
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.length = 0
                actualizarCarrito()
                contadorCarrito.innerText = 0
                localStorage.clear()
                carrito.length === 0 && Toastify({

                    text: ('Has vaciado tu carrito'),
                    duration: 3000,
                    style: {
                        background: "linear-gradient(to right, #ff89b4  , #ff89b4  )",
                    }
                }).showToast();
            }
        })
    } else {
        Toastify({
            text: ('No tienes productos en el carrito'),
            duration: 3000,

        }).showToast();
    }
}

botonComprar.addEventListener('click', () => {
    comprarProducto()
})


function comprarProducto() {
    if (carrito.length >= 1) {
        Swal.fire({
            title: "¿Desea realizar compra?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#f15c8e",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Confirmar",

        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Seleccione método de pago',
                    text: (`La cantidad a pagar es de: $${precioTotal.innerHTML} `),
                    width: '800px',
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    cancelButtonColor: "#d33",
                    input: 'radio',
                    inputOptions: {
                        '#ff0000': 'Tarjeta débito/crédito',
                        '#00ff00': 'Pago en efectivo',

                    },
                    inputValidator: function (result) {
                        if (!result) {
                            return 'Seleccione una forma de pago';
                        }
                    }
                }).then(function (result) {
                    if (result.isConfirmed) {
                        carrito.length = 0
                        actualizarCarrito()
                        contadorCarrito.innerText = 0
                        localStorage.clear()
                        carrito.length === 0 && Toastify({
                            text: ('Has realizado tu pago. Gracias por su compra'),
                            duration: 3000,
                            style: {
                                background: "linear-gradient(to right, #ff89b4  , #ff89b4  )",
                            }
                        }).showToast();
                    }
                })

            }
        })
    } else {
        Toastify({
            text: ('No tienes productos en el carrito'),
            duration: 3000,

        }).showToast();
    }
}



//eliminar productos carrito
function eliminarProducto(productoId) {
    const item = carrito.find((producto) => producto.id === productoId)
    Swal.fire({
        title: `¿Quiere eliminar el producto ${item.nombre} del carrito?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f15c8e",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarDelCarrito(productoId)
        }
    });
}
const eliminarDelCarrito = (productoId) => {
    const item = carrito.find((producto) => producto.id === productoId)
    const indice = carrito.indexOf(item)
    carrito.splice(indice, 1)
    localStorage.removeItem("carrito");
    // cambiar contador cuando carrito llegue a 0
    if (carrito.length === 1) {
        contadorCarrito.innerHTML = 0
    }
    Toastify({
        text: (`Producto: ${item.nombre} eliminado del carrito`),
        duration: 3000,
    }).showToast();
    actualizarCarrito()

}


//actualizar productos carrito
const actualizarCarrito = () => {
    //reseteo carrito
    contenedorCarrito.innerHTML = ""
    carrito.slice(1).forEach((producto) => {
        const row = document.createElement('tr')
        row.innerHTML = `
        <img src=${producto.imagen} width="150" height=150";>
        <td> ${producto.nombre}</td>
        <td> ${producto.marca}</td>
        <td> Precio unitario: $${producto.precio}</td>
        <td>Cantidad:${producto.stock}</td>
        <td> Subtotal: $${producto.precio * producto.stock}</td>
        <button onclick="eliminarProducto(${producto.id})" id="borrarProducto" class="boton-eliminar btn btn-danger"><i class="glyphicon glyphicon-trash"></i></button>
        `
        contadorCarrito.innerText = `${calcularContador()}  `
        contenedorCarrito.appendChild(row)
        localStorage.setItem('carrito', JSON.stringify(carrito))
    })



    //contar productos en carrito
    function calcularContador() {
        let contador = 0
        carrito.slice(1).forEach((producto) => {
            contador += producto.stock
        })
        return contador
    }

    //calculo total 
    precioTotal.innerText = carrito.slice(1).reduce((acc, producto) => acc + producto.stock * producto.precio, 0)
}

//FORMULARIO
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form').addEventListener('submit', formControl)
})

let formData

function formControl(event) {
    event.preventDefault()

    let formulario = event.target

    formData = new FormData(formulario)

    function validateForm() {
        if (formData.get('nombre').trim() == "" || formData.get('email').trim() == "") {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: ('Debes ingresar tu nombre y tu email !'),
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: (`Gracias por registrarte ${formData.get('nombre')} !`),
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
    validateForm()
}
