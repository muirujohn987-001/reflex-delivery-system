const ApiError = require('../utils/APIerror');
const userRepository = require('../repositories/user');
const { hashPassword, comparePassword } = require('../utils/Password');
const { signAccessToken } = require('../utils/jwt');

async function register({ name, email, phone, password, role }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.createUser({ name, email, phone, passwordHash, role });
  return user; // repository already excludes password_hash
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);

  // Same error for "no such user" and "wrong password" on purpose — this
  // stops an attacker from using the login endpoint to discover which
  // emails have an account.
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await comparePassword(password, user.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signAccessToken({ sub: user.id, role: user.role, email: user.email });

  const { password_hash, ...safeUser } = user; // eslint-disable-line no-unused-vars
  return { token, user: safeUser };
}

async function getProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
}

module.exports = { register, login, getProfile };