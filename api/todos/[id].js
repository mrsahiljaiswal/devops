const store = require('./_store');

module.exports = (req, res) => {
  const id = Number(req.query.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  if (req.method === 'PUT') {
    const { text, completed } = req.body || {};
    if (text !== undefined && typeof text !== 'string') {
      return res.status(400).json({ error: 'Todo text must be a string' });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }

    const updated = store.updateTodo(id, { text, completed });
    if (!updated) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const removed = store.deleteTodo(id);
    if (!removed) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.status(204).end();
  }

  res.setHeader('Allow', 'PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
};
