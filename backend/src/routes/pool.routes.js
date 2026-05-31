const express = require("express");

const router = express.Router();

const protegerRuta = require(
  "../middlewares/auth.middleware"
);

const {
  valorarPatron
} = require(
  "../controllers/pool.controller"
);

router.post(
  "/valorar",
  protegerRuta,
  valorarPatron
);

module.exports = router;