const express = require("express");
const router = express.Router();
const CategoryController = require("../CONTROLLERS/category_con");
const CheckAPI = require("../MIDDLEWARES/check_api");

router.post("/", CheckAPI, (req, res, next) => {
  const body = req.body;
  CategoryController.save_category(body)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/", CheckAPI, (req, res, next) => {
  CategoryController.find_categories()
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.delete("/:id", CheckAPI, (req, res, next) => {
  const id = req.params.id;
  CategoryController.remove_category(id)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

module.exports = router;
