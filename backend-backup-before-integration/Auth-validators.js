const { z } = require('zod');

// Mirrors the users table Ben confirmed with John (users: id, name, email,
// phone, password_hash, role). Role values must match the shared
// user_role ENUM exactly — nobody is allowed to invent a fourth role.
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().trim().toLowerCase().email('A valid email is required'),
  phone: z.string().trim().min(7).max(30).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['RETAILER', 'DISPATCHER', 'RIDER'], {
    errorMap: () => ({ message: 'role must be RETAILER, DISPATCHER or RIDER' }),
  }),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('A valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };