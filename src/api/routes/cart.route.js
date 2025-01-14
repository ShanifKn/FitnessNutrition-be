import CartService from "../../services/cart.service.js";
import { tryCatch } from "../../utils/index.js";
import Authentication from "../middlewares/authentication.js";
import Validate from "../validations/validator.js";

const CartRouter = (app) => {
  const service = new CartService();

  // @route   GET /
  // @des     get all a pending products
  // @access  Private
  app.post(
    "/create-carts",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const user = req.user._id;

      const { productId, quantity } = req.body;

      const data = await service.Create({ user, productId, quantity });

      return res.status(200).json({ data });
    })
  );

  app.patch(
    "/update-cart",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const user = req.user._id;

      const { productId, quantity } = req.body;


      const data = await service.UpdateCart({ user, productId, quantity });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/cart",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.user;

      const data = await service.GetCarts({ _id });

      return res.status(200).json({ data });
    })
  );

  app.get(
    "/wishlist",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.user;

      const data = await service.GetWishlist({ _id });

      return res.status(200).json({ data });
    })
  );

  app.patch(
    "/update-wishlist",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id, items } = req.body;

      const data = await service.UpdateWishlist({ _id, items });

      return res.status(200).json({ data });
    })
  );

  app.post(
    "/create-wishlist",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const items = req.body;

      const user = req.user._id;

      const data = await service.CreateWishlist({ user, items });

      return res.status(200).json({ data });
    })
  );

  app.delete(
    "/wishlist/:_id",
    Authentication,
    Validate,
    tryCatch(async (req, res) => {
      const { _id } = req.params;

      const userId = req.user._id;

      const { message } = await service.DeleteProductFromWishlist({ userId, _id });

      return res.status(200).json({ message });
    })
  );
};

export default CartRouter;
