module.exports = () => (req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); // Here we can add which host can use our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Authorization');

    next();
}