const validateUrl = (url) => {
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((www\\.)?youtube\\.com\\/watch\\?v=[\\w-]+|' + // youtube
        'youtu\\.be\\/[\\w-]+|' + // youtube short
        'drive\\.google\\.com\\/[\\w\\/-]+)' + // google drive
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query params
        '(\\#[-a-z\\d_]*)?$','i' // fragment
    );
    return urlPattern.test(url);
};

const urlValidationMiddleware = (req, res, next) => {
    const links = req.body.links;
    
    if (!links || !Array.isArray(links)) {
        return res.status(400).json({ error: 'Links must be provided as an array' });
    }

    if (links.length === 0) {
        return res.status(400).json({ error: 'At least one link must be provided' });
    }

    for (let i = 0; i < links.length; i++) {
        const link = links[i];

        if (!link.url) {
            return res.status(400).json({ error: `URL is required in link at position ${i}` });
        }

        if (!link.type) {
            return res.status(400).json({ error: `Type is required in link at position ${i}` });
        }

        if (!['youtube', 'drive'].includes(link.type.toLowerCase())) {
            return res.status(400).json({ error: `Type must be either "youtube" or "drive" in link at position ${i}` });
        }

        if (!validateUrl(link.url)) {
            return res.status(400).json({ error: `Invalid URL format at position ${i}. Only YouTube and Google Drive URLs are allowed.` });
        }
    }

    next();
};

module.exports = {
    urlValidationMiddleware
};
