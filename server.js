const express = require("express")
const router = require("./routes")
const app = express()
const morgan = require("morgan")


if (process.env.NODE_ENV === "development") {
    app.use(morgan("tiny"))
}

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use("/", router)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

module.exports = app