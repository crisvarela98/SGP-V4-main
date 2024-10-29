document.addEventListener('DOMContentLoaded', function() {
    const updateTime = () => {
        const now = new Date();
        document.getElementById('time').textContent = now.toLocaleTimeString('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };
    setInterval(updateTime, 1000);

    const username = JSON.parse(localStorage.getItem('usuario')).NomVend;
    document.getElementById('welcome-message').textContent = `Bienvenido, ${username}!`;

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });


    document.getElementById('traerBase').addEventListener('click', () => {
        fetch('./api/descargarbase')
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error al descargar la base de datos:', error));
    });
    
    document.getElementById('subirBase').addEventListener('click', () => {
        fetch('./api/subirbase', { method: 'POST' })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error al subir la base de datos:', error));
    });
});

    document.querySelector('.note-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const noteText = document.querySelector('.note-input').value.trim();
        if (noteText) {
            const now = new Date();
            const timestamp = now.toISOString();
            fetch('/data', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ type: 'notas', data: { text: noteText, timestamp, id: Date.now() } })
            })
            .then(response => response.json())
            .then(() => {
                document.querySelector('.note-input').value = '';
                alert('Nota agregada con éxito');
                loadNotes();  // Refresh notes display
            })
            .catch(error => console.error('Error al agregar nota:', error));
        }
    });

    const popup = document.querySelector('.popup');
    document.querySelector('.open-popup').addEventListener('click', () => {
        loadNotes();  // Load notes when opening the popup
        popup.style.display = 'flex';
    });

    document.querySelector('.close-popup').addEventListener('click', () => {
        popup.style.display = 'none';
    });
});

function loadNotes() {
    const notesContainer = document.querySelector('.notes');
    notesContainer.innerHTML = '';
    Promise.all([
        fetch('/json/notas.json').then(response => response.json()).catch(() => []), // Carga notas del directorio 'json'
        fetch('/data/notas').then(response => response.json()).catch(() => []) // Carga notas del directorio 'data' a través de la API
    ]).then(results => {
        const [jsonNotes, dataNotes] = results;
        const combinedNotes = jsonNotes.concat(dataNotes); // Combinar ambas listas de notas
        combinedNotes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');
            noteDiv.textContent = `${note.text} - ${note.timestamp}`;
            notesContainer.appendChild(noteDiv);
        });
    }).catch(error => {
        console.error('Error al cargar notas:', error);
        notesContainer.textContent = 'Error al cargar notas.';
    });

    document.getElementById('traerBase').addEventListener('click', () => {
        fetch('/downloadDatabase')
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error al descargar la base de datos:', error));
    });
    
    document.getElementById('subirBase').addEventListener('click', () => {
        fetch('/uploadDatabase', { method: 'POST' })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error al subir la base de datos:', error));
    });
}
