const form = document.getElementById('noteForm');
const notesContainer = document.getElementById('notesContainer');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('titleInput').value;
  const description = document.getElementById('descriptionInput').value;
  if (title.trim() === '' || description.trim() === '') {
    alert('Por favor, ingresa un título y descripción para la nota.');
    return;
  }

  try {
    const noteData = { title, description };
    const response = await fetch('http://localhost:4000/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error('Error al agregar la nota.');
    }

    // alert('Nota agregada exitosamente.');
    form.reset();
    displayNotes();
  } catch (error) {
    console.error('Error:', error);
    // alert('Ocurrió un error al agregar la nota.');
  }
});

async function displayNotes() {
  try {
    const response = await fetch('http://localhost:4000/notas');
    if (!response.ok) {
      throw new Error('Error al obtener las notas.');
    }

    const notes = await response.json();

    notesContainer.innerHTML = '';
    notes.forEach(note => {
      displayNote(note);
    });
  } catch (error) {
    console.error('Error:', error);
    // alert('Ocurrió un error al obtener las notas.');
  }
}

async function displayNote(note) {
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');
  noteElement.setAttribute('data-note-id', note.id); 
  noteElement.innerHTML = `
    <div class="note_det">
    <h2>${note.title}</h2>
    <p>${note.description}</p>
    </div>
    <div class="note_but">
    <button class="editButton" onclick="editNote('${note.id}', '${note.title}', '${note.description}')">Editar</button>
    <button class="deleteButton" onclick="deleteNote('${note.id}')">Borrar</button>
    </div>
  `;

  notesContainer.appendChild(noteElement);
}

async function deleteNote(id) {
  try {
    const response = await fetch(`http://localhost:4000/borrar/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al borrar la nota.');
    }

    document.querySelector(`[data-note-id="${id}"]`).remove();
  } catch (error) {
    console.error('Error:', error);
    // alert('Ocurrió un error al borrar la nota.');
  }
}

function editNote(id, title, description) {
  const noteElement = document.querySelector(`[data-note-id="${id}"]`);

  const titleInput = document.createElement('input');
  titleInput.value = title;
  const titleElement = noteElement.querySelector('h2');
  titleElement.parentElement.insertBefore(titleInput, titleElement);
  titleElement.remove();

  const descriptionInput = document.createElement('input');
  descriptionInput.value = description;
  const descriptionElement = noteElement.querySelector('p');
  descriptionElement.parentElement.insertBefore(descriptionInput, descriptionElement);
  descriptionElement.remove();

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Guardar';
  saveButton.onclick = () => {saveEditedNote(id, titleInput.value, descriptionInput.value)
  saveButton.style.display = 'none'}
  const editButton = document.querySelector(`[data-note-id="${id}"] .editButton`);
  editButton.insertAdjacentElement('beforebegin', saveButton);
  editButton.disabled = true;
}

async function saveEditedNote(id, newTitle, newDescription) {
  try {
    const noteData = { title: newTitle, description: newDescription };
    const response = await fetch(`http://localhost:4000/actualizar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error('Error al editar la nota.');
    }

    const updatedNote = await response.json();
    const noteElement = document.querySelector(`[data-note-id="${id}"]`);
    noteElement.querySelector('input').replaceWith(createNoteTitleElement(updatedNote.title));
    noteElement.querySelector('input').replaceWith(createNoteDescriptionElement(updatedNote.description));
    // const saveButton = noteElement.querySelector('.saveButton');
    // saveButton.remove();
    const editButton = document.querySelector(`[data-note-id="${id}"] .editButton`);
    editButton.disabled = false;
  } catch (error) {
    console.error('Error:', error);
    // alert('Ocurrió un error al editar la nota.'); 
  }
}

function createEditButton(id, title, description) {
  const editButton = document.createElement('button');
  editButton.classList.add('editButton');
  editButton.textContent = 'Editar';
  editButton.onclick = () => editNote(id, title, description);
  return editButton;
}


function createNoteTitleElement(title) {
  const titleElement = document.createElement('h2');
  titleElement.textContent = title;
  return titleElement;
}

function createNoteDescriptionElement(description) {
  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = description;
  return descriptionElement;
}

displayNotes();
