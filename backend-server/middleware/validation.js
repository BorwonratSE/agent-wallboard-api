const { body, param, validationResult } = require('express-validator');

exports.validateAgent = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .matches(/^(AG|SP|AD)(00[1-9]|0[1-9]\d|[1-9]\d{2})$/).withMessage('Username format invalid'),

  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['Agent', 'Supervisor', 'Admin']).withMessage('Role must be Agent, Supervisor or Admin'),

  body('teamId')
    .optional()
    .isInt({ min: 1 }).withMessage('Team ID must be a positive integer'),

  body('status')
    .optional()
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),

  body('teamId').custom((value, { req }) => {
    if ((req.body.role === 'Agent' || req.body.role === 'Supervisor') && !value) {
      throw new Error('Team ID is required for Agent and Supervisor roles');
    }
    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateStatusUpdate = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
