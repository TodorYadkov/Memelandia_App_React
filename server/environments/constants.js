// Category for memes
const category = ['Funny', 'Sports', 'Politics', 'Science',
    'Technology', 'Food', 'Travel', 'Music', 'Movies',
    'Gaming', 'Literature', 'Nature', 'Art', 'History',
    'Fashion', 'Fitness', 'Animals', 'Celebrities',
    'Hobbies', 'Educational', 'Inspirational',
    'Relationships', 'Humor', 'Other'];

// Rating steps
const ratingValue = {
    increment: 0.1,
    decrement: 0.01
}; // This values can be smaller, for example 0.0001


module.exports = {
    category,
    ratingValue,
}