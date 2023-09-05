const dataContainer = document.getElementById("data-container");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const cart = document.getElementById("cart");
const openCart = document.getElementById("openCart");
const cartContent = document.getElementById("cart-content");
const paginationContainer = document.getElementById("pagination");
let data = [];
const itemsPerPage = 12;
let currentPage = 1;
async function fetchProducts() {
  try {
    const response = await axios.get("https://dummyjson.com/products?limit=50");
    data = response.data.products;
    renderData();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
let cartItems = [];
fetchProducts();
// RRENDER MODAL HTML
async function renderModal(id) {
  try {
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    const item = response.data;
    const { title, price, images, description } = item;

    modalContent.innerHTML = `
      <i data-close="close"
        class="bx bxs-x-square text-5xl absolute top-3 right-3 cursor-pointer"
      ></i>
      <img src="${images[0]}" alt="" class="rounded-t-lg min-w-full h-[300px] object-contain">
      <div class="p-3 text-center flex flex-col gap-3">
        <h2 class="font-bold mb-2 text-3xl text-purple-800">${title}</h2>
        <h2 class="font-bold mb-2 text-xl text-purple-800">${description}</h2>
        <p class="text-purple-700 mb-2">This is a little bit better of a card!</p>
        <div class="flex justify-between items-center absolute bottom-3 w-[96%]">
          <a href="#" class="text-purple-600 hover:text-purple-500 text-3xl">${price} $</a>
          <div class="flex items-center justify-end gap-1">
            <a href="#" class="h-[40px] w-[200px] flex items-center justify-center gap-3 text-white rounded bg-indigo-600">
              <i class="bx bx-cart-add text-xl cursor-pointer"></i>
              Add to cart
            </a>
          </div>
        </div>

      </div>
    `;
  } catch (error) {
    console.error("Error fetching item details:", error);
  }
}
// ------------------------------------------
// RRENDER CART HTML
function openCartFunc() {
  cart.classList.remove("hidden");
}
openCart.addEventListener("click", (e) => {
  e.preventDefault();
  openCartFunc();
  renderCart();
});
function renderCart() {
  const item = JSON.parse(localStorage.getItem("cartItems"));
  console.log(item);

  if (item) {
    const cartItemsHTML = item
      .map((item) => {
        return `
        <div class="cart_item flex w-full h-10 items-center justify-between px-5 rounded bg-slate-300">
          <h3 class="text-xl">${item?.title}</h3>
          <p class="text-xl">${item?.price}</p>
        </div>
      `;
      })
      .join(""); // Join the array into a single string
    const total = item.reduce(
      (accumulator, currentValue) => accumulator + currentValue.price,
      0
    );
    cartContent.innerHTML = `
      <div class="flex items-center justify-center">
        <h3 class="text-center text-3xl font-bold">Cart Items</h3>
        <i data-close="close" class="bx bxs-x-square text-5xl absolute top-3 right-3 cursor-pointer"></i>
      </div>
      <div class="items flex flex-col gap-1 mt-5 overflow-scroll">
        ${cartItemsHTML}
      </div>
      <p class="text-3xl text-right mt-4">Total : ${total}</p>
    `;
  }
}

cart.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.hasAttribute("data-close")) {
    cart.classList.add("hidden");
  }
});
// ------------------------------------------
function renderData() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  dataContainer.innerHTML = "";

  pageData.forEach((product) => {
    const { title, price, images, id } = product;

    const itemElement = document.createElement("div");
    itemElement.classList.add(
      "product-item",
      "bg-white",
      "rounded-lg",
      "shadow-lg",
      "p-2",
      "text-center",
      "w-[300px]",
      "h-[400px]",
      "relative"
    );

    itemElement.innerHTML = `
      <img src="${
        images[0]
      }" alt="" class="rounded-t-lg min-w-full h-[200px] object-contain">
      <div class="p-3">
        <h2 class="font-bold mb-2 text-2xl text-purple-800">${title.substring(
          0,
          25
        )}</h2>
        <p class="text-purple-700 mb-2">This is a little bit better of a card!</p>
        <div class="flex justify-between items-center absolute bottom-3 w-[90%]">
          <a href="#" class="text-purple-600 hover:text-purple-500 text-xl">${price} $</a>
          <div class="flex items-center justify-end gap-1">
            <a data-cart-add="${id}" href="#" class="h-[40px] w-10 flex items-center justify-center text-white rounded bg-indigo-600">
              <i data-cart-add="${id}"  class="bx bx-cart-add text-xl cursor-pointer"></i>
            </a>
            <a data-modal="modal" data-id="${id}" href="#" class="w-[100px] h-[40px] flex items-center justify-center text-white rounded bg-indigo-600">Read more</a>
          </div>
        </div>
      </div>
    `;

    dataContainer.appendChild(itemElement);
  });

  updatePagination();
}

dataContainer.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.hasAttribute("data-modal")) {
    const id = e.target.getAttribute("data-id");
    modal.classList.remove("hidden");
    renderModal(id);
  }
  if (e.target.hasAttribute("data-cart-add")) {
    const selectedProduct = parseInt(e.target.getAttribute("data-cart-add")); // Convert to number
    const filteredProduct = data.find((el) => el.id === selectedProduct);
    cartItems.push(filteredProduct);
    console.log(cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
});
modal.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.hasAttribute("data-close")) {
    modal.classList.add("hidden");
  }
});

function updatePagination() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className =
      "py-2 px-4 bg-white mx-1 hover:text-white hover:bg-blue-400 rounded";

    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderData();
    });

    paginationContainer.appendChild(pageButton);
  }
}
