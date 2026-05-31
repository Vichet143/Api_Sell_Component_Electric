import express from "express";
import userRoutes from "./src/routes/UserRoute.js";
import productRoutes from "./src/routes/ProductRoute.js";
import cartRoutes from "./src/routes/CartRoute.js";
import orderRoutes from "./src/routes/OrderRoute.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});