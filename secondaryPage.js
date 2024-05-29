import { products, convertion } from "./products.js";
import orderCart from "./orderCart.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "./deliveryOptions.js";

function updateTheCartInteractions() {
  let orderPageHTML = "";
  orderCart.forEach((item) => {
    products.forEach((product) => {
      if (item.id === product.id) {
        const deliveryOptionId = item.deliveryOptionId;
        let deliveryOption;

        deliveryOptions.forEach((option) => {
          if (option.id === deliveryOptionId) {
            deliveryOption = option;
          }
        });
        const today = dayjs();

        const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
        const dateString = deliveryDate.format("dddd, MMMM D");

        orderPageHTML += `<div class="cart-item js-cart-item${product.id}">
            <p class="delivery-date js-delivery-date">Delivery date: ${dateString}</p>
            <div class="cart-item-info-row-box">
            <div class="cart-item-info-row-box-inside">
              <img class="cart-item-image" src="${product.image}" alt="" />
                <div class="box-middle-section">
                  <p class="item-name">${product.name}</p>
                  <p class="item-price">$${convertion(product.priceCents)}</p>
                  <div class="item-quantity-update">
                    <p class="quantity-text js-quantity-text${
                      product.id
                    }">Quantity: ${item.quantity}</p>
                    <div class="quantity-update-box-input js-quantity-update-box-input${
                      product.id
                    } hidden">
                <input type="number" class="update-input js-update-input${
                  product.id
                }">
                <p class="UD js-save-button js-save-button${
                  product.id
                }" data-save-button=${product.id}> Save</p>
              </div>
                <div class="quantity-update-box">
                  <p class="UD js-update-button js-update-button${
                    product.id
                  }" data-update-button="${product.id}">Update</p>
                  <p class="UD js-delete-button" data-delete-button="${
                    product.id
                  }">Delete</p>
                </div>
              </div>
            </div>
            </div>
            <div class="delivery-dates">
              <p class="item-name">Choose a delivery option</p>
             ${deliveryOptionsHTML(product, item)}
            </div>
         
        </div>
        </div>`;
      }
    });
  });

  function deliveryOptionsHTML(product, item) {
    let dateHTML = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        deliveryOption.deliveryPriceCents === 0
          ? "FREE"
          : `$${convertion(deliveryOption.deliveryPriceCents)} -`;
      const isChecked = deliveryOption.id === item.deliveryOptionId;

      dateHTML += `<div class="radio-option js-radio-option" data-delivery-id=${
        deliveryOption.id
      } data-item-id=${item.id}>
      <input class="radio-input" type="radio" ${
        isChecked ? `checked` : ``
      } name="${item.id}"/>
      <div class="radio-option-info">
        <p class="delivery-date-info">${dateString}</p>
        <p class="delivery-date-cost">${priceString} Shipping</p>
      </div>
    </div>`;
    });
    return dateHTML;
  }

  document.querySelector(".cart-items").innerHTML = orderPageHTML;

  document.querySelectorAll(".js-radio-option").forEach((input) => {
    input.addEventListener("click", () => {
      const deliveryId = input.dataset.deliveryId;
      const itemId = input.dataset.itemId;
      orderCart.forEach((item) => {
        if (itemId == item.id) {
          item.deliveryOptionId = Number(deliveryId);
        }
      });
      localStorage.setItem("cart", JSON.stringify(orderCart));
      updateTheCartInteractions();
    });
  });

  document.querySelectorAll(".js-update-button").forEach((element) => {
    element.addEventListener("click", () => {
      const productId = element.dataset.updateButton;
      document
        .querySelector(`.js-update-button${productId}`)
        .classList.add("hidden");
      document
        .querySelector(`.js-quantity-update-box-input${productId}`)
        .classList.remove("hidden");
      document.querySelector(`.js-quantity-text${productId}`).innerHTML =
        "Quantity:";
      orderCart.forEach((item) => {
        if (productId == item.id) {
          document.querySelector(`.js-update-input${productId}`).value =
            item.quantity;
        }
      });
    });
  });

  document.querySelectorAll(`.js-save-button`).forEach((element) => {
    element.addEventListener("click", () => {
      const productId = Number(element.dataset.saveButton);
      orderCart.forEach((item) => {
        if (item.id === productId) {
          const currentValue = Number(
            document.querySelector(`.js-update-input${productId}`).value
          );
          if (currentValue <= 10 && currentValue >= 0) {
            if (currentValue == 0) {
              orderCart.splice(item, 1);
              updateTheCartInteractions();
            } else {
              item.quantity = Number(
                document.querySelector(`.js-update-input${productId}`).value
              );
              document.querySelector(
                `.js-quantity-text${productId}`
              ).innerHTML = `Quantity: ${item.quantity}`;
              document
                .querySelector(`.js-update-button${productId}`)
                .classList.remove("hidden");
              document
                .querySelector(`.js-quantity-update-box-input${productId}`)
                .classList.add("hidden");
              updateTheCartInteractions();
            }
          } else if (currentValue < 0) {
            alert("Invalid quantity");
          } else if (currentValue > 10) {
            alert("The maximum quantity is 10 per product");
          }
        }
      });
    });
  });

  document.querySelectorAll(".js-delete-button").forEach((element) => {
    element.addEventListener("click", () => {
      const productId = Number(element.dataset.deleteButton);
      orderCart.forEach((item) => {
        if (productId === item.id) {
          orderCart.splice(item, 1);
          updateTheCartInteractions();
        }
      });
    });
  });

  let newTotalCartQuantity = 0;
  let totalItemsCost = 0;
  let totalShippingCost = 0;
  orderCart.forEach((item) => {
    deliveryOptions.forEach((option) => {
      if (option.id == item.deliveryOptionId) {
        console.log(option.deliveryPriceCents);
        totalShippingCost += option.deliveryPriceCents;
        console.log("test");
      }
    });

    newTotalCartQuantity += item.quantity;
    products.forEach((product) => {
      if (product.id === item.id) {
        totalItemsCost += product.priceCents * item.quantity;
      }
    });
  });

  let totalBeforeTax = totalItemsCost + totalShippingCost;
  let estimatedTax = Math.round(totalBeforeTax * 0.1);
  let totalAfterTax = estimatedTax + totalBeforeTax;

  document.querySelector(`.js-items-price`).innerHTML = `$${convertion(
    totalItemsCost
  )}`;
  document.querySelector(".js-total-cart-quantity").innerHTML =
    newTotalCartQuantity;
  document.querySelector(".js-total-cart-quantity-summary").innerHTML =
    newTotalCartQuantity;
  document.querySelector(
    `.js-price-shipping-summary`
  ).innerHTML = `$${convertion(totalShippingCost)}`;
  document.querySelector(".js-total-before-tax").innerHTML = `$${convertion(
    totalBeforeTax
  )}`;
  document.querySelector(`.js-estimated-tax`).innerHTML = `$${convertion(
    estimatedTax
  )}`;
  document.querySelector(`.js-order-total`).innerHTML = `$${convertion(
    totalAfterTax
  ).toFixed(2)}`;

  localStorage.setItem("cart", JSON.stringify(orderCart));
}

updateTheCartInteractions();
