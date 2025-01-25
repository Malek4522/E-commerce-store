const jwt = require('jsonwebtoken');
const PASSWORD = process.env.ADMIN_PASSWORD;
const { 
    secret, 
    expiresIn, 
    options,
    cookie
  } = require('../config/jwt.config');
const crypto = require('crypto');

const generateTokens = () => {
    // Generate a unique JWT ID
    const jwtid = crypto.randomBytes(16).toString('hex');
    
    const accessToken = jwt.sign(
      { 
        role: "manager",
      },
      secret,
      {
        ...options,
        expiresIn,
        jwtid,
        subject: "manager"
      }
    );
    return accessToken;
};

const setAccessTokenCookie = (res, accessToken) => {
    res.cookie('accessToken', accessToken, {
      ...cookie,
    });
};

const authenticate = async (req, res) => {
    try{ 
        const password = req.body.password;

        if(password === PASSWORD){
            const accessToken= generateTokens();
            setAccessTokenCookie(res, accessToken);
            return res.status(200).json({ 
                message: 'Authentication successful',
            });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    authenticate
};
