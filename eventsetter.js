require("dotenv").config();
require("./config/database").connect();
const Events = require("./model/events");
const mycrypto = require("./mycrypto")

async function main() {
    /*const eventRes = await Events.create(
        {
            event: "test-tyvent",
            key: mycrypto.encrypt("46f29735-c58a-4e29-ac31-c53279c28e80"),
            tickets: {
                shopifyId: 6793446785093,
                variants: [
                    {
                        id: 40221816619077, type: "Erwachsen"
                    }, {
                        id: 40221816651845, type: "Jugend"
                    }
                ]
            },
            menus: {
                shopifyId: 6793622421573,
                variants: [
                    {
                        id: 40225790820421, type: "Menu-Meat"
                    }, {
                        id: 40225790853189, type: "Menu-Fish"
                    },
                    {
                        id: 40225790885957, type: "Menu-Veggy"
                    }
                ]
            }
        })

    console.log(eventRes)*/
    Events.updateOne({ event: "test-tyvent" }, { key: mycrypto.encrypt("15bd544601a267da2638a070c688bc97cfd86558a762e5701e9415f4dbe417a3") }, function (
        err,
        result
    ) {
        if (err) {
            console.log(err)
        } else {
            console.log(res)
        }
    });
}

main()