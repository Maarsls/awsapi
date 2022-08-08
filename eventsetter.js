const Events = require("./model/events");
const mycrypto = require("./mycrypto")

async function main() {
    console.log(mycrypto.encrypt("46f29735-c58a-4e29-ac31-c53279c28e80"))
    const eventRes = await Events.create(
        {
            event: "test",
            key: "adsf",
            tickets: {
                shopifyId: 123423456,
                variants: [{
                    id: 13241234, type: "Erwachsen"
                }, {
                    id: 8979184, type: "Jugend"
                }]
            },
            menus: {
                shopifyId: 6798790,
                variants: [{
                    id: 9076896789, type: "FLEISCH"
                }, {
                    id: 12345678, type: "FISCH"
                }]
            }
        })

    console.log(eventRes)
}

main()