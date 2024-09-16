import { validationResult } from "express-validator";

const Validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(422).json(errors);
};

export default Validate;
