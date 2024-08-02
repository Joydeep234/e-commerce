import User from "../models/User.models.js";
import seller from "../models/seller.model.js";
import { cloudinaryupload, destroyImage } from "../utils/cloudinary.js";
import product from "../models/product.model.js";
import cart from "../models/cart.model.js";
import { getToken, verifyToken } from "../middleware/auth.js";

const dashboard = async (req, res) => {
  const data = req.user;
  return res.status(202).json({ success: "ok", data: data });
};

const signupRoute = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newuser = new User({ name, email, password });
    if (!name || !email || !password)
      return res.status(500).json({ message: "allfeilds need to be feild" });

    const userExisted = await User.findOne({ email: email });

    if (userExisted)
      return res.status(502).json({ message: "user already existed" });

    const createUser = await newuser.save();

    if (!createUser)
      return res.status(503).json({ message: "user cannot created" });
    createUser.password = undefined;
    const payload = {
      id: createUser._id,
      email: createUser.email,
    };

    const options = {
      httpOnly: true,
      secure: true,
    };
    const token = getToken(payload);
    return res
      .status(200)
      .cookie("UID", token, options)
      .json({ success: "ok", createUser });
  } catch (error) {
    console.log("login-error", error);
    res.status(401).json({ error: error });
  }
};

const loginRoute = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(500).json({ message: "allfeilds need to be feild" });

    const userExisted = await User.findOne({ email: email });

    if (!userExisted)
      return res.status(502).json({ message: "user not existed" });

    const verifypassword = await userExisted.verifyPassword(password);

    if (!verifypassword)
      return res.status(502).json({ message: "password not match" });

    userExisted.password = undefined;

    const payload = {
      id: userExisted._id,
      email: userExisted.email,
    };

    const options = {
      httpOnly: true,
      secure: true,
    };
    const token = getToken(payload);

    return res
      .status(200)
      .cookie("UID", token, options)
      .json({ success: "ok", userExisted });
  } catch (error) {
    console.log("login-error", error);
    res.status(401).json({ error: error });
  }
};

const logoutRoute = async(req,res)=>{
  try {
    const options = {
      httpOnly:true,
      secure:true,
    }
    return res.status(200)
    .clearCookie('UID',options)
    .json({success:"ok",message:"user Logout Successfully"})
  } catch (error) {
    console.log("logout-error", error);
    res.status(401).json({ error: error });
  }
}

const createSeller = async (req, res) => {
  try {
    const { location, landmark } = req.body;

    if (!location || !landmark)
      return res.status(500).json({ message: "allfeilds need to be feild" });

    const Userdetail = req.user;
    const sellerExisted = await seller.findOne({ email: Userdetail.email });

    if (sellerExisted)
      return res.status(502).json({ message: "user already existed" });
    const newseller = new seller({
      email: Userdetail.email,
      location,
      landmark,
    });
    const createSeller = await newseller.save();

    if (!createSeller)
      return res.status(503).json({ message: "seller cannot created" });

    return res.status(200).json({ success: true, createSeller });
  } catch (error) {
    console.log("login-error", error);
    res.status(401).json({ error: error });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, catagory } = req.body;
    if (!name || !description || !price || !stock || !catagory)
      return res.status(404).json({ message: "all feilds need to be filled" });
    // console.log(req.file.path);
    const localpath = req.file?.path;
    // console.log("localpath is",localpath);
    if (!localpath)
      return res.status(404).json({ error: "locally file not present" });

    const url = await cloudinaryupload(localpath);
    if (!url)
      return res
        .status(404)
        .json({ message: "not getting url from cloudinary" });

    const newProduct = new product({
      name,
      description,
      product_img_url: url,
      price,
      stock,
      catagory,
    });

    const createdproduct = await newProduct.save();
    if (!createdproduct)
      return res.status(404).json({ message: "product not created" });

    const user = req.user.email;
    const addProductToSeller = await seller.updateOne(
      { email: user },
      { $push: { sellingProducts: createdproduct._id } }
    );
    if (!addProductToSeller)
      return res.status(404).json({ message: "product not added to seller" });
    return res.status(200).json({
      message: "product successfully created",
      product_created: createdproduct,
      seller: addProductToSeller,
    });
  } catch (error) {
    console.log("product-create-error", error);
    res.status(401).json({ error: error });
  }
};

const updateProductStock = async (req, res) => {
  try {
    const { productId, stock } = req.params;

    if (!productId || !stock || stock < 0)
      return res
        .status(500)
        .json({ message: "stock cannot be empty or less than 0" });

    const update = await product.updateOne(
      { _id: productId },
      { $set: { stock: stock } }
    );
    if (!update) return res.status(500).json({ message: "stock not updated" });

    return res
      .status(200)
      .json({ success: true, message: "stock updated successfully" });
  } catch (error) {
    console.log("update_product-error", error);
    res.status(401).json({ error: error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.query.Id;
    const imageUrl = req.query.imageUrl;
    const imageArray = imageUrl.split("/");
    const image = imageArray[imageArray.length - 1];
    const imageName = image.split(".")[0];
    // console.log("ID = ",productId," imageUrl = ",imageUrl,"  image-is = ",imageName);
    if (!productId)
      return res.status(500).json({ message: "productId is empty" });

    const deleteProd = await product.findByIdAndDelete({ _id: productId });
    if (!deleteProd)
      return res.status(500).json({ message: "delete Unsuccessfull" });

    const removeInstanceFromSeller = await seller.updateOne(
      { email: req.user.email },
      { $pull: { sellingProducts: productId } }
    );

    if (removeInstanceFromSeller.nModified === 0) {
      return res.status(500).json({
        message:
          "Product removed but failed to update seller's sellingProducts",
      });
    }
    const removeImage = await destroyImage(imageName);
    if (!removeImage)
      return res.status(501).json({ message: "image cannot removed" });

    return res
      .status(200)
      .json({ success: true, message: "product deleted successfully" });
  } catch (error) {
    console.log("delete_product-error", error);
    res.status(401).json({ error: error });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const data = await product.find();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("getAllProducts -error", error);
    res.status(401).json({ error: error });
  }
};

const sellerProducts = async (req, res) => {
  try {
    const data = await seller
      .find()
      .select("sellingProducts")
      .populate("sellingProducts");
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("sellerProducts -error", error);
    res.status(401).json({ error: error });
  }
};

const addtoCart = async (req, res) => {
  try {
    const { productId, items } = req.body;
    const userId = req.user.id;
    const findUserCart = await cart.findOne({ user: userId });
    let newCart = null;
    if (!findUserCart) {
      const newcart = new cart({
        user: userId,
        items: [{ sellingProducts: productId, items: items }],
      });

      newCart = await newcart.save();

      if (!newCart)
        return res.status(404).json({ message: "cart not created" });
    } else {
      newCart = await cart.findOneAndUpdate(
        { user: userId },
        { $push: { items: { sellingProducts: productId, items: items } } },
        { new: true }
      );

      if (!newCart)
        return res.status(404).json({ message: "cart not updated" });
    }

    return res.status(200).json({ success: true, newCart });
  } catch (error) {
    console.log("add to cart-error", error);
    res.status(401).json({ error: error });
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, procedure } = req.params;
    if (!productId || !procedure)
      return res.status(500).json({ message: "params cannot be empty" });
    const userId = req.user.id;
    const findUserCart = await cart.findOne({ user: userId });
    if (!findUserCart)
      return res.status(500).json({ message: "cannot find user" });

    const getItems = findUserCart.items.filter(
      (item) => item.sellingProducts.toString() === productId
    );

    if (getItems.length == 0)
      return res.status(500).json({ message: "cannot find productId" });

    let updateItems;
    let updatedCart;

    if (procedure === "+") {
      updateItems = getItems[0].items + 1;
      await cart.updateOne(
        { user: userId, "items.sellingProducts": productId },
        { $set: { "items.$.items": updateItems } }
      );
    } else if (procedure === "-" && getItems[0].items > 1) {
      updateItems = getItems[0].items - 1;
      if (updateItems < 0) updateItems = 0;
      await cart.updateOne(
        { user: userId, "items.sellingProducts": productId },
        { $set: { "items.$.items": updateItems } }
      );
    } else if (procedure === "-" && getItems[0].items === 1) {
      const removeInstanceFromSeller = await cart.updateOne(
        { user: userId },
        {
          $pull: {
            items: {
              sellingProducts: productId,
            },
          },
        }
      );

      if (removeInstanceFromSeller.nModified === 0) {
        return res.status(500).json({
          message: "Product cannot remove from cart",
        });
      }
    }

    updatedCart = await cart.findOne({ user: userId });

    if (!updateCart)
      return res.status(500).json({ message: "cannot find Cart for the user" });

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.log("updatecart-error", error);
    res.status(401).json({ error: error });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId)
      return res.status(500).json({ message: "params cannot be empty" });
    const userId = req.user.id;

    const removeInstanceFromSeller = await cart.updateOne(
      { user: userId },
      {
        $pull: {
          items: {
            sellingProducts: productId,
          },
        },
      }
    );

    if (removeInstanceFromSeller.nModified === 0) {
      return res.status(500).json({
        message: "Product cannot remove from cart",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "product deleted successfully" });
  } catch (error) {
    console.log("deletecart-error", error);
    res.status(401).json({ error: error });
  }
};

const showCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const shwcart = await cart
      .findOne({ user: userId })
      .populate("items.sellingProducts");
    if (!shwcart)
      return res.status(404).json({ message: "there is no cart present" });

    return res.status(200).json({ success: true, shwcart });
  } catch (error) {
    console.log("showcart-error", error);
    res.status(401).json({ error: error });
  }
};
export {
  dashboard,
  signupRoute,
  loginRoute,
  logoutRoute,
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
};

//payload: _id,email
