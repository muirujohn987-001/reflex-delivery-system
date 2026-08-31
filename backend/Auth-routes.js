const { Router } = require('express');
const controller = require('../controllers/Auth-controller');
const { authenticate } = require('../middleware/Auth');
const { validateBody } = require('../middleware/Validate');
const { registerSchema, loginSchema } = require('../validators/Auth-validators');

const router = Router();

// Public/dev seed use per API contract section 8.1 — used to create the
// retailer/dispatcher/rider test accounts during setup and demo.
router.post('/register', validateBody(registerSchema), controller.register);

// Public — returns a JWT on success.
router.post('/login', validateBody(loginSchema), controller.login);

// Authenticated — returns the profile of whoever the token belongs to.
router.get('/me', authenticate, controller.me);

module.exports = router;