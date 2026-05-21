module.exports = (request, response) => {
  response.status(200).json({ message: 'Hello from the backend!' });
};
