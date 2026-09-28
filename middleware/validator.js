/**
 * Validation Middleware for Student API endpoints
 */

/**
 * Validates request body for student creation (POST /students)
 */
const validateCreateStudent = (req, res, next) => {
  const { name, age, course, email } = req.body;

  const errors = [];

  // Check required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push("Field 'name' is required and must be a non-empty string.");
  }

  if (!course || typeof course !== 'string' || course.trim().length === 0) {
    errors.push("Field 'course' is required and must be a non-empty string.");
  }

  // Validate optional fields if present
  if (age !== undefined && age !== null && age !== '') {
    const numAge = Number(age);
    if (isNaN(numAge) || !Number.isInteger(numAge) || numAge <= 0 || numAge > 120) {
      errors.push("Field 'age' must be a valid positive integer between 1 and 120.");
    }
  }

  if (email && (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email))) {
    errors.push("Field 'email' must be a valid email address.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. "name" and "course" are required non-empty string fields.',
      errors: errors
    });
  }

  next();
};

/**
 * Validates request body and params for student update (PUT /students/:id)
 */
const validateUpdateStudent = (req, res, next) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID format. ID must be an integer.'
    });
  }

  const { name, age, course, email } = req.body;

  // Ensure at least one updatable field is provided
  const hasUpdateFields =
    name !== undefined ||
    age !== undefined ||
    course !== undefined ||
    email !== undefined;

  if (!hasUpdateFields) {
    return res.status(400).json({
      success: false,
      message: 'At least one field (name, course, age, email) is required for update.'
    });
  }

  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    errors.push('"name" must be a non-empty string when provided.');
  }

  if (course !== undefined && (typeof course !== 'string' || course.trim().length === 0)) {
    errors.push('"course" must be a non-empty string when provided.');
  }

  if (age !== undefined) {
    const numAge = Number(age);
    if (isNaN(numAge) || numAge <= 0) {
      errors.push('"age" must be a valid positive number.');
    }
  }

  if (email !== undefined && (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email))) {
    errors.push('"email" must be a valid email address.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateCreateStudent,
  validateUpdateStudent
};
