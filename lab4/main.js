const btnAdd = document.querySelector(".btnAdd");
const container = document.querySelector(".container");
const modal = document.querySelector("#myModal");
const btnModalAdd = document.querySelector("#modalAdd");
const btnModalSave = document.querySelector("#modalSave");
const btnModalClose = document.querySelector(".close");
const noteTitleInput = document.querySelector("#noteTitle");
const noteContentInput = document.querySelector("#noteContent");
const noteColorInput = document.querySelector("#noteColor"); 
const viewModal = document.querySelector("#viewModal");
const viewTitle = document.querySelector("#viewTitle");
const viewContent = document.querySelector("#viewContent");
const viewClose = document.querySelector("#viewClose");
const btnEdit = document.querySelector("#modalEdit");
const btnDelete = document.querySelector("#modalDelete");

let currentNoteId = null;

class Note {
    constructor(title, content, color, id, pinned = false) { 
        this.title = title;
        this.content = content;
        this.color = color || "#ffffff"; 
        this.id = id || Date.now();
        this.pinned = pinned; 
    }

    createNoteElement() {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.dataset.id = this.id;
        noteDiv.style.backgroundColor = this.color; 

        if (this.pinned) {
            noteDiv.classList.add('pinned');
        }

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('title');
        titleDiv.textContent = this.title;

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        contentDiv.textContent = this.content;

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('Date');
        dateDiv.textContent = new Date(this.id).toLocaleString(); 

        const btnPin = document.createElement('button');
        btnPin.classList.add('btnPin');
        btnPin.textContent = 'Pin';

        noteDiv.appendChild(titleDiv);
        noteDiv.appendChild(contentDiv);
        noteDiv.appendChild(dateDiv);
        noteDiv.appendChild(btnPin);

        noteDiv.addEventListener('click', () => {
            openViewModal(this.id);
        });

        return noteDiv;
    }
}

btnAdd.addEventListener('click', () => {
    modal.style.display = "block"; 
    btnModalAdd.style.display = "block"; 
    btnModalSave.style.display = "none"; 
});

btnModalClose.addEventListener('click', () => {
    modal.style.display = "none"; 
});

btnModalAdd.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    const color = noteColorInput.value; 

    if (title === "" || content === "") {
        alert("Please fill in both title and content."); 
        return;
    }

    if (title.length > 50) {
        alert("Title cannot be longer than 50 characters."); 
        return;
    }

    const newNote = new Note(title, content, color); 
    addNoteToContainer(newNote); 
    saveNoteToLocalStorage(newNote); 

    modal.style.display = "none";
    noteTitleInput.value = "";
    noteContentInput.value = "";
});

btnModalSave.addEventListener('click', () => {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    const color = noteColorInput.value; 

    if (title === "" || content === "") {
        alert("Please fill in both title and content."); 
        return;
    }

    if (title.length > 50) {
        alert("Title cannot be longer than 50 characters."); 
        return;
    }

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.map(note => {
        if (note.id === currentNoteId) {
            return { ...note, title, content, color }; 
        }
        return note;
    });
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    const noteElement = document.querySelector(`.note[data-id='${currentNoteId}']`);
    if (noteElement) {
        noteElement.querySelector('.title').textContent = title;
        noteElement.querySelector('.content').textContent = content;
        noteElement.style.backgroundColor = color; 
        noteElement.style.backgroundColor = color; 
    }

    modal.style.display = "none"; 
    noteTitleInput.value = "";
    noteContentInput.value = "";
});

function addNoteToContainer(note) {
    const noteElement = note.createNoteElement();
    const btnPin = noteElement.querySelector('.btnPin');
    btnPin.addEventListener('click', (event) => {
        const isPinned = noteElement.classList.contains('pinned');
        note.pinned = !isPinned;
        updatePinStatusInLocalStorage(note.id, note.pinned);

        if (!isPinned) {
            noteElement.classList.add('pinned');
            container.insertBefore(noteElement, container.firstChild);
        } else {
            noteElement.classList.remove('pinned');
            container.appendChild(noteElement); 
        }
        event.stopPropagation();
    });

    if (note.pinned) {
        container.insertBefore(noteElement, container.firstChild);
    } else {
        container.appendChild(noteElement);
    }
}

function updatePinStatusInLocalStorage(id, pinned) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.map(note => {
        if (note.id === id) {
            return { ...note, pinned }; 
        }
        return note;
    });
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
}

function openViewModal(id) {
    currentNoteId = id;
    viewModal.style.display = "block"; 

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(note => note.id === id);
    if (note) {
        viewTitle.textContent = note.title;
        viewContent.textContent = note.content;
    }
}

function closeViewModal() {
    viewModal.style.display = "none"; 
}

function saveNoteToLocalStorage(note) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotesFromLocalStorage() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.sort((a, b) => b.pinned - a.pinned || b.id - a.id); //porownywanie kolejnych par elementow 
    /**
     * compare fucntion, it goes to second cryteria if substraction equals 0 (obie przypieta lub zadne)
     */
    notes.forEach(noteData => {
        const note = new Note(noteData.title, noteData.content, noteData.color, noteData.id, noteData.pinned); 
        addNoteToContainer(note);
    });
}

viewClose.addEventListener('click', closeViewModal);

btnEdit.addEventListener('click', () => {
    const title = viewTitle.textContent;
    const content = viewContent.textContent;
    noteTitleInput.value = title;
    noteContentInput.value = content;
    viewModal.style.display = "none";
    modal.style.display = "block";
    btnModalAdd.style.display = "none"; 
    btnModalSave.style.display = "block";
});

btnDelete.addEventListener('click', () => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.filter(note => note.id !== currentNoteId);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    const noteElement = document.querySelector(`.note[data-id='${currentNoteId}']`);
    if (noteElement) {
        container.removeChild(noteElement);
    }
    viewModal.style.display = "none";
});

loadNotesFromLocalStorage();
