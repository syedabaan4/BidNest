const jwt = require('jsonwebtoken');
const db = require('./db');

//freeze account
exports.freezeAccount = async (req, res) => {
  try {
    const { username } = req.params;

    // user exists?
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.query('UPDATE users SET status = "frozen" WHERE username = ?', [username]);

    res.status(200).json({ message: 'Account frozen successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error freezing account');
  }
};

exports.viewUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');

    // list of users response
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error retrieving users');
  }
};

//goes into route file
const isAdmin = (req, res, next) => {
  if (req.decoded && req.decoded.role === 'admin') {
    return next(); 
  } else {
    return res.status(403).json({ message: 'Permission denied. User is not an admin.' });
  }
};

router.post('/freeze-account/:username', isAdmin, controllers.freezeAccount)
router.post('/view-users', isAdmin, controllers.viewUsers);


