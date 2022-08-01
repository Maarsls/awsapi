const pdf = require("./pdf")

async function main(){
    await pdf.createPdfInBuffer()
}

main()