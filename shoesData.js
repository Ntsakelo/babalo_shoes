export default function ShoesData(db) {
  async function categories() {
    try {
      let results = await db.manyOrNone(
        "select distinct category from products order by category asc"
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function allShoes() {
    try {
      let results = await db.manyOrNone(
        "select distinct products.id , category, brand, item AS edition, color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id ORDER BY products.id;"
      );

      return results;
    } catch (err) {
      console.log(err);
    }
  }

  async function brands() {
    try {
      let results = await db.manyOrNone(
        "select distinct brand from products order by brand asc"
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function sizes() {
    try {
      let results = await db.manyOrNone(
        "select distinct size from stock order by size asc"
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function colors() {
    try {
      let results = await db.manyOrNone(
        "select distinct color from stock order by color asc"
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function searchByBrand(brand) {
    try {
      if (brand) {
        let results = await db.manyOrNone(
          "select distinct products.id , category, brand, item AS edition,color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where brand =$1 order by products.id",
          [brand]
        );
        return results;
      } else {
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function searchBySize(size) {
    try {
      let results = await db.manyOrNone(
        "select distinct products.id , category, brand, item AS edition,size,color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where size =$1 order by products.id",
        [size]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function searchByColor(color) {
    try {
      let results = await db.manyOrNone(
        "select distinct products.id , category, brand, item AS edition,color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where color =$1 order by products.id",
        [color]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function searchByBrandColor(brand, color) {
    try {
      let results = await db.manyOrNone(
        "select distinct products.id , category, brand, item AS edition,color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where color =$1 and brand=$2 order by products.id",
        [color, brand]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }

  //
  async function searchBySizeColor(size, color) {
    try {
      let results = await db.manyOrNone(
        "select distinct products.id , category, brand, item AS edition,color,size,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where color =$1 and size=$2 order by products.id",
        [color, size]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function searchByBrandSize(brand, size) {
    try {
      let results = await db.manyOrNone(
        "select distinct products.id , category, brand, item AS edition,size,color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where brand =$1 and size=$2 order by products.id",
        [brand, size]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function searchByAll(brand, size, color) {
    try {
      let results = await db.manyOrNone(
        "select distinct products.id,category,brand,item AS edition,color,size,price,sale_price,image_url from products JOIN stock ON products.id = stock.item_id where brand =$1 and color =$2 and size=$3 order by products.id",
        [brand, color, size]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function filterCategory(category) {
    try {
      if (category === "All") {
        let results = await db.manyOrNone(
          "select distinct products.id , category, brand, item AS edition, color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id ORDER BY products.id;"
        );
        return results;
      } else {
        let results = await db.manyOrNone(
          "select distinct products.id , category, brand, item AS edition, color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where category = $1 ORDER BY products.id;",
          [category]
        );
        return results;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function selectedShoe(id) {
    try {
      if (id) {
        let results = await db.oneOrNone(
          "select  products.id , category, brand, item AS edition, color,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where stock.item_id = $1 limit 1",
          [id]
        );
        let sizeQty = await db.manyOrNone(
          "select size,stock_qty from stock where item_id=$1",
          [id]
        );
        if (results.quantities === undefined) {
          results.quantities = sizeQty;
        }

        return results;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function addItem(id, size, qty, sessionId) {
    try {
      if (qty === 0) {
        return;
      }
      let results = await db.oneOrNone(
        "select distinct products.id , category, brand, item AS edition,color,size,price,sale_price, image_url from products JOIN stock ON products.id = stock.item_id where products.id =$1 and size=$2",
        [id, size]
      );
      let color = results.color;
      let item = results.edition;
      let price =
        Number(results.sale_price) > 0 ? results.sale_price : results.price;
      let totalAmount = price * qty;
      let stockId = await db.oneOrNone(
        "select id from stock where item_id = $1 and size = $2 and color = $3",
        [id, size, color]
      );
      let count = await db.oneOrNone(
        "select count(*) from cart_items where item_id =$1 and size=$2 and color=$3",
        [id, size, color]
      );
      if (Number(count.count) > 0) {
        return;
      } else {
        await db.none(
          "insert into cart_items(sessionid,item_id,stock_id,item,color,size,order_qty,price) values($1,$2,$3,$4,$5,$6,$7,$8)",
          [sessionId, id, stockId.id, item, color, size, qty, totalAmount]
        );

        await db.none(
          "update stock set stock_qty =stock_qty - $1 where id = $2 and size=$3",
          [qty, stockId.id, size]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function cartCount(sessionId) {
    try {
      let results = await db.oneOrNone(
        "select count(*) from cart_items where sessionid=$1",
        [sessionId]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function displayCart(sessionId) {
    try {
      let count = await db.manyOrNone(
        "select count(*) from cart_items where sessionid=$1",
        [sessionId]
      );
      if (Number(count.count) <= 0) {
        return;
      }
      let results = await db.manyOrNone(
        "select cart_items.id, cart_items.item as edition,cart_items.color,cart_items.size,order_qty,stock_qty,cart_items.price,image_url from cart_items join products on cart_items.item_id = products.id join stock on cart_items.stock_id = stock.id where cart_items.sessionid = $1 order by cart_items.id",
        [sessionId]
      );

      return results;
    } catch (err) {
      console.log(err);
    }
  }

  async function updtQty(orderId, qty, sessionId) {
    try {
      let resultQty = await db.oneOrNone(
        "select order_qty from cart_items where id = $1",
        [orderId]
      );
      let resultId = await db.oneOrNone(
        "select item_id from cart_items where id = $1",
        [orderId]
      );
      let resultsPrice = await db.oneOrNone(
        "select price,sale_price from products where id=$1",
        [resultId.item_id]
      );

      let amount = Number(resultsPrice.price);
      let saleAmnt = Number(resultsPrice.sale_price);
      let priceAmount;
      if (saleAmnt > 0) {
        priceAmount = saleAmnt;
      }
      if (saleAmnt <= 0) {
        priceAmount = amount;
      }
      if (qty > resultQty.order_qty) {
        let orderQty = await db.oneOrNone(
          "select order_qty from cart_items where id=$1",
          [orderId]
        );
        let Quantity = orderQty.order_qty;
        let size = await db.oneOrNone(
          "select size from cart_items where id=$1",
          [orderId]
        );
        await db.none(
          "update stock set stock_qty = stock_qty + $1 where item_id=$2 and size=$3",
          [Quantity, resultId.item_id, size.size]
        );
        await db.none("update cart_items set order_qty = $1 where id=$2", [
          qty,
          orderId,
        ]);

        await db.none("update cart_items set price = $1 * $2 where id = $3", [
          priceAmount,
          qty,
          orderId,
        ]);

        await db.none(
          "update stock set stock_qty = stock_qty - $1 where item_id=$2 and size=$3",
          [qty, resultId.item_id, size.size]
        );
      } else if (qty < resultQty.order_qty) {
        let orderQty = await db.oneOrNone(
          "select order_qty from cart_items where id=$1",
          [orderId]
        );
        let Quantity = orderQty.order_qty;
        let size = await db.oneOrNone(
          "select size from cart_items where id=$1",
          [orderId]
        );
        await db.none(
          "update stock set stock_qty = stock_qty + $1  where item_id=$2 and size=$3",
          [Quantity, resultId.item_id, size.size]
        );
        await db.none("update cart_items set order_qty = $1 where id=$2", [
          qty,
          orderId,
        ]);

        await db.none("update cart_items set price = $1 * $2 where id = $3", [
          priceAmount,
          qty,
          orderId,
        ]);

        await db.none(
          "update cart_items set price = $1 * $2 where id = $3 and item_id=$4",
          [amount, qty, orderId, resultId.item_id]
        );

        await db.none(
          "update stock set stock_qty = stock_qty - $1 where item_id=$2 and size=$3",
          [qty, resultId.item_id, size.size]
        );
      }

      let results = await db.manyOrNone(
        "select cart_items.id, cart_items.item as edition,cart_items.color,cart_items.size,order_qty,stock_qty,cart_items.price,image_url from cart_items join products on cart_items.item_id = products.id join stock on cart_items.stock_id = stock.id where cart_items.sessionid=$1",
        [sessionId]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  ///removal
  async function confirmData(orderId) {
    try {
      let results = await db.oneOrNone("select item from orders where id=$1", [
        orderId,
      ]);
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function removeItem(orderId, sessionId) {
    try {
      let results = await db.oneOrNone(
        "select item_id,size,color,order_qty from cart_items where id=$1",
        [orderId]
      );
      let itemId = results.item_id;

      let size = results.size;
      let color = results.color;
      let qty = results.order_qty;
      await db.none(
        "update stock set stock_qty = stock_qty + $1 where item_id = $2 and color =$3 and size=$4",
        [qty, itemId, color, size]
      );

      await db.none("delete from cart_items where id=$1", [orderId]);
      let cartRslts = await db.manyOrNone(
        "select cart_items.id, cart_items.item as edition,cart_items.color,cart_items.size,order_qty,stock_qty,cart_items.price,image_url from cart_items join products on cart_items.item_id = products.id join stock on cart_items.stock_id = stock.id where cart_items.sessionid=$1 order by cart_items.id ",
        [sessionId]
      );
      return cartRslts;
    } catch (err) {
      console.log(err);
    }
  }
  async function checkOutItems(sessionId, customerId) {
    try {
      let allReslts = await db.manyOrNone(
        "select * from cart_items where sessionid = $1",
        [sessionId]
      );

      let data;
      allReslts.forEach((item) => {
        let date = new Date();
        let status = "processing";
        data = [
          customerId,
          item.item_id,
          item.stock_id,
          item.item,
          item.color,
          item.size,
          item.order_qty,
          item.price,
          date,
          status,
        ];
      });

      await db.none(
        "insert into orders(customer_id,item_id,stock_id,item,color,size,order_qty,price,order_date,order_status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
        data
      );

      await db.none("delete from cart_items");
      let results = await db.manyOrNone(
        "select cart_items.id, cart_items.item as edition,cart_items.color,cart_items.size,order_qty,stock_qty,cart_items.price,image_url from cart_items join products on cart_items.item_id = products.id join stock on cart_items.stock_id = stock.id  order by cart_items.id"
      );
      console.log(results);
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function checkUser(data) {
    try {
      let results = await db.oneOrNone(
        "select count(*) from customers where firstname = $1 and surname = $2",
        [data.firstName, data.lastName]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function register(data) {
    try {
      let results = await db.oneOrNone(
        "select count(*) from customers where firstname = $1 and surname = $2",
        [data.firstName, data.lastName]
      );
      if (Number(results.count) > 0) {
        return;
      } else {
        let userData = [
          data.firstName,
          data.lastName,
          data.email,
          data.password,
        ];
        await db.none(
          "insert into customers(firstname,surname,email,password) values($1,$2,$3,$4)",
          userData
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getUser(email) {
    try {
      let results = await db.oneOrNone(
        "select * from customers where email = $1",
        [email]
      );
      if (!results) {
        return;
      } else {
        return results;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getUserById(id) {
    try {
      let results = await db.oneOrNone(
        "select firstname from customers where id=$1",
        [id]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  ///ADMIN LOGIC
  async function getLogin(user, password) {
    try {
      let results = await db.oneOrNone(
        "select * from employees where firstname = $1 and user_password = $2",
        [user, password]
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function productsList() {
    try {
      let results = await db.manyOrNone(
        "select  products.id,brand, item AS edition,price,size,stock_qty,color from products JOIN stock ON products.id = stock.item_id ORDER BY products.id;"
      );
      return results;
    } catch (err) {
      console.log(err);
    }
  }

  async function updateStock(edition, size, color, quantity) {
    try {
      let itemId = await db.oneOrNone("select id from products where item=$1", [
        edition,
      ]);
      let results = await db.oneOrNone(
        "select count(*) from stock where item_id = $1 and size = $2 and color = $3",
        [itemId.id, size, color]
      );

      if (Number(results.count) === 0) {
        await db.none(
          "insert into stock(item_id,color,size,stock_qty) values($1,$2,$3,$4)",
          [itemId.id, color, size, quantity]
        );
      } else if (Number(results.count > 0)) {
        await db.none(
          "update stock set stock_qty = stock_qty + $1 where item_id = $2 and size = $3 and color = $4",
          [quantity, itemId.id, size, color]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getEdition() {
    try {
      let results = await db.manyOrNone("select item from products");
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function createSale(edition, price) {
    try {
      await db.none("update products set sale_price = $1 where item = $2", [
        price,
        edition,
      ]);
    } catch (err) {
      console.log(err);
    }
  }
  return {
    categories,
    allShoes,
    selectedShoe,
    brands,
    sizes,
    colors,
    searchByBrand,
    searchBySize,
    searchByColor,
    searchByBrandColor,
    searchBySizeColor,
    searchByBrandSize,
    searchByAll,
    filterCategory,
    addItem,
    cartCount,
    displayCart,
    updtQty,
    getLogin,
    productsList,
    updateStock,
    getEdition,
    confirmData,
    removeItem,
    checkOutItems,
    createSale,
    checkUser,
    register,
    getUser,
    getUserById,
  };
}
