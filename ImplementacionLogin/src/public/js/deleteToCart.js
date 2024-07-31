document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.eliminar-producto').forEach(button => {
        button.addEventListener('click', function() {
            const productId = button.getAttribute('data-product-id');
            const cartId = '66761ecee890e7220b428983' // Obtener el ID del carrito
            console.log('Product ID:', productId);
            console.log('Cart ID:', cartId);
            eliminarProductoDelCarrito(cartId, productId);
        });
    });
});

function eliminarProductoDelCarrito(cartId, productId) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "success") {
            alert('Producto Eliminado');
            location.reload(); // Recarga la página para actualizar el carrito
        } else {
            alert('No se pudo eliminar el producto del carrito');
        }
    })
    .catch(error => console.error('Error:', error));
}