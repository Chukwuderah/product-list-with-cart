document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll("button[type='button']");
  const cartContainer = document.querySelector("aside div");
  const cartTitle = document.querySelector("aside h3");
  const cartTotalElement = document.querySelector(".cart-total");
  const totalPriceElement = cartTotalElement.querySelector(".total-price");

  let cartItems = {}; // Store items in the cart

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productElement = button.closest("div").nextElementSibling;
      const productName = productElement.querySelector(".name").textContent;
      const productDescription = productElement.querySelector("p").textContent;
      const productPrice = parseFloat(
        productElement.querySelector(".price").textContent.replace("$", "")
      );

      // Hide the Add to Cart button and show the quantity controls
      button.style.display = "none";
      const quantityControls = button
        .closest(".img-btn")
        .querySelector(".quantity-controls");
      quantityControls.style.display = "flex";

      // Initialize or update cart item
      if (!cartItems[productName]) {
        cartItems[productName] = {
          name: productName,
          description: productDescription,
          price: productPrice,
          quantity: 1,
        };
        addToCart(productName);
      } else {
        cartItems[productName].quantity += 1;
        updateCart(productName);
      }

      updateCartTotal();
      updateCartCount();

      // Remove empty cart message
      cartContainer.innerHTML = "";
      cartTotalElement.style.display = "block";

      // Handle Increment and Decrement
      const incrementButton = quantityControls.querySelector(".increment");
      const decrementButton = quantityControls.querySelector(".decrement");
      const quantityDisplay = quantityControls.querySelector(".quantity");

      incrementButton.addEventListener("click", function () {
        cartItems[productName].quantity += 1;
        quantityDisplay.textContent = cartItems[productName].quantity;
        updateCart(productName);
        updateCartTotal();
        updateCartCount();
      });

      decrementButton.addEventListener("click", function () {
        if (cartItems[productName].quantity > 1) {
          cartItems[productName].quantity -= 1;
          quantityDisplay.textContent = cartItems[productName].quantity;
          updateCart(productName);
        } else {
          delete cartItems[productName];
          quantityControls.style.display = "none";
          button.style.display = "flex";
          removeFromCart(productName);
        }
        updateCartTotal();
        updateCartCount();
      });
    });
  });

  function addToCart(productName) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.setAttribute("data-product-name", productName);
    cartItem.innerHTML = `
        <div class="cart-item-content">
          <p><strong>${cartItems[productName].name}</strong></p>
          <p>${cartItems[productName].quantity}x @$${cartItems[
      productName
    ].price.toFixed(2)} $${(
      cartItems[productName].price * cartItems[productName].quantity
    ).toFixed(2)}</p>
        </div>
        <img src="./Icons/icon-remove-item.jpg" class="cart-item-remove" alt="Remove item">
      `;
    cartContainer.appendChild(cartItem);

    // Handle removal
    const removeButton = cartItem.querySelector(".cart-item-remove");
    removeButton.addEventListener("click", function () {
      delete cartItems[productName];
      cartItem.remove();
      updateCartTotal();
      updateCartCount();

      if (Object.keys(cartItems).length === 0) {
        cartContainer.innerHTML = `
            <img src="./Icons/illustration-empty-cart.jpg" alt="illustration-empty-cart" />
            <p>Your added items will appear here</p>
          `;
        cartTotalElement.style.display = "none";
      }
    });

    updateCartCount();
  }

  function updateCart(productName) {
    const cartItem = cartContainer.querySelector(
      `div[data-product-name="${productName}"]`
    );
    cartItem.querySelector(
      "p.item-price"
    ).textContent = `${cartItems[productName].price} x ${cartItems[productName].quantity}`;
    cartItem.querySelector("strong").textContent = `${
      cartItems[productName].name
    } - $${(
      cartItems[productName].price * cartItems[productName].quantity
    ).toFixed(2)}`;
  }

  function removeFromCart(productName) {
    const cartItem = cartContainer.querySelector(
      `div[data-product-name="${productName}"]`
    );
    if (cartItem) {
      cartItem.remove();
    }

    // if (Object.keys(cartItems).length === 0) {
    //   cartContainer.innerHTML = `
    //       <img src="./Icons/illustration-empty-cart.jpg" alt="illustration-empty-cart" />
    //       <p>Your added items will appear here</p>
    //     `;
    //   cartTotalElement.style.display = "none";
    // }

    // updateCartCount();
    // updateCartTotal();
  }

  function updateCartCount() {
    const itemCount = Object.keys(cartItems).reduce(
      (sum, itemName) => sum + cartItems[itemName].quantity,
      0
    );
    cartTitle.textContent = `Your Cart(${itemCount})`;
  }

  function updateCartTotal() {
    const total = Object.keys(cartItems).reduce(
      (sum, itemName) =>
        sum + cartItems[itemName].price * cartItems[itemName].quantity,
      0
    );
    totalPriceElement.textContent = total.toFixed(2);
  }
});
