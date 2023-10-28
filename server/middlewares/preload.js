const preload = (api, id = 'memeId') => async (req, res, next) => {
    try {
        
        const paramsId = req.params[id];
        const current = await api(paramsId);

        if (current) {
            res.locals.preload = current;
            next();
        } else {
            throw new Error(`Entered ID - ${id} is invalid`, 404);
        }

    } catch (error) {
        next(error);
    }
}

module.exports = {
    preload,
};