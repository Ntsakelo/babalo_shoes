document.addEventListener("DOMContentLoaded", function () {
  const productListTemplate = document.querySelector(".productListTemplate");
  let itemsDisplay = document.querySelector("#itemsDisplay");
  const toCartTemplate = document.querySelector(".toCartTemplate");
  let toCartDisplay = document.querySelector("#toCartDisplay");
  const brandListTemplate = document.querySelector(".brandListTemplate");
  const colorListTemplate = document.querySelector(".colorListTemplate");
  const sizeListTemplate = document.querySelector(".sizeListTemplate");
  const sizeStockTemplate = document.querySelector(".sizeStockTemplate");
  const sizeStockDisplay = document.querySelector(".sizeStockDisplay");
  const catCount = document.querySelector(".count");
  const ordersTemplate = document.querySelector(".ordersTemplate");
  const ordersDisplay = document.querySelector(".ordersDisplay");
  const totalTemplate = document.querySelector(".totalTemplate");
  const totalDisplay = document.querySelector(".purchase");
  const sizes = document.querySelectorAll(".size");
  const navListTemplate = document.querySelector(".navListTemplate");
  const navList = document.querySelector(".navList");
  const bgNavListTemplate = document.querySelector(".bgNavListTemplate");
  const bgNavList = document.querySelector(".bgNavList");
  const decreaseBtn = document.querySelector(".decrease");
  const increaseBtn = document.querySelector(".increase");
  const qtyVal = document.querySelector(".qtyVal");
  const addtoBag = document.querySelector(".addtoBag");
  const confirmDisplay = document.querySelector("#confirmDisplay");
  const confirmTemplate = document.querySelector(".confirmTemplate");
  const confirmBtn = document.querySelector(".confirmBtn");
  const checkOutConfirmBtn = document.querySelector(".checkOutConfirmBtn");

  //search/filter shoes
  const searchBtn = document.querySelector(".searchBtn");
  const brandSelect = document.querySelector(".brandSelect");
  const colorSelect = document.querySelector(".colorSelect");
  const sizeSelect = document.querySelector(".sizeSelect");
  ////Search////
  ////Validations

  //login validation
  const regInputs = document.querySelectorAll(".regInput");
  const validateMsgs = document.querySelectorAll(".validation");
  const signinInputs = document.querySelectorAll(".signinInput");
  const validateLogin = document.querySelectorAll(".signInValidation");
  function checkSigninInputs() {
    for (let i = 0; i < signinInputs.length; i++) {
      let signInput = signinInputs[i];
      let validateTxt = validateLogin[i];
      signInput.addEventListener("focusout", function () {
        signInput.classList.remove("alert");
        validateTxt.classList.remove("alertMsg");
        if (signInput.value === "") {
          signInput.classList.add("alert");
          validateTxt.classList.add("alertMsg");
        }
      });
    }
  }
  checkSigninInputs();
  function removeValidations() {
    const signInClose = document.querySelector(".signInClose");
    const registerClose = document.querySelector(".registerClose");
    signInClose.addEventListener("click", function () {
      signinInputs.forEach((inputField) => {
        inputField.value = "";
        inputField.classList.remove("alert");
      });
      validateLogin.forEach((Msgs) => {
        Msgs.classList.remove("alertMsg");
      });
    });
    registerClose.addEventListener("click", function () {
      regInputs.forEach((inputField) => {
        inputField.value = "";
        inputField.classList.remove("alert");
      });
      validateMsgs.forEach((Msgs) => {
        Msgs.classList.remove("alertMsg");
      });
    });
  }
  removeValidations();
  //user functions
  function checkDetails() {
    const nameValidation = document.querySelector(".nameValidation");
    const lstNameValidation = document.querySelector(".lastNameValidation");
    const emailValidation = document.querySelector(".emailValidation");
    const passwrdValidation = document.querySelector(".passwordValidation");
    const regBtn = document.querySelector(".regBtn");
    let firstName = document.querySelector(".firstName");
    let lastName = document.querySelector(".lastName");
    let email = document.querySelector(".email");
    let password = document.querySelector(".password");

    firstName.oninput = function () {
      if (firstName.value.length > 0) {
        firstName.classList.remove("alert");
        nameValidation.classList.remove("alertMsg");
      } else {
        firstName.classList.add("alert");
        nameValidation.classList.add("alertMsg");
      }
    };
    lastName.oninput = function () {
      if (lastName.value.length > 0) {
        lastName.classList.remove("alert");
        lstNameValidation.classList.remove("alertMsg");
      } else {
        lastName.classList.add("alert");
        lstNameValidation.classList.add("alertMsg");
      }
    };
    email.oninput = function () {
      if (email.value.length > 0) {
        email.classList.remove("alert");
        emailValidation.classList.remove("alertMsg");
      } else {
        email.classList.add("alert");
        emailValidation.classList.add("alertMsg");
      }
    };
    password.oninput = function () {
      if (password.value.length > 0) {
        password.classList.remove("alert");
        passwrdValidation.classList.remove("alertMsg");
      } else {
        password.classList.add("alert");
        passwrdValidation.classList.add("alertMsg");
      }
    };
  }
  function registerUser() {
    checkDetails();
    const regBtn = document.querySelector(".regBtn");
    regBtn.addEventListener("click", function () {
      let firstName = document.querySelector(".firstName").value;
      let lastName = document.querySelector(".lastName").value;
      let email = document.querySelector(".email").value;
      let password = document.querySelector(".password").value;
      const registrationStatus = document.querySelector(".registrationStatus");
      for (let i = 0; i < regInputs.length; i++) {
        if (regInputs[i].value === "") {
          regInputs[i].classList.add("alert");
          validateMsgs[i].classList.add("alertMsg");
        }
      }
      if (firstName && lastName && email && password) {
        axios
          .post("/api/register", { firstName, lastName, email, password })
          .then(function (results) {
            let response = results.data;
            let data = response.status;
            if (data === "The user already exists") {
              registrationStatus.innerHTML = `<i class="fa-regular fa-circle-xmark" id="checkCircle"></i> ${data}`;

              registrationStatus.classList.remove("success");
              registrationStatus.classList.add("error");
            }
            if (data === "Registration was successful") {
              registrationStatus.innerHTML = `<i class="fa-regular fa-circle-check" id="checkCircle"></i> ${data}`;
              registrationStatus.classList.remove("error");
              registrationStatus.classList.add("success");
            }
            if (registrationStatus.innerHTML !== "") {
              setTimeout(function () {
                registrationStatus.innerHTML = "";
              }, 3000);
            }
          });
      }
      firstName = "";
      lastName = "";
      email = "";
      password = "";
    });
  }

  registerUser();
  function checkRegInputs() {
    for (let i = 0; i < regInputs.length; i++) {
      let regInput = regInputs[i];
      let validateTxt = validateMsgs[i];
      regInput.addEventListener("focusout", function () {
        regInput.classList.remove("alert");
        validateTxt.classList.remove("alertMsg");
        if (regInput.value === "") {
          regInput.classList.add("alert");
          validateTxt.classList.add("alertMsg");
        }
      });
    }
  }
  checkRegInputs();
  let userName = "";
  function userLogin() {
    const signinBtn = document.querySelector(".signinBtn");
    const signInName = document.querySelector(".signInName");
    signinBtn.addEventListener("click", function () {
      const loginStatus = document.querySelector(".loginStatus");
      const signOutLnk = document.querySelectorAll("#signOutLnk");
      let loginEmail = document.querySelector(".signInEmail").value;
      let password = document.querySelector(".signInPassword").value;
      axios
        .post("/api/login", { loginEmail, password })
        .then(function (results) {
          let response = results.data;
          if (response.firstname) {
            signOutLnk.forEach((link) => {
              link.innerHTML = `Sign Out(${response.firstname})`;
            });
            loginStatus.innerHTML = `<i class="fa-regular fa-circle-check" id="checkCircle"></i> ${response.status} as ${response.firstname}`;
            signInName.innerHTML = response.firstname;
            loginStatus.classList.remove("error");
            loginStatus.classList.add("success");
          } else {
            signOutLnk.forEach((link) => {
              link.innerHTML = `Sign Out`;
            });
            loginStatus.innerHTML = `<i class="fa-regular fa-circle-xmark" id="checkCircle"></i> ${response.status}`;
            loginStatus.classList.remove("success");
            loginStatus.classList.add("error");
          }
          if (loginStatus.innerHTML !== "") {
            setTimeout(function () {
              loginStatus.innerHTML = "";
            }, 3000);
          }
          axios.get("/api/verify").then((results) => {
            const checkoutBtn = document.querySelector(".checkoutBtn");
            let response = results.data;
            let data = response.data;
            if (!data) {
              checkoutBtn.setAttribute("data-bs-target", "#staticLogin");
            } else {
              checkoutBtn.setAttribute("data-bs-target", "#purchaseForm");
            }
          });
        });
    });
  }
  userLogin();
  function verifyLogin() {
    const signInName = document.querySelector(".signInName");
    const signOutLnk = document.querySelectorAll("#signOutLnk");
    axios.get("/api/verify").then((results) => {
      let response = results.data;
      let data = response.data;
      if (data) {
        signOutLnk.forEach((link) => {
          link.innerHTML = `Sign Out(${data.firstname})`;
        });
        signInName.innerHTML = data.firstname;
      } else if (!data) {
        signOutLnk.forEach((link) => {
          link.innerHTML = `Sign Out`;
        });
        signInName.innerHTML = "";
      }
    });
  }
  verifyLogin();
  function logOut() {
    const signOutLnk = document.querySelectorAll("#signOutLnk");
    const signInName = document.querySelector(".signInName");
    signOutLnk.forEach((link) => {
      link.addEventListener("click", function () {
        axios.get("/api/logout").then((results) => {
          let response = results.data;
          let data = response.status;
          if (data) {
            link.innerHTML = `Sign Out`;
            signInName.innerHTML = "";
          }
        });
      });
    });
    verifyLogin();
  }
  logOut();
  //instances
  const shoesServices = ShoesServices();
  let products = [];
  function displayProducts() {
    shoesServices.getShoes().then(function (results) {
      let response = results.data;
      let data = response.data;

      data.forEach((item) => {
        if (item.sale_price > 0) {
          item.saleTag = "saleTag";
          item.priceState = "oldPrice";
        }
        if (item.sale_price <= 0) {
          delete item.sale_price;
          item.saleTag = "";
          item.priceState = "";
        }
        products.push(item);
      });

      let template = Handlebars.compile(productListTemplate.innerHTML);

      itemsDisplay.innerHTML = template({
        item: data,
      });
      addItem();
      itemsCount();
    });
  }
  itemsCount();
  displayProducts();

  let catCount2;
  function navigation() {
    axios.get("/api/category").then(function (results) {
      let response = results.data;
      let data = response.data;
      let template = Handlebars.compile(navListTemplate.innerHTML);
      navList.innerHTML = template({
        category: data,
      });
      let bgTemplate = Handlebars.compile(bgNavListTemplate.innerHTML);
      bgNavList.innerHTML = bgTemplate({
        category: data,
      });
      const allFilter = document.querySelector(".All");
      allFilter.classList.add("active");
      catCount2 = document.querySelector(".itemsCount");
      categoryFilter();
      itemsCount();
      displayCart();
      userLogin();
      verifyLogin();
      logOut();
    });
  }
  navigation();
  function categoryFilter() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      if (link.id === "user") {
        return;
      }
      link.addEventListener("click", function () {
        axios.get(`/api/shoes/${link.id}`).then(function (results) {
          let response = results.data;
          let data = response.data;

          data.forEach((item) => {
            if (item.sale_price > 0) {
              item.saleTag = "saleTag";
              item.priceState = "oldPrice";
            }
            if (item.sale_price <= 0) {
              delete item.sale_price;
              item.saleTag = "";
              item.priceState = "";
            }
            products.push(item);
          });
          let template = Handlebars.compile(productListTemplate.innerHTML);
          itemsDisplay.innerHTML = template({
            item: data,
          });

          addItem();
        });
      });
    });
  }
  //display brand dropdown
  function theBrands() {
    axios.get("/api/brands").then(function (results) {
      let response = results.data;
      let data = response.data;
      let brandList = [];
      data.forEach((item) => {
        brandList.push(item.brand);
      });
      let template = Handlebars.compile(brandListTemplate.innerHTML);
      brandSelect.innerHTML = template({
        brand: brandList,
      });
    });
  }
  theBrands();
  //display color dropdown
  function theColors() {
    axios.get("/api/colors").then(function (results) {
      let response = results.data;
      let data = response.data;
      let colorList = [];
      data.forEach((item) => {
        colorList.push(item.color);
      });
      let template = Handlebars.compile(colorListTemplate.innerHTML);
      colorSelect.innerHTML = template({
        color: colorList,
      });
    });
  }
  theColors();
  function theSizes() {
    axios.get("/api/sizes").then(function (results) {
      let response = results.data;
      let data = response.data;
      let sizeList = [];
      data.forEach((item) => {
        sizeList.push(item.size);
      });
      let template = Handlebars.compile(sizeListTemplate.innerHTML);
      sizeSelect.innerHTML = template({
        size: sizeList,
      });
    });
  }
  theSizes();

  //add to cart => add event listener for buttons
  //toCartItem handlebars function
  //toCartItem

  let productId = 0;
  let currentItem;
  let qtyOfSize;
  let selectedSize;
  ///add to cart
  function addItem() {
    const cartBtn = document.querySelectorAll(".cartBtn");
    const product = document.querySelectorAll(".product");
    for (let i = 0; i < cartBtn.length; i++) {
      let btn = cartBtn[i];
      btn.addEventListener("click", function () {
        sizeClass();
        let id = Number(product[i].id);
        productId = id;
        sizeStockDisplay.innerHTML = "";
        qtyVal.value = 1;
        axios.get(`/api/shoes/selected/${id}`).then(function (results) {
          let response = results.data;
          let data = response.data;
          if (data.sale_price === 0) {
            delete data.sale_price;
          }
          if (data.sale_price > 0) {
            data.price = data.sale_price;
          }
          currentItem = data;
          let list = [];
          list.push(data);
          itemList = list;
          let template = Handlebars.compile(toCartTemplate.innerHTML);
          toCartDisplay.innerHTML = template({
            toCartItem: list,
          });
        });
      });
    }
  }
  function sizeClass() {
    for (let i = 0; i < sizes.length; i++) {
      sizes[i].classList.remove("sizeSelected");
    }
  }
  sizes.forEach((size) => {
    addItem();
    size.addEventListener("click", function () {
      // size.classList.add("sizeUnselected");
      qtyVal.value = 1;
      sizeClass();
      size.classList.add("sizeSelected");

      let shoeSize = Number(size.id);
      selectedSize = shoeSize;
      let qtyList = [];
      let quantities = currentItem.quantities;
      quantities.forEach((item) => {
        if (shoeSize === item.size) {
          qtyList.push(item.stock_qty);
        }
      });
      if (qtyList.length <= 0) {
        qtyVal.value = 0;
      }
      qtyOfSize = qtyList;
      let template = Handlebars.compile(sizeStockTemplate.innerHTML);
      sizeStockDisplay.innerHTML = template({
        qty: qtyList,
      });
    });
  });
  //ADD ITEM TO CART FOR CHECKOUT

  increaseBtn.addEventListener("click", function () {
    if (qtyVal.value < qtyOfSize[0]) {
      qtyVal.value++;
    }
  });
  decreaseBtn.addEventListener("click", function () {
    if (qtyVal.value > 1) {
      qtyVal.value--;
    }
  });
  function itemsCount() {
    //navigation();
    // const catCount2 = document.querySelector(".itemsCount");
    axios.get("/api/shoes/cartCount").then(function (results) {
      let response = results.data;
      let data = response.data;
      catCount.innerHTML = Number(data.count);
      catCount2.innerHTML = Number(data.count);
    });
  }
  itemsCount();
  ///ADD TO BASKET
  addtoBag.addEventListener("click", function () {
    let qty = Number(qtyVal.value);

    axios
      .get(
        `/api/shoes/addToCart/item/${productId}/quantity/${qty}/size/${selectedSize}`
      )
      .then(function () {
        itemsCount();
        return;
      });
  });
  ///
  ///SEARCH FUNCTIONALITY
  searchBtn.addEventListener("click", function () {
    if (brandSelect.value) {
      axios
        .get(`/api/shoes/brand/${brandSelect.value}`)
        .then(function (results) {
          let response = results.data;
          let data = response.data;
          data.forEach((item) => {
            if (item.sale_price > 0) {
              item.saleTag = "saleTag";
              item.priceState = "oldPrice";
            }
            if (item.sale_price <= 0) {
              delete item.sale_price;
              item.saleTag = "";
              item.priceState = "";
            }
          });
          itemsDisplay.innerHTML = "";
          let template = Handlebars.compile(productListTemplate.innerHTML);
          itemsDisplay.innerHTML = template({
            item: data,
          });
          addItem();
        });
    }
    if (
      sizeSelect.value !== "SELECT SIZE" &&
      brandSelect.value === "SELECT BRAND" &&
      colorSelect.value === "SELECT COLOR"
    ) {
      axios.get(`/api/shoes/size/${sizeSelect.value}`).then(function (results) {
        let response = results.data;
        let data = response.data;
        data.forEach((item) => {
          if (item.sale_price > 0) {
            item.saleTag = "saleTag";
            item.priceState = "oldPrice";
          }
          if (item.sale_price <= 0) {
            delete item.sale_price;
            item.saleTag = "";
            item.priceState = "";
          }
        });
        itemsDisplay.innerHTML = "";
        let template = Handlebars.compile(productListTemplate.innerHTML);
        itemsDisplay.innerHTML = template({
          item: data,
        });
        addItem();
      });
    }
    if (
      colorSelect.value !== "SELECT COLOR" &&
      sizeSelect.value === "SELECT SIZE" &&
      brandSelect.value === "SELECT BRAND"
    ) {
      axios
        .get(`/api/shoes/color/${colorSelect.value}`)
        .then(function (results) {
          let response = results.data;
          let data = response.data;
          data.forEach((item) => {
            if (item.sale_price > 0) {
              item.saleTag = "saleTag";
              item.priceState = "oldPrice";
            }
            if (item.sale_price <= 0) {
              delete item.sale_price;
              item.saleTag = "";
              item.priceState = "";
            }
          });
          itemsDisplay.innerHTML = "";
          let template = Handlebars.compile(productListTemplate.innerHTML);
          itemsDisplay.innerHTML = template({
            item: data,
          });
          addItem();
        });
    }
    if (
      brandSelect.value !== "SELECT BRAND" &&
      sizeSelect.value !== "SELECT SIZE" &&
      colorSelect.value === "SELECT COLOR"
    ) {
      axios
        .get(`/api/shoes/brand/${brandSelect.value}/size/${sizeSelect.value}`)
        .then(function (results) {
          let response = results.data;
          let data = response.data;
          data.forEach((item) => {
            if (item.sale_price > 0) {
              item.saleTag = "saleTag";
              item.priceState = "oldPrice";
            }
            if (item.sale_price <= 0) {
              delete item.sale_price;
              item.saleTag = "";
              item.priceState = "";
            }
          });
          itemsDisplay.innerHTML = "";
          let template = Handlebars.compile(productListTemplate.innerHTML);
          itemsDisplay.innerHTML = template({
            item: data,
          });
          addItem();
        });
    }
    if (
      brandSelect.value !== "SELECT BRAND" &&
      colorSelect.value !== "SELECT COLOR" &&
      sizeSelect.value === "SELECT SIZE"
    ) {
      axios
        .get(`/api/shoes/brand/${brandSelect.value}/color/${colorSelect.value}`)
        .then(function (results) {
          let response = results.data;
          let data = response.data;
          data.forEach((item) => {
            if (item.sale_price > 0) {
              item.saleTag = "saleTag";
              item.priceState = "oldPrice";
            }
            if (item.sale_price <= 0) {
              delete item.sale_price;
              item.saleTag = "";
              item.priceState = "";
            }
          });
          itemsDisplay.innerHTML = "";
          let template = Handlebars.compile(productListTemplate.innerHTML);
          itemsDisplay.innerHTML = template({
            item: data,
          });
          addItem();
        });
    }
    if (
      brandSelect.value === "SELECT BRAND" &&
      colorSelect.value !== "SELECT COLOR" &&
      sizeSelect.value !== "SELECT SIZE"
    ) {
      axios
        .get(`/api/shoes/size/${sizeSelect.value}/color/${colorSelect.value}`)
        .then(function (results) {
          let response = results.data;
          let data = response.data;
          data.forEach((item) => {
            if (item.sale_price > 0) {
              item.saleTag = "saleTag";
              item.priceState = "oldPrice";
            }
            if (item.sale_price <= 0) {
              delete item.sale_price;
              item.saleTag = "";
              item.priceState = "";
            }
          });
          itemsDisplay.innerHTML = "";
          let template = Handlebars.compile(productListTemplate.innerHTML);
          itemsDisplay.innerHTML = template({
            item: data,
          });
          addItem();
        });
    }
    if (
      brandSelect.value !== "SELECT BRAND" &&
      colorSelect.value !== "SELECT COLOR" &&
      sizeSelect.value !== "SELECT SIZE"
    ) {
      axios
        .get(
          `/api/shoes/brand/${brandSelect.value}/size/${sizeSelect.value}/color/${colorSelect.value}`
        )
        .then(function (results) {
          let response = results.data;
          let data = response.data;
          data.forEach((item) => {
            if (item.sale_price > 0) {
              item.saleTag = "saleTag";
              item.priceState = "oldPrice";
            }
            if (item.sale_price <= 0) {
              delete item.sale_price;
              item.saleTag = "";
              item.priceState = "";
            }
          });
          itemsDisplay.innerHTML = "";
          let template = Handlebars.compile(productListTemplate.innerHTML);
          itemsDisplay.innerHTML = template({
            item: data,
          });
          addItem();
        });
    }
  });
  let cartData;

  function displayCart() {
    const showCart = document.querySelectorAll(".showCart");
    showCart.forEach((item) => {
      item.addEventListener("click", function () {
        axios.get("/api/orders").then(function (results) {
          let response = results.data;
          let data = response.data;
          let totQty = 0;
          let totAmount = 0;
          let totList = [];
          cartData = data;
          data.forEach((item) => {
            totQty += item.order_qty;
            totAmount += Number(item.price);
          });
          totList.push({ totQty, totAmount });
          let template = Handlebars.compile(ordersTemplate.innerHTML);
          ordersDisplay.innerHTML = template({
            orderItems: data,
          });
          let template2 = Handlebars.compile(totalTemplate.innerHTML);
          totalDisplay.innerHTML = template2({
            totals: totList,
          });
          axios.get("/api/verify").then((results) => {
            const checkoutBtn = document.querySelector(".checkoutBtn");
            let response = results.data;
            let data = response.data;
            if (!data) {
              checkoutBtn.setAttribute("data-bs-target", "#staticLogin");
            } else {
              checkoutBtn.setAttribute("data-bs-target", "#purchaseForm");
            }
          });
          myOrderUpdate();
          confirmRemoval();
          userLogin();
          //checkOut();
        });
      });
    });
  }

  function myOrderUpdate() {
    const itemTotal = document.querySelectorAll(".itemTotal");
    const upQty = document.querySelectorAll(".upQty");
    const downQty = document.querySelectorAll(".downQty");
    const qtyVal2 = document.querySelectorAll(".qtyVal2");
    const bagItems = document.querySelectorAll(".bagItems");

    for (let i = 0; i < upQty.length; i++) {
      let upBtn = upQty[i];
      upBtn.addEventListener("click", function () {
        let qty = 0;
        if (qtyVal2[i].value <= cartData[i].stock_qty) {
          qtyVal2[i].value++;
        }
        qty = Number(qtyVal2[i].value);
        let orderId = bagItems[i].id;
        axios
          .get(`/api/orders/edit/${qty}/${orderId}`)
          .then(function (results) {
            let response = results.data;
            let data = response.data;
            let totQty = 0;
            let totAmount = 0;

            let totList = [];
            let itemPrice;
            data.forEach((item) => {
              totQty += item.order_qty;
              if (item.id === Number(orderId)) {
                itemPrice = item.price;
              }
              totAmount += Number(item.price);
            });
            totList.push({ totQty, totAmount });

            itemTotal[i].innerHTML = "R" + itemPrice;
            let template2 = Handlebars.compile(totalTemplate.innerHTML);
            totalDisplay.innerHTML = template2({
              totals: totList,
            });
            axios.get("/api/verify").then((results) => {
              const checkoutBtn = document.querySelector(".checkoutBtn");
              let response = results.data;
              let data = response.data;
              if (!data) {
                checkoutBtn.setAttribute("data-bs-target", "#staticLogin");
              } else {
                checkoutBtn.setAttribute("data-bs-target", "#purchaseForm");
              }
            });
          });
      });
    }
    for (let i = 0; i < downQty.length; i++) {
      let downBtn = downQty[i];
      downBtn.addEventListener("click", function () {
        let qty = 0;

        if (Number(qtyVal2[i].value) > 1) {
          qtyVal2[i].value--;
        }
        qty = Number(qtyVal2[i].value);
        let orderId = Number(bagItems[i].id);
        axios
          .get(`/api/orders/edit/${qty}/${orderId}`)
          .then(function (results) {
            let response = results.data;
            let data = response.data;
            let totQty = 0;
            let totAmount = 0;
            let totList = [];
            let itemPrice;
            data.forEach((item) => {
              totQty += item.order_qty;
              if (item.id === Number(orderId)) {
                itemPrice = item.price;
              }
              totAmount += Number(item.price);
            });
            totList.push({ totQty, totAmount });
            itemTotal[i].innerHTML = "R" + itemPrice;
            console.log(itemPrice);
            let template2 = Handlebars.compile(totalTemplate.innerHTML);
            totalDisplay.innerHTML = template2({
              totals: totList,
            });
            axios.get("/api/verify").then((results) => {
              const checkoutBtn = document.querySelector(".checkoutBtn");
              let response = results.data;
              let data = response.data;
              if (!data) {
                checkoutBtn.setAttribute("data-bs-target", "#staticLogin");
              } else {
                checkoutBtn.setAttribute("data-bs-target", "#purchaseForm");
              }
            });
          });
      });
    }
  }
  let id;
  function confirmRemoval() {
    const removeBtn = document.querySelectorAll(".removeBtn");
    removeBtn.forEach((btn) => {
      btn.addEventListener("click", function () {
        let orderId = btn.id;
        id = orderId;
        axios.get(`api/remove/confirm/${orderId}`).then(function (results) {
          let response = results.data;
          let data = response.data;
          let list = [];
          list.push(data);
          let template = Handlebars.compile(confirmTemplate.innerHTML);
          confirmDisplay.innerHTML = template({
            itemName: list,
          });
          axios.get("/api/verify").then((results) => {
            const checkoutBtn = document.querySelector(".checkoutBtn");
            let response = results.data;
            let data = response.data;
            if (!data) {
              checkoutBtn.setAttribute("data-bs-target", "#staticLogin");
            } else {
              checkoutBtn.setAttribute("data-bs-target", "#purchaseForm");
            }
          });
        });
      });
    });
  }
  //start here
  function remove() {
    confirmBtn.addEventListener("click", function () {
      axios.get(`/api/remove/${id}`).then(function (results) {
        let response = results.data;
        let data = response.data;
        let totQty = 0;
        let totAmount = 0;
        let totList = [];
        cartData = data;
        data.forEach((item) => {
          totQty += item.order_qty;
          totAmount += Number(item.price);
        });
        totList.push({ totQty, totAmount });

        let template = Handlebars.compile(ordersTemplate.innerHTML);
        ordersDisplay.innerHTML = template({
          orderItems: data,
        });
        let template2 = Handlebars.compile(totalTemplate.innerHTML);
        totalDisplay.innerHTML = template2({
          totals: totList,
        });
        axios.get("/api/verify").then((results) => {
          const checkoutBtn = document.querySelector(".checkoutBtn");
          let response = results.data;
          let data = response.data;
          if (!data) {
            checkoutBtn.setAttribute("data-bs-target", "#staticLogin");
          } else {
            checkoutBtn.setAttribute("data-bs-target", "#purchaseForm");
          }
        });
        myOrderUpdate();
        confirmRemoval();
        itemsCount();
      });
    });
  }
  remove();
  //checkout function needs to be assessed
  function checkOut() {
    const purchaseBtn = document.querySelector(".purchaseBtn");
    const cardNumber = document.querySelector(".cardNumber");
    const expiryDate = document.querySelector(".expiryDate");
    const validatexpDte = document.querySelector(".validatexpDte");
    const cvv = document.querySelector(".cvv");
    const validateCVV = document.querySelector(".validateCVV");
    cardNumber.onkeypress = function () {
      if ((cardNumber.value.length + 1) % 5 === 0) {
        cardNumber.value = cardNumber.value + " ";
      }
    };
    let arr;
    expiryDate.onkeyup = function (evt) {
      let event = evt || window.event;
      if (event.type === "keyup") {
        let key = event.key;
        let keys = [
          "/",
          "Backspace",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
        ];
        keys.forEach((item) => {
          if (key === item) {
            return;
          }
        });
        if (
          !/[0-9]|\./.test(key) &&
          key !== "/" &&
          key !== "Backspace" &&
          key !== "ArrowLeft" &&
          key !== "ArrowRight" &&
          key !== "ArrowDown" &&
          key !== "ArrowUp"
        ) {
          validatexpDte.setAttribute("style", "opacity:1");
          expiryDate.classList.add("alert");
        } else if (/[0-9]|\./.test(key) && key !== "/" && key !== "Backspace") {
          let numArr = expiryDate.value.split("");
          for (let i = 0; i < numArr.length; i++) {
            if (numArr[i] != Number(numArr[i])) {
              validatexpDte.setAttribute("style", "opacity:1");
              expiryDate.classList.add("alert");
            } else {
              validatexpDte.setAttribute("style", "opacity:0");
              expiryDate.classList.remove("alert");
            }
          }
        }
      }

      if (event.key == "Backspace") {
        return;
      }
      if (expiryDate.value.length === 2) {
        expiryDate.value = expiryDate.value + "/";
      }
    };
    purchaseBtn.addEventListener("click", function () {
      axios.get("/api/checkout").then(function (results) {
        let response = results.data;
        let data = response.data;
        let totQty = 0;
        let totAmount = 0;
        let totList = [];
        cartData = data;

        data.forEach((item) => {
          totQty += item.order_qty;
          totAmount += Number(item.price);
        });
        totList.push({ totQty, totAmount });
        let template = Handlebars.compile(ordersTemplate.innerHTML);
        ordersDisplay.innerHTML = template({
          orderItems: data,
        });
        let template2 = Handlebars.compile(totalTemplate.innerHTML);
        totalDisplay.innerHTML = template2({
          totals: totList,
        });
        displayCart();
        myOrderUpdate();
        confirmRemoval();
        itemsCount();
      });
    });
  }

  checkOut();
});

/////
function ShoesServices() {
  function getShoes() {
    return axios.get("/api/shoes");
  }
  function currentShoe() {
    return axios.get("/api/shoes/current");
  }
  function shoeByBrand() {
    return axios.post("/api/shoes/brand/:brandname");
  }
  return {
    getShoes,
    currentShoe,
    shoeByBrand,
  };
}
