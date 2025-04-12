// src/schemas/validation.js
import Joi from 'joi';

export const choreSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().min(3).max(50).required(),
  xpValue: Joi.number().min(1).max(1000).required(),
  assignedTo: Joi.number().required(),
  dueDate: Joi.date().iso().required(),
  status: Joi.string().valid(
    'new', 'submitted', 'approved', 
    'denied_reset', 'denied_remove', 'completed'
  ).required(),
  recurrence: Joi.object({
    type: Joi.string().valid('daily', 'weekly', 'monthly').required(),
    interval: Joi.number().min(1).required(),
    isMonthEnd: Joi.boolean().when('type', {
      is: 'monthly',
      then: Joi.required()
    })
  }).optional()
});

export const rewardSchema = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().min(3).max(50).required(),
  cost: Joi.number().min(1).required(),
  assignedTo: Joi.array().items(Joi.alternatives(
    Joi.string().valid('all'),
    Joi.number()
  )).min(1).required()
});

export const validate = (object, schema) => {
  const { error } = schema.validate(object);
  return {
    isValid: !error,
    error: error?.details[0]?.message || null
  };
};