const express = require("express");
const router = express.Router();
const AdminController = require("../CONTROLLERS/admin_con");
const CheckAPI = require("../MIDDLEWARES/check_api");

router.post("/", (req, res, next) => {
  const body = req.body;
  AdminController.save_admin(body)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.post("/signin", (req, res, next) => {
  const body = req.body;
  AdminController.signin_admin(body)
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/", (req, res, next) => {
  AdminController.find_admin()
    .then(result => {
      res.status(result.status).json(result.data);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.patch("/", (req, res, next) => {
  const body = req.body;
  AdminController.update_admin_password(body)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.get("/verification", (req, res, next) => {
  AdminController.send_verification_code()
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

router.patch("/forgot", (req, res, next) => {
  const body = req.body;
  AdminController.forgot_password(body)
    .then(result => {
      res.status(result.status).json(result.message);
    })
    .catch(err => {
      res.status(err.status).json(err.error);
    });
});

module.exports = router;
