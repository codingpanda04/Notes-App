const notesContainer = document.querySelector(".notes-container");
const addBtn = document.getElementById("add");

addBtn.addEventListener("click", () => {
    let newDiv = document.createElement("div");
    newDiv.className = "notes-div";
    let titleBox = document.createElement("input");
    titleBox.setAttribute("placeholder", "Title");
    let inputBox = document.createElement("p");
    inputBox.setAttribute("contenteditable", "true");
    inputBox.className = "input-box";
    let img = document.createElement("img");
    img.src = "images/delete.png";
    img.setAttribute("id", "delete");
    inputBox.appendChild(img);
    newDiv.appendChild(titleBox);
    newDiv.appendChild(inputBox);
    notesContainer.appendChild(newDiv);

    // Save the note when clicking outside the input box
    inputBox.addEventListener("blur", () => saveNoteToLocalStorage(newDiv));

    const deleteBtn = img;

    deleteBtn.addEventListener("click", () => {
        deleteNoteFromLocalStorage(newDiv);
        notesContainer.removeChild(newDiv);
    });
});

const saveNoteToLocalStorage = (noteDiv) => {
    const titleBox = noteDiv.querySelector('input');
    const inputBox = noteDiv.querySelector('p');
    const noteId = noteDiv.dataset.noteId || new Date().toISOString(); // Use timestamp as note ID
    const noteContent = inputBox.innerText;
    const createdAt = new Date().toISOString(); // Creation timestamp

    const note = { noteId, title: titleBox.value, content: noteContent, createdAt };

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const existingNoteIndex = notes.findIndex(note => note.noteId === noteId);

    if (existingNoteIndex !== -1) {
        notes[existingNoteIndex] = note;
    } else {
        notes.push(note);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    noteDiv.dataset.noteId = noteId; // Save the note ID to the element for future reference
};

const deleteNoteFromLocalStorage = (noteDiv) => {
    const noteId = noteDiv.dataset.noteId;

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.noteId !== noteId);

    localStorage.setItem('notes', JSON.stringify(notes));
};

// Load notes from local storage
const loadNotesFromLocalStorage = () => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        let newDiv = document.createElement("div");
        newDiv.className = "notes-div";
        newDiv.dataset.noteId = note.noteId;
        let titleBox = document.createElement("input");
        titleBox.value = note.title;
        let inputBox = document.createElement("p");
        inputBox.setAttribute("contenteditable", "true");
        inputBox.className = "input-box";
        inputBox.innerText = note.content;
        let img = document.createElement("img");
        img.src = "images/delete.png";
        img.setAttribute("id", "delete");
        inputBox.appendChild(img);
        newDiv.appendChild(titleBox);
        newDiv.appendChild(inputBox);
        notesContainer.appendChild(newDiv);

        const deleteBtn = img;

        deleteBtn.addEventListener("click", () => {
            deleteNoteFromLocalStorage(newDiv);
            notesContainer.removeChild(newDiv);
        });

        // Save the note when clicking outside the input box
        inputBox.addEventListener("blur", () => saveNoteToLocalStorage(newDiv));
    });
};

// Initial load of notes
loadNotesFromLocalStorage();
