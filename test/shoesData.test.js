import assert from "assert";
import ShoesData from "../shoesData.js";
import pgPromise from "pg-promise";

const pgp = pgPromise();
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://coder:pg123@localhost:5432/shoes_cart_tests";

const db = pgp({ connectionString });

describe("test the shoes catalogue database functions", function () {
  beforeEach(async function () {
    try {
      await db.none("delete from orders");
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to return all shoes in the products table", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.allShoes();

      assert.equal(21, results.length);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to return all the shoes categories", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.categories();
      assert.deepEqual(
        [
          { category: "All" },
          { category: "Kids" },
          { category: "Men" },
          { category: "Women" },
        ],
        results
      );
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to return a selected shoe", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.selectedShoe(1);
      assert.equal("Ivonia high heels", results.edition);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to return all shoe brands", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.brands();
      assert.equal(10, results.length);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to return all shoe sizes", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.sizes();
      assert.equal(9, results.length);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to return all shoe colors", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.colors();
      assert.equal(11, results.length);
    } catch (err) {
      console.log(err);
    }
  });
  it("it should be able to search shoes by a brand", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.searchByBrand("Baby Json");
      assert.equal("Baby Json", results[0].brand);
      assert.equal("Baby Json", results[1].brand);
      assert.equal("Baby Json", results[2].brand);
      assert.equal("Baby Json", results[3].brand);
      assert.equal("Baby Json", results[4].brand);
    } catch (err) {
      console.log(err);
    }
  });
  it("it should be able to search shoes by size", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.searchBySize(9);

      assert.equal(9, results[0].size);
      assert.equal(9, results[1].size);
      assert.equal(9, results[2].size);
      assert.equal(9, results[3].size);
      assert.equal(9, results[4].size);
      assert.equal(9, results[5].size);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to search shoes by color", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.searchByColor("Red");
      assert.equal("Red", results[0].color);
      assert.equal("Red", results[1].color);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to search shoes by brand and color", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.searchByBrandColor("Superba", "Black");
      assert.equal("Superba", results[0].brand);
      assert.equal("Black", results[0].color);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to search shoes by size and color", async function () {
    try {
      const shoesData = ShoesData(db);
      let results = await shoesData.searchBySizeColor(7, "Black");
      assert.equal(7, results[0].size);
      assert.equal("Black", results[0].color);
      assert.equal(7, results[1].size);
      assert.equal("Black", results[1].color);
    } catch (err) {
      console.log(err);
    }
  });
  after(function () {
    db.$pool.end;
  });
});
