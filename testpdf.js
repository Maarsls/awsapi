// const pdf = require("./pdf")
const Reports = require("./model/reports");


async function main() {
    // await pdf.createPdfInBuffer()
    Reports.find()
        .exec()
        .then(function (users) {
            console.log(users);
            res.send(users);
        });
    Reports.findOne({ type: "Menu-Meat" }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Result : ", docs);
        }
    });
    // Reports.findOne({ type: "Menu-Meat" })
    //     .exec()
    //     .then(async function (report) {
    //         console.log(report)
    //         await Reports.create({ type: "Menu-Meat", value: report.value + amount_meat });
    //     });
}

main()

