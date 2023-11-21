const axios = require('axios');

module.exports = async (imageData) => {
    // Extract base64 data from imageData
    const base64Data = imageData.split(',')[1];

    // ImgBB API endpoint
    const apiUrl = process.env.IMGBB_API_URL;

    // ImgBB API key
    const apiKey = process.env.IMGBB_KEY;

    // Create a FormData object
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', base64Data);

    // Upload image on ImgBB
    const imgbbResponse = await axios.post(apiUrl, formData);

    return imgbbResponse;
};