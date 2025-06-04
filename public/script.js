let ultimoMensajeExperto = ''; 

const chatBox = document.querySelector('.chat-box');
const input = document.getElementById('topicInput');


function addMessage(message, position, tipo) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${position}`;

  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar');

  const img = document.createElement('img');

 
  if (tipo === 'usuario') {
    img.src = 'fotos/avatar-usuario.png';
    img.alt = 'Usuario';
    avatarDiv.classList.add('red');
  } else if (tipo === 'experto1') {
    img.src = 'fotos/images-removebg-preview.png';
    img.alt = 'Experto Religioso';
    avatarDiv.classList.add('blue');
  } else if (tipo === 'experto2') {
    img.src = 'fotos/robot.png';
    img.alt = 'Experto Ateo';
    avatarDiv.classList.add('red');
  }

  avatarDiv.appendChild(img);

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'bubble';
  bubbleDiv.innerText = message;

  if (position === 'left') {
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(bubbleDiv);
  } else {
    messageDiv.appendChild(bubbleDiv);
    messageDiv.appendChild(avatarDiv);
  }

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}


const btnExpert1 = document.querySelector('.btn.blue');

btnExpert1.addEventListener('click', async () => {
  let texto;

  if (ultimoMensajeExperto === '') {
    texto = input.value.trim();
    if (texto === '') return;

    addMessage(texto, 'left', 'usuario'); 
  } else {
    texto = ultimoMensajeExperto; 
  }

  try {
    const res1 = await fetch('http://localhost:3004/api/experto01/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensajeUsuario: texto })
    });

    const data1 = await res1.json();
    const respuesta1 = data1.respuestaExperto.mensaje;

    addMessage(respuesta1, 'left', 'experto1'); 
    ultimoMensajeExperto = respuesta1; 

  } catch (error) {
    console.error('Error en la conversación con experto 1:', error);
  }

  input.value = '';
});



const btnExpert2 = document.querySelector('.btn.red');

btnExpert2.addEventListener('click', async () => {
  let texto;

 
  if (ultimoMensajeExperto === '') {
    texto = input.value.trim();
    if (texto === '') return;

    addMessage(texto, 'left', 'usuario'); 
  } else {
    texto = ultimoMensajeExperto; 
  }

  try {
    const res2 = await fetch('http://localhost:3004/api/experto02/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensajeUsuario: texto })
    });

    const data2 = await res2.json();
    const respuesta2 = data2.respuestaExperto.mensaje;

    addMessage(respuesta2, 'right', 'experto2'); 
    ultimoMensajeExperto = respuesta2; 

  } catch (error) {
    console.error('Error en la conversación con experto 2:', error);
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


