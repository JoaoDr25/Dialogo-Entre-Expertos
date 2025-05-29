const chatBox = document.querySelector('.chat-box');
const input = document.getElementById('topicInput');


function addMessage(message, position, colorClass) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${position}`;

  const avatarDiv = document.createElement('div');
  avatarDiv.className = `avatar ${colorClass}`;

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'bubble';
  bubbleDiv.innerText = message;

  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(bubbleDiv);
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}


const btnExpert1 = document.querySelector('.btn.blue');

btnExpert1.addEventListener('click', async () => {
  const texto = input.value.trim();
  if (texto === '') return;

  addMessage(texto, 'left', 'red'); 

  try {
    const res = await fetch('http://localhost:3004/api/experto01/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensajeUsuario: texto })
    });

    const data = await res.json();
    addMessage(data.respuestaExperto.mensaje, 'right', 'blue'); 
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  }

  input.value = '';
});


const btnExpert2 = document.querySelector('.btn.red');

btnExpert2.addEventListener('click', async () => {
  const texto = input.value.trim();
  if (texto === '') return;

  addMessage(texto, 'left', 'red'); 

  try {
    const res = await fetch('http://localhost:3004/api/experto02/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensajeUsuario: texto })
    });

    const data = await res.json();
    addMessage(data.respuestaExperto.mensaje, 'right', 'blue'); 
  } catch (error) {
    console.error('Error al enviar mensaje al experto 2:', error);
  }

  input.value = '';
});


const btnClear = document.querySelector('.btn.white');

btnClear.addEventListener('click', async () => {
  try {
    const res = await fetch('http://localhost:3004/api/conversations', {
      method: 'DELETE'
    });

    const data = await res.json();

    if (res.ok) {
      chatBox.innerHTML = ''; 
      alert(data.mensaje || 'Historial eliminado correctamente.');
    } else {
      alert('Error al intentar eliminar el historial.');
    }

  } catch (error) {
    console.error('Error al eliminar el historial:', error);
    alert('Error al eliminar el historial.');
  }
});


const btnExport = document.querySelector('.btn.green');

btnExport.addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3004/api/export/pdf', {
      method: 'GET'
    });

    if (!response.ok) throw new Error('Error al exportar el PDF');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'conversacion.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al exportar a PDF:', error);
    alert('No se pudo exportar la conversación.');
  }
});


