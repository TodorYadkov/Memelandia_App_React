function isAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    }
}

function isGuest(req, res, next) {
    if (req.user) {
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });
    } else {
        next();
    }
}

function isOwner(req, res, next) {
    if (!req.user) {
        // Check if the current user is logged in
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (req.user._id == res.locals.preload?.author?._id) {
        // Check Meme model
        // Check if the current user is the author of the current meme
        next();

    } else if (req.user._id == res.locals.preload?.userId?._id) {
        // Check Comment Like
        // Check if the current user is the owner of the current comment
        next();

    } else {
        return res.status(403).json({ message: 'Forbidden', statusCode: 403 });
    }
}

function isNotOwner(req, res, next) {
    if (!req.user) {
        // Check if the current user is logged in
        return res.status(401).json({ message: 'Unauthorized', statusCode: 401 });

    } else if (req.user._id != res.locals.preload?.author?._id) {
        // Check if the current user is not the owner of the current content
        next();

    } else {
        return res.status(403).json({ message: 'The owner cannot perform this action', statusCode: 403 });
    }
}


module.exports = {
    isAuth,
    isGuest,
    isOwner,
    isNotOwner,
};
