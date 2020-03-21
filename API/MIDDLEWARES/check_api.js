module.exports = (req, res, next) => {
    const api_key = process.env.API_KEY;
    const key = req.headers.api_key;
    if (key === api_key) {
        next();
    }
    else {
        return res.status(401).json('API KEY MISSING');
    }
}