var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.DB_PW,
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the readProducts function after the connection is made to prompt the user
  // readProducts();
  buyItems();
});


// function readProducts() {
//   console.log("Selecting all products...\n");
//   connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     buyItems();
//   });
// }

// function buyItems() {
//   // query the database for all items that can be purchased
//   connection.query("SELECT item_id, product_name, price FROM products", function(err, results) {
//     if (err) throw err;
//     // once we have the items, prompt the user for which they'd like to buy
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_id + " " + results[i].product_name + " " + results[i].price);
//             }
//             return choiceArray;
//           },
//           message: "What product would you like to purchase? Enter the product's item_id."
//         },
//         {
//           name: "item",
//           type: "input",
//           message: "How many would you like to purchase?"
//         }
//       ])
//       .then(function(answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].product_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if there is enough stock
//         if (chosenItem.stock_qty > parseInt(answer.item)) {
//           // stock_qty was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE products SET ? WHERE ?",
//             [
//               {
//                 stock_qty: stock_qty - answer.item
//               },
//               {
//                 item_id: chosenItem.item_id
//               }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Order for item placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // not enough in stock, apologize and start over
//           console.log("Unfortunately, we do not have enough in stock. Try again...");
//           buyItems();
//         }
//       });
//   });
// }

function buyItems() {
  // select all items from our database
  connection.query("SELECT * FROM products", function(err, itemData) {

    if (err) throw err;

    // ask user what they would like tobuy and how much
    inquirer.prompt([
      {
        name: "item_name",
        message: "What item would you like to purchase?",
        type: "list",
        choices: itemData
          .map(item => item.product_name)
          
      },
      
      {
        name: "buy_amount",
        message: "How much would you like to buy?",
        validate: function(amountValue) {
          if (!isNaN(amountValue)) {
            return true;
          }
          else {
            return "Please enter a number!"
          }
        }
      }
    ]).then(function(purchaseData) {
      // purchaseData => {product_name: "Fruity Pebbles", buy_amount: 10.00}

      // extract what item we're buying in using .find()
      var purchasedItem = itemData.find(item => item.item_name === purchaseData.product_name)

      // console.log(purchaseData);
      // console.log(purchasedItem);
      
      
      // if selectedItem.stock_qty < user's buy amount, do nothing
      if (purchasedItem.stock_qty < purchaseData.buy_amount) {
        console.log("We don't have that much in stock!");
        return buyItems();
      }

      // else update that item's entry in the database with the new stock_qty
      var updatedStock = purchasedItem.stock_qty - purchaseData.buy_amount;

      console.log(updatedStock)

      connection.query("UPDATE products SET stock_qty = ? WHERE item_id = ?", [updatedStock, purchasedItem.item_id],
      
      function(err, res) {

        if (err) throw err;
        console.log("You're purchase for " + purchasedItem.product_name + " is now complete!");

        return buyItems();

      });

    });

  });


}


