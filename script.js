document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll("button[type='button']");
  const cartContainer = document.querySelector(".cart-items");
  const cartTitle = document.querySelector("aside h3");
  const cartTotalElement = document.querySelector(".cart-total");
  const totalPriceElement = cartTotalElement.querySelector(".total-price");
  const confirmOrderButton = document.querySelector(".confirm-order");
  const orderConfirmation = document.querySelector(".order-confirmation");
  const orderSummary = document.querySelector(".order-summary");
  const startNewOrderButton = document.querySelector(".start-new-order");

  let cartItems = {}; // Store items in the cart

  function updateCartCount() {
    // Calculate the total number of items in the cart
    const itemCount = Object.keys(cartItems).reduce(
      (sum, itemName) => sum + cartItems[itemName].quantity,
      0
    );
    // Update the cart title to display the count
    cartTitle.textContent = `Your Cart(${itemCount})`;
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productElement = button.closest("div").nextElementSibling;
      const productName = productElement.querySelector(".name").textContent;
      const productDescription = productElement.querySelector(
        ".product-description"
      ).textContent;
      const productPrice = parseFloat(
        productElement.querySelector(".price").textContent.replace("$", "")
      );
      const productImage = button
        .closest("div.img-btn")
        .querySelector("img").src;

      // Hide the Add to Cart button and show the quantity controls
      button.style.display = "none";
      const quantityControls = button.nextElementSibling;
      quantityControls.style.display = "flex";

      // Initialize or update cart item
      if (!cartItems[productName]) {
        cartItems[productName] = {
          name: productName,
          description: productDescription,
          price: productPrice,
          quantity: 1,
          image: productImage,
        };
        addToCart(productName);
      } else {
        cartItems[productName].quantity += 1;
        updateCart(productName);
      }

      updateCartTotal();
      updateCartCount();

      // Remove empty cart message
      const imgElement = cartContainer.querySelector("img");
      const pElement = cartContainer.querySelector("p");

      if (imgElement) {
        imgElement.remove();
      }

      if (pElement) {
        pElement.remove();
      }

      cartTotalElement.style.display = "block";
      confirmOrderButton.style.display = "block";

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
    // Check if the cart item already exists
    let cartItem = cartContainer.querySelector(
      `div[data-product-name="${productName}"]`
    );

    if (!cartItem) {
      // Create a new cart item container only if it doesn't exist
      cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.setAttribute("data-product-name", productName);

      // Define the cart item content with the description and quantity/price details
      cartItem.innerHTML = `
        <div class="cart-item-content">
          <div>
            <p><strong>${cartItems[productName].description}</strong></p>
            <p><span class="price">${
              cartItems[productName].quantity
            }x</span> @$${cartItems[productName].price.toFixed(2)} $${(
        cartItems[productName].price * cartItems[productName].quantity
      ).toFixed(2)}</p>
          </div>
          <img src="./Icons/icon-remove-item.jpg" class="cart-item-remove" alt="Remove item" style="margin-left: 15px;">
        </div>
      `;
      // Append the new cart item to the cart container (items stack below the already present ones)
      cartContainer.appendChild(cartItem);
    }

    // Update the specific cart item's content
    updateCart(productName);

    // Handle item removal from the cart
    const removeButton = cartItem.querySelector(".cart-item-remove");
    removeButton.addEventListener("click", function () {
      delete cartItems[productName];
      cartItem.remove();
      updateCartTotal();
      updateCartCount();

      // If the cart is empty, display the empty cart message
      if (Object.keys(cartItems).length === 0) {
        cartContainer.innerHTML = `
          <img src="./Icons/illustration-empty-cart.jpg" alt="illustration-empty-cart" />
          <p>Your added items will appear here</p>
        `;
        cartTotalElement.style.display = "none";
        confirmOrderButton.style.display = "none";
      }
    });
  }

  function updateCart(productName) {
    const cartItem = cartContainer.querySelector(
      `div[data-product-name="${productName}"]`
    );

    // Update the specific item's quantity and price
    cartItem.querySelector(".cart-item-content p:last-child").textContent = `${
      cartItems[productName].quantity
    }x @$${cartItems[productName].price.toFixed(2)} $${(
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

  // Confirm Order Button Click
  confirmOrderButton.addEventListener("click", function () {
    let summaryContent = "";
    for (let item in cartItems) {
      summaryContent += `
      <div style="margin-bottom: 10px; border-bottom: 1px solid #ccc; width: 90%; padding: 15px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <img src="${cartItems[item].image}" alt="${
        cartItems[item].name
      }" style="max-width: 50px; margin-right: 15px;">
          <p style="margin: 0;">${cartItems[item].description}</p>
        </div>
        <p style="margin: 0 0 0 65px;"><span style="color: hsl(14, 86%, 42%); margin-right: 15px;">${
          cartItems[item].quantity
        }x</span> <span class="total">@ $${cartItems[item].price.toFixed(
        2
      )}</span><span class="right" style="margin-left: 10px;">$${(
        cartItems[item].price * cartItems[item].quantity
      ).toFixed(2)}</span></p>
      </div>`;
    }
    summaryContent += `<p class="complete-total"><span class="total">Order Total:</span> <span>$${totalPriceElement.textContent}</span></p>`;
    orderSummary.innerHTML = summaryContent;
    orderConfirmation.style.display = "block";
  });

  // Start New Order
  startNewOrderButton.addEventListener("click", function () {
    cartItems = {};
    cartContainer.innerHTML = `
          <img src="./Icons/illustration-empty-cart.jpg" alt="illustration-empty-cart" />
          <p>Your added items will appear here</p>
        `;
    cartTitle.textContent = "Your Cart(0)";
    cartTotalElement.style.display = "none";
    confirmOrderButton.style.display = "none";
    orderConfirmation.style.display = "none";

    // Reset quantity controls
    const quantityControls = document.querySelectorAll(".quantity-controls");
    quantityControls.forEach((control) => {
      control.style.display = "none";
      control.previousElementSibling.style.display = "flex";
    });
  });
});
