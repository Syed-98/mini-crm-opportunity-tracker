const { validationResult } = require('express-validator');
const Opportunity = require('../models/Opportunity');

const getOpportunities = async (req, res) => {
  const opportunities = await Opportunity.find()
    .populate('owner', 'name')
    .sort({ createdAt: -1 });
  res.json(opportunities);
};

const getOpportunity = async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id).populate(
    'owner',
    'name'
  );

  if (!opportunity) {
    return res.status(404).json({ message: 'Opportunity not found' });
  }

  res.json(opportunity);
};

const createOpportunity = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }

  const {
    customerName,
    contactName,
    contactEmail,
    contactPhone,
    requirement,
    estimatedValue,
    stage,
    priority,
    nextFollowUpDate,
    notes,
  } = req.body;

  const opportunity = await Opportunity.create({
    owner: req.user._id,
    customerName,
    contactName,
    contactEmail,
    contactPhone,
    requirement,
    estimatedValue,
    stage,
    priority,
    nextFollowUpDate,
    notes,
  });

  const populated = await Opportunity.findById(opportunity._id).populate(
    'owner',
    'name'
  );

  res.status(201).json(populated);
};

const updateOpportunity = async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({ message: 'Opportunity not found' });
  }

  if (opportunity.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this opportunity' });
  }

  const {
    customerName,
    contactName,
    contactEmail,
    contactPhone,
    requirement,
    estimatedValue,
    stage,
    priority,
    nextFollowUpDate,
    notes,
  } = req.body;

  opportunity.customerName = customerName ?? opportunity.customerName;
  opportunity.contactName = contactName ?? opportunity.contactName;
  opportunity.contactEmail = contactEmail ?? opportunity.contactEmail;
  opportunity.contactPhone = contactPhone ?? opportunity.contactPhone;
  opportunity.requirement = requirement ?? opportunity.requirement;
  opportunity.estimatedValue = estimatedValue ?? opportunity.estimatedValue;
  opportunity.stage = stage ?? opportunity.stage;
  opportunity.priority = priority ?? opportunity.priority;
  opportunity.nextFollowUpDate = nextFollowUpDate ?? opportunity.nextFollowUpDate;
  opportunity.notes = notes ?? opportunity.notes;

  const updated = await opportunity.save();
  const populated = await Opportunity.findById(updated._id).populate('owner', 'name');

  res.json(populated);
};

const deleteOpportunity = async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    return res.status(404).json({ message: 'Opportunity not found' });
  }

  if (opportunity.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this opportunity' });
  }

  await opportunity.deleteOne();
  res.json({ message: 'Opportunity removed' });
};

module.exports = {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
