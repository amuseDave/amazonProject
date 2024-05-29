const orderCart = JSON.parse(localStorage.getItem("cart")) || [];
import { products, convertion } from "./products.js";

export default orderCart;
