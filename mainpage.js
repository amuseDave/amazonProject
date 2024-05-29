import { products, convertion } from "./products.js";
import orderCart from "./orderCart.js";

let mainPageHTML = "";

products.forEach((product) => {
  mainPageHTML += `
<div class="product">
<img class="product-image" src="${product.image}" alt="" />
<p class="product-name">${product.name}</p>
<div class="product-rating-box">
  <img class="product-rating" src="ratings/rating-${
    product.reviews.rating
  }.png" alt="" />
  <span class="product-rating-count">${product.reviews.count}</span>
</div>
<p class="product-price">$${convertion(product.priceCents)}</p>
<select data-input-valueid=${
    product.id
  } class="product-quantity-selector js-quantity-selector${product.id}">
  <option value="1" selected>1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
  <option value="9">9</option>
  <option value="10">10</option>
</select>
<div class="product-add-spacing"></div>


<p class="text-added hidden js-text-added${product.id}">✅Added</p>
<button data-add-product=${
    product.id
  } class="product-add js-product-add js-product-add-${
    product.id
  }">Add To Cart</button>
</div>`;
});

document.querySelector(".main").innerHTML = mainPageHTML;

let timeoutId = {};

document.querySelectorAll(".js-product-add").forEach((element) => {
  element.addEventListener("click", () => {
    let totalCartQuantityBefore = 0;
    orderCart.forEach((cartItem) => {
      totalCartQuantityBefore += cartItem.quantity;
    });

    const productId = Number(element.dataset.addProduct);
    let productAlreadyInCart = false;
    products.forEach((product) => {
      if (productId === product.id) {
        let inputValue = document.querySelector(
          `.js-quantity-selector${product.id}`
        );
        orderCart.forEach((cartItem) => {
          if (
            cartItem.id === productId &&
            totalCartQuantityBefore + Number(inputValue.value) <= 99
          ) {
            cartItem.quantity += Number(inputValue.value);
            inputValue.value = 1;
            productAlreadyInCart = true;
            document
              .querySelector(`.js-text-added${productId}`)
              .classList.remove("hidden");
            if (timeoutId[productId]) {
              clearTimeout(timeoutId[productId]);
            }
            timeoutId[productId] = setTimeout(() => {
              document
                .querySelector(`.js-text-added${cartItem.id}`)
                .classList.add("hidden");
            }, 1000);
          }
        });
        if (
          !productAlreadyInCart &&
          totalCartQuantityBefore + Number(inputValue.value) <= 99
        ) {
          orderCart.push({
            quantity: Number(inputValue.value),
            id: productId,
            deliveryOptionId: 1,
          });
          inputValue.value = 1;
          document
            .querySelector(`.js-text-added${productId}`)
            .classList.remove("hidden");
          if (timeoutId[productId]) {
            clearTimeout(timeoutId[productId]);
          }
          timeoutId[productId] = setTimeout(() => {
            document
              .querySelector(`.js-text-added${productId}`)
              .classList.add("hidden");
          }, 1000);
        } else if (totalCartQuantityBefore + Number(inputValue.value) > 99) {
          alert("Your cart is full");
        }
      }
    });
    let totalCartQuantity = 0;
    orderCart.forEach((cartItem) => {
      totalCartQuantity += cartItem.quantity;
    });
    document.querySelector(".js-quantity-number").innerHTML = totalCartQuantity;
    localStorage.setItem("cart", JSON.stringify(orderCart));
  });
});

// Update loading page cart quantity from local
let currentCartQuantity = 0;
orderCart.forEach((cartItem) => {
  currentCartQuantity += cartItem.quantity;
});
document.querySelector(".js-quantity-number").innerHTML = currentCartQuantity;
