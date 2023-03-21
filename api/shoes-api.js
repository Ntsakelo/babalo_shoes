import ShortUniqueId from "short-unique-id";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

let uid = new ShortUniqueId({ length: 5 });

export default function (ShoesData) {
  let id = uid();
  async function getCategories(req, res, next) {
    try {
      let results = await ShoesData.categories();
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function registerUser(req, res, next) {
    try {
      let password = await bcrypt.hash(req.body.password, 10);
      let userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: password,
      };
      let results = await ShoesData.checkUser(userData);
      if (Number(results.count) > 0) {
        return res.json({
          status: "The user already exists",
        });
      } else {
        await ShoesData.register(userData);
        res.json({
          status: "Registration was successful",
        });
      }
    } catch (err) {
      next(err);
    }
  }
  async function login(req, res, next) {
    try {
      let email = req.body.loginEmail;
      let user = await ShoesData.getUser(email);
      if (!user) {
        return res.json({
          status: "User does not exist",
        });
      } else {
        let isPassword = await bcrypt.compare(req.body.password, user.password);
        if (isPassword) {
          const payLoad = {
            id: user.id,
          };

          const token = Jwt.sign(payLoad, `${process.env.SECRET_KEY}`, {
            expiresIn: "1d",
          });
          res.cookie("access_token", token, { httpOnly: true }).json({
            firstname: user.firstname,
            status: "Logged in",
          });
        } else {
          return res.json({
            status: "Incorrect password",
          });
        }
      }
    } catch (err) {
      next(err);
    }
  }
  async function checkLogin(req, res, next) {
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return res.json({
          status: "No login",
        });
      }
      Jwt.verify(
        token,
        `${process.env.SECRET_KEY}`,
        async function (err, userId) {
          if (err) {
            return res.json({
              status: "Invalid token",
            });
          }
          let results = await ShoesData.getUserById(userId.id);
          res.json({
            data: results,
          });
        }
      );
    } catch (err) {
      next(err);
    }
  }
  async function logout(req, res, next) {
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return;
      } else {
        res.clearCookie("access_token");
        res.json({
          status: "Logout successful",
        });
      }
    } catch (err) {
      next(err);
    }
  }
  async function showByCategory(req, res, next) {
    try {
      let category = req.params.category;
      let results = await ShoesData.filterCategory(category);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function displayProducts(req, res, next) {
    try {
      req.session.user = id;
      let results = await ShoesData.allShoes();
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function getShoe(req, res, next) {
    try {
      let id = Number(req.params.id);
      let results = await ShoesData.selectedShoe(id);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function showBrands(req, res, next) {
    try {
      let results = await ShoesData.brands();
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function showSizes(req, res, next) {
    try {
      let results = await ShoesData.sizes();
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function showColors(req, res, next) {
    try {
      let results = await ShoesData.colors();
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function searchBrand(req, res, next) {
    try {
      let brand = req.params.brandname;
      let results = await ShoesData.searchByBrand(brand);

      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function searchSize(req, res, next) {
    try {
      let size = Number(req.params.size);
      let results = await ShoesData.searchBySize(size);

      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function searchColor(req, res, next) {
    try {
      let color = req.params.color;
      let results = await ShoesData.searchByColor(color);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function searchBrandColor(req, res, next) {
    try {
      let brand = req.params.brandname;
      let color = req.params.color;
      let results = await ShoesData.searchByBrandColor(brand, color);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function searchSizeColor(req, res, next) {
    try {
      let size = Number(req.params.size);
      let color = req.params.color;
      let results = await ShoesData.searchBySizeColor(size, color);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }

  async function searchBrandSize(req, res, next) {
    try {
      let brand = req.params.brandname;
      let size = Number(req.params.size);
      let results = await ShoesData.searchByBrandSize(brand, size);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function searchAll(req, res, next) {
    try {
      let brand = req.params.brandname;
      let size = Number(req.params.size);
      let color = req.params.color;
      if (brand === undefined) {
        brand = "";
      }
      if (color === undefined) {
        color = "";
      }
      let results = await ShoesData.searchByAll(brand, size, color);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function addToCart(req, res, next) {
    try {
      let id = Number(req.params.id);
      let size = Number(req.params.size);
      let qty = Number(req.params.qty);
      let sessionId = req.session.user;
      await ShoesData.addItem(id, size, qty, sessionId);
      res.json({
        status: "success",
      });
    } catch (err) {
      next(err);
    }
  }
  async function countItems(req, res, next) {
    try {
      let sessionId = req.session.user;
      let results = await ShoesData.cartCount(sessionId);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function viewCart(req, res, next) {
    try {
      let sessionId = req.session.user;
      let results = await ShoesData.displayCart(sessionId);

      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function qtyUpdate(req, res, next) {
    try {
      let qty = Number(req.params.qty);
      let orderId = Number(req.params.orderId);
      let sessionId = req.session.user;
      console.log(orderId);
      let results = await ShoesData.updtQty(orderId, qty, sessionId);

      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function confirm(req, res, next) {
    try {
      let orderId = Number(req.params.id);

      let results = await ShoesData.confirmData(orderId);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function remove(req, res, next) {
    try {
      let orderId = Number(req.params.id);
      let sessionId = req.session.user;
      let results = await ShoesData.removeItem(orderId, sessionId);
      res.json({
        status: "success",
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }
  async function checkOut(req, res, next) {
    try {
      let sessionId = req.session.user;
      let customerId = req.user.id;

      await ShoesData.checkOutItems(sessionId, customerId.id);
    } catch (err) {
      next(err);
    }
  }
  async function orders(req, res, next) {
    try {
      res.json("You have access to the orders route");
    } catch (err) {
      next(err);
    }
  }
  return {
    getCategories,
    registerUser,
    login,
    checkLogin,
    logout,
    displayProducts,
    getShoe,
    showBrands,
    showSizes,
    showColors,
    searchBrand,
    searchSize,
    searchColor,
    searchBrandColor,
    searchSizeColor,
    searchBrandSize,
    searchAll,
    showByCategory,
    addToCart,
    countItems,
    viewCart,
    qtyUpdate,
    confirm,
    remove,
    checkOut,
    orders,
  };
}
