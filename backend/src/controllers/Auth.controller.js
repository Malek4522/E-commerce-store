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
    console.log('[Auth Controller] Generating new access token');
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
    console.log('[Auth Controller] Access token generated successfully');
    return accessToken;
};

const setAccessTokenCookie = (res, accessToken) => {
    console.log('[Auth Controller] Setting access token cookie');
    res.cookie('accessToken', accessToken, {
      ...cookie,
    });
    console.log('[Auth Controller] Cookie set successfully');
};

const authenticate = async (req, res) => {
    try{ 
        console.log('[Auth Controller] Authentication attempt started');
        const password = req.body.password;

        if(password === PASSWORD){
            console.log('[Auth Controller] Password validation successful');
            const accessToken = generateTokens();
            setAccessTokenCookie(res, accessToken);
            console.log('[Auth Controller] Authentication completed successfully');
            return res.status(200).json({ 
                message: 'Authentication successful',
                accessToken: accessToken
            });
        }

        console.log('[Auth Controller] Invalid password provided');
        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error('[Auth Controller] Error during authentication:', error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    authenticate
};
