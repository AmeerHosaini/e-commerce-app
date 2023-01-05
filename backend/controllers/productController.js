const ProductModel = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors/index");

// @desc Fetch All Products
// @route /api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  // // match the keyword to the name of the product
  // // if we didnt do this we would have to put the exact name in the search box name === req.query.keyword
  // const pageSize = 3;
  // const page = Number(req.query.pageNumber) || 1;

  // const keyword = req.query.keyword
  //   ? {
  //       name: {
  //         $regex: req.query.keyword,
  //         $options: "i",
  //       },
  //     }
  //   : {};

  // const count = await ProductModel.countDocuments({ ...keyword });
  // const products = await ProductModel.find({ ...keyword })
  //   .limit(pageSize)
  //   .skip(pageSize * (page - 1));

  // res
  //   .status(StatusCodes.OK)
  //   .json({ products, page, pages: Math.ceil(count / pageSize) });

  let query;
  const { name, sort, numericFilter } = req.query;
  const queryObject = {};

  // search
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  query = ProductModel.find(queryObject);

  // sort
  if (sort) {
    const sortByArr = sort.split(",");
    sortByArr.forEach((value) => {
      let order;
      if (value[0] === "-") {
        order = "descending";
      } else {
        order = "ascending";
      }
    });
    const sortByStr = sortByArr.join(" ");
    query = query.sort(sortByStr);
  } else {
    query = query.sort("-price");
  }

  // Pagination
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;
  const skip = (page - 1) * pageSize;
  query = query.skip(skip).limit(pageSize);

  // Filter
  if (numericFilter) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regExp = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilter.replace(
      regExp,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  const count = await ProductModel.countDocuments({ ...name });
  const products = await query;
  res
    .status(StatusCodes.OK)
    .json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a single product
// @route GET /api/products/:id
// @access public
const getProductById = asyncHandler(async (req, res) => {
  const { id: productID } = req.params;
  const product = await ProductModel.findOne({ _id: productID });

  if (!product) {
    // Create a custom error --- This is when the formation of id is correct but the product with that id does not exist
    throw new NotFound(`No product was found with id ${productID}`);
  }

  res.status(StatusCodes.OK).json(product);
});

// @desc delete a product
// @route DELETE /api/products/:id
// @access private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  /*
    if (req.user._id === product.user._id) ---> Only admins that created the product can delete the product
  */

  const { id: productId } = req.params;
  const product = await ProductModel.findById(productId);
  if (product) {
    await product.remove();
    res.status(StatusCodes.OK).json({ message: "Product removed" });
  } else {
    throw new NotFound(`No product was found with id ${productId}`);
  }
});

// @desc create a product
// @route POST /api/products/
// @access private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new ProductModel({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(StatusCodes.CREATED).json(createdProduct);
});

// @desc Update a product
// @route PATCH /api/products/:id
// @access private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    throw new NotFound(`No product was found with id ${req.params.id}`);
  }

  product.name = name;
  product.price = price;
  product.description = description;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;

  const updatedProduct = await product.save();
  res.status(StatusCodes.OK).json(updatedProduct);
});

// @desc create new review
// @route POST /api/products/:id/reviews
// @access private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    throw new NotFound(`No product found with id ${req.params.id}`);
  }

  // review.user is what we added to modal
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    throw new BadRequest("Product already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;

  // average rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(StatusCodes.CREATED).json({ message: "Review added" });
});

// @desc Get top rated products
// @route GET /api/product/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
  // sort the products by ascending order
  const products = await ProductModel.find({}).sort({ rating: -1 }).limit(3);
  res.status(StatusCodes.OK).json(products);
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
