const express = require("express");
const bodyParser = require("body-parser");
const productRouter = express.Router();
const reader = require("xlsx");

let data = [];

productRouter.use(bodyParser.json());
productRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res) => {

        if (data.length == 0) {
            
            let workbook = reader.readFile('./uploads/product_list.xlsx')
            
            // Extract Data (create a workbook object from the table)
            // Process Data (add a new row)
            const temp = reader.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            temp.forEach((res) => {
                data.push(res);
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    });

productRouter.route("/:productId")
    .get((req, res) => {
        var detail = []
        for (var i = 0; i < data.length; i++) {
            if (data[i]['product_code'] === req.params.productId) {
                var temp = data[i];
                detail.push({ "status": res.statusCode, "data": temp })

            }
        }
        if (detail.length != 0) {

            res.setHeader('Content-Type', 'application/json');
            res.json(detail);

        }
        else {
            res.statusCode = 404
            detail.push({ "status": res.statusCode, "message": "Product is not found!" })
            res.setHeader('Content-Type', 'application/json');
            res.json(detail);
        }
    })
    .put((req, res) => {
        for (var i = 0; i < data.length; i++) {
            if (data[i]['product_code'] === req.params.productId) {
                data[i]['price'] = req.body.price;

            }
        }
        const workSheet = reader.utils.json_to_sheet(data);
        // Create a new Workbook
        const workBook = reader.utils.book_new();
        
        // Append a Worksheet to a Workbook
        reader.utils.book_append_sheet(workBook, workSheet, "Sheet1")

        // Generate buffer bookType property of the opts argument.type option, the data can be stored as a "binary string", JS string, Uint8Array or Buffer.
        reader.write(workBook, { bookType: 'xlsx', type: "buffer" })

        // Binary string
        reader.write(workBook, { bookType: "xlsx", type: "binary" })
        // Package and Release Data (`writeFile` tries to write and save an XLSX file)
        reader.writeFile(workBook, "./uploads/product_list.xlsx")
        res.end(req.body.price + " price updated")
    })

module.exports = productRouter;
