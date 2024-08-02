import {Router} from 'express'
import { getToken, verifyToken } from "../middleware/auth.js";
import upload from '../middleware/multer.js';
import {
  dashboard,
  signupRoute,
  loginRoute,
  createSeller,
  createProduct,
  updateProductStock,
  deleteProduct,
  getAllProducts,
  sellerProducts,
  addtoCart,
  updateCart,
  deleteCart,
  showCart,
  logoutRoute,
} from "../controllers/user.controllers.js";

const router = Router()

router.route('/').get(verifyToken,dashboard)
router.route("/signup").post(signupRoute);
router.route("/login").post(loginRoute);
router.route("/logout").get(logoutRoute);

//seller items..................

router.route("/seller").post(verifyToken,createSeller);
router.route("/sellerproducts").get(verifyToken, sellerProducts);

//all products .............

router.route("/createproduct").post(verifyToken, upload.single("products"), createProduct);
router.route("/updateproduct/:productId/:stock").put(verifyToken, updateProductStock);
router.route("/deleteproduct/").delete(verifyToken, deleteProduct);
router.route("/showproducts").get(verifyToken, getAllProducts);

// cart...................
router.route("/addtocart").post(verifyToken, addtoCart);
router.route("/updatecart/:productId/:procedure").put(verifyToken, updateCart);
router.route("/deletecart/:productId").delete(verifyToken, deleteCart);
router.route("/showcart").get(verifyToken, showCart);

export {
    router
}