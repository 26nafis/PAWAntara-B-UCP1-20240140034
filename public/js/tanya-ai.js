document.getElementById('chatForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const chatBox = document.getElementById('chatBox');
  const message = input.value.trim();

  if (!message) return;

  chatBox.innerHTML += `<div class="text-end mb-2"><span class="badge bg-primary p-2">${message}</span></div>`;
  input.value = '';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();

    chatBox.innerHTML += `<div class="text-start mb-2"><span class="badge bg-secondary p-2">${data.reply}</span></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error(err);
  }
});