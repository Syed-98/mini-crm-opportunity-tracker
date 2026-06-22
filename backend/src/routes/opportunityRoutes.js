const express = require('express');
const { body } = require('express-validator');
const {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const opportunityValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('requirement').trim().notEmpty().withMessage('Requirement is required'),
  body('estimatedValue')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated value must be a non-negative number'),
  body('stage')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid stage'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority'),
  body('contactEmail')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Please provide a valid contact email'),
];

router.use(protect);

router.route('/').get(getOpportunities).post(opportunityValidation, createOpportunity);

router
  .route('/:id')
  .get(getOpportunity)
  .put(opportunityValidation, updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;
