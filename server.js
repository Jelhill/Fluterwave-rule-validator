const express = require("express")
const router = require("./routes")
const app = express()
const morgan = require("morgan")
const cors = require("cors")


if (process.env.NODE_ENV === "development") {
    app.use(morgan("tiny"))
}

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({credentials: true, origin: '*'}));

app.use("/", router)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

module.exports = app