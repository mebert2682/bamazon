DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  dept_name VARChAR(100) NOT NULL,
  price DECIMAL (10, 2) default 0,
  stock_qty INTEGER default 0,
  PRIMARY KEY(item_id)
);

INSERT INTO products
  (product_name, dept_name, price, stock_qty)
VALUES
  ("Fruity Pebbles", "Cereal", 2.99, 20),
  ("Milk", "Dairy", 3.99, 15),
  ("Eggs", "Dairy", 1.99, 25),
  ("Bread", "Dry Goods", 2.99, 10),
  ("Ice Cream", "Frozen Desserts", 3.99, 15),
  ("Water", "Beverages", 0.99, 40),
  ("Rice", "Grains", 1.99, 30),
  ("Rotiserrie Chicken", "Poultry", 5.99, 35),
  ("Ahi Tuna", "Seafood", 19.99, 10);

SELECT * FROM products