const ProductModel = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { NotFound, BadRequest } = require("../errors/index");

// @desc Fetch All Products
// @route /api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  let query;
  let uiValues = {
    filtering: {},
    sorting: {},
  };

  // gets the request queries and stores in an object
  const reqQuery = { ...req.query };

  // When we refresh the UI, inputs get back to their default value
  // We also want the backend to get the UI's default values and filter them
  // We filter through request params for anything that should update the UI, and then send back an object that the UI can reupdate itelf with

  // Turn the keys and values from query into an Array
  const filterKeys = Object.keys(reqQuery);
  const filterValues = Object.values(reqQuery);

  // We want to update the UI values object and change the filtering with key we are looping over, and give its value whatever the filtered value at that index is
  filterKeys.forEach(
    (value, index) => (uiValues.filtering[value] = filterValues[index])
  );

  // search
  if (req.query.name || req.query.name_fa) {
    reqQuery.$or = [
      { name: { $regex: req.query.name, $options: "i" } },
      { name_fa: { $regex: req.query.name, $options: "i" } },
    ];
    delete reqQuery.name;
    delete reqQuery.name_fa;
  }

  // Filter
  // Turn the reqQuery into json string for manipulating
  let queryString = JSON.stringify(reqQuery);

  // Add a dollar sign - $lte - change it to a format that mongoDB understands
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = ProductModel.find(JSON.parse(queryString));

  // sort ---- sort=price,rating
  if (req.query.sort) {
    const sortByArr = req.query.sort.split(",");
    // if there is filtering, we want to update the filtering state of the ui
    sortByArr.forEach((value) => {
      // specify the order, sortByArr
      let order;
      if (value[0] === "-") {
        order = "descending";
      } else {
        order = "ascending";
      }
      uiValues.sorting[value.replace("-", "")] = order;
    });
    const sortByStr = sortByArr.join(" ");
    query = query.sort(sortByStr);
  } else {
    query = query.sort("-price");
  }

  // Pagination
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;
  const skip = (page - 1) * pageSize;
  query = query.skip(skip).limit(pageSize);

  const count = await ProductModel.countDocuments({ ...req.query.name });
  const products = await query;

  const maxPrice = await ProductModel.find()
    .sort({ price: -1 })
    .limit(1)
    .select("-_id price");
  const minPrice = await ProductModel.find()
    .sort({ price: 1 })
    .limit(1)
    .select("-_id price");

  uiValues.maxPrice = maxPrice[0].price;
  uiValues.minPrice = minPrice[0].price;

  res
    .status(StatusCodes.OK)
    .json({ products, page, pages: Math.ceil(count / pageSize), uiValues });
});

// @desc Fetch a single product
// @route GET /api/products/:id
// @access public
const getProductById = asyncHandler(async (req, res) => {
  // const { id: productID } = req.params;
  const product = await ProductModel.findOne({ _id: req.params.id });

  if (!product) {
    // Create a custom error --- This is when the formation of id is correct but the product with that id does not exist
    throw new NotFound("no-product", req, { id: req.params.id });
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

  const product = await ProductModel.findById(req.params.id);
  if (product) {
    await product.remove();
    res.status(StatusCodes.OK).json({ message: req.t("product-removed") });
  } else {
    throw new NotFound("no-product", req, { id: req.params.id });
  }
});

// @desc create a product
// @route POST /api/products/
// @access private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // const product = new ProductModel({
  //   name: "Sample name",
  //   price: 0,
  //   user: req.user._id,
  //   image: "/images/sample.jpg",
  //   brand: "Sample brand",
  //   category: "Sample category",
  //   countInStock: 0,
  //   numReviews: 0,
  //   description: "Sample description",
  // });

  // const createdProduct = await product.save();
  // res.status(StatusCodes.CREATED).json(createdProduct);
  // const {
  //   name,
  //   name_fa,
  //   price,
  //   brand,
  //   brand_fa,
  //   category,
  //   category_fa,
  //   countInStock,
  //   numReviews,
  //   description,
  //   description_fa,
  // } = req.body;

  const product = new ProductModel({
    name: "Name",
    name_fa: "نام",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Brand",
    brand_fa: "نام تجاری",
    category: "Category",
    category_fa: "کتگوری",
    countInStock: 0,
    numReviews: 0,
    description: "Description",
    description_fa: "توضیحات",
  });

  const createdProduct = await product.save();
  res.status(StatusCodes.CREATED).json(createdProduct);
});

// @desc Update a product
// @route PATCH /api/products/:id
// @access private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    name_fa,
    price,
    description,
    description_fa,
    image,
    brand,
    brand_fa,
    category,
    category_fa,
    countInStock,
  } = req.body;
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    throw new NotFound("no-product", req, { id: req.params.id });
  }

  product.name = name;
  product.name_fa = name_fa;
  product.price = price;
  product.description = description;
  product.description_fa = description_fa;
  product.image = image;
  product.brand = brand;
  product.brand_fa = brand_fa;
  product.category = category;
  product.category_fa = category_fa;
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
    throw new NotFound("no-product", req, { id: req.params.id });
  }

  // review.user is what we added to modal
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    throw new BadRequest("product-reviewed", req);
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
  res.status(StatusCodes.CREATED).json({ message: req.t("review-added") });
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
