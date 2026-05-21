const store = require('./_store');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(store.getTodos());
  }

  if (req.method === 'POST') {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    const todo = store.addTodo(text);
    return res.status(201).json(todo);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
};
