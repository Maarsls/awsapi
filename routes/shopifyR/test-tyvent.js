var router = require("express").Router();
const auth = require("../../middleware/auth");
const axios = require("axios");
const Shopify = require("@shopify/shopify-api")

const api = axios.create({
  baseURL: `https://test-tyvent.myshopify.com/admin/api/2022-07`, // vlt muss man .myhopify azuch durch domain ersetzten
});

router.get("/allProducts", async (req, res) => {
  console.log("mach");
  const resp = await api.get("/products.json", {
    headers: {
      "X-Shopify-Access-Token": process.env.CLIENT_TESTTYVENT_TOKEN,
    },
  });
  res.send(resp.data.products);
});
router.get("/allPromotions", async (req, res) => {
  console.log("mach");
  const resp = await api.get("/price_rules/1056537116741/discount_codes.json", {
    headers: {
      "X-Shopify-Access-Token": process.env.CLIENT_TESTTYVENT_TOKEN,
    },
  });
  res.send(resp.data.discount_codes);
});

router.get("/allOrders", async (req, res) => {
  console.log("mach");
  const resp = await api.get("/orders.json?status=any", {
    headers: {
      "X-Shopify-Access-Token": process.env.CLIENT_TESTTYVENT_TOKEN,
    },
  });
  res.send(resp.data.orders);
});

router.get("/allCustomers", async (req, res) => {
  console.log("mach");
  const resp = await api.get("/customers.json", {
    headers: {
      "X-Shopify-Access-Token": process.env.CLIENT_TESTTYVENT_TOKEN,
    },
  });
  res.send(resp.data.customers);
});

router.get("/allBlogs", async (req, res) => {
  console.log("mach");
  const resp = await api.get("/blogs/78464614469/articles.json", {
    headers: {
      "X-Shopify-Access-Token": process.env.CLIENT_TESTTYVENT_TOKEN,
    },
  });
  res.send(resp.data.articles);
});

router.get("/report", async (req, res) => {
  const client = new Shopify.Clients.Graphql(
    "test-tyvent.myshopify.com",
    process.env.CLIENT_TESTTYVENT_TOKEN
  );
  const data = await client.query({
    data: `{
    shopifyqlQuery(query: "from sales show total_sales by month since -1y until today") {
      __typename
      ... on TableResponse {
        tableData {
          rowData
          columns {
            name
            dataType
            displayName
          }
        }
      }
      parseErrors {
        code
        message
        range {
          start {
            line
            character
          }
          end {
            line
            character
          }
        }
      }
    }
  }`,
  });
});

router.post("/", auth, async (req, res) => {
  const entryRes = await Blog.create(req.body.entry);

  res.send(entryRes);
});

module.exports = router;
