module.exports = (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name } = request.body || {};

  if (!name || typeof name !== 'string') {
    return response.status(400).json({ error: 'Name is required' });
  }

  response.status(200).json({ response: `Nice to meet you, ${name}!` });
};
