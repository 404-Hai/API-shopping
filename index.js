const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();

const dotenv = require("dotenv");
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

dotenv.config();
mongoose.connect(
    process.env.MONGO_URL
    ).then(()=>console.log("DBConnection Successfully"))
    .catch((err)=>{
        console.log(err)
    });

app.use(express.json());    
app.use('/api/users',userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend sever is running: http://localhost:5000`)
})
