import { save, open, newFile, editorUndo, editorRedo, find } from './editor'
export const actions = {
    "file.new": newFile,
    "file.download": save,
    "file.upload": open,
    "file.print": () => {
        const area = document.getElementById("text-area");
        const menu = document.getElementById("top-menu");
        const body = document.getElementById("markdown-body");
        area.classList.add("hiding-in-print");
        menu.classList.add("hiding-in-print");
        body.classList.add("full-width");
        window.print()
        area.classList.remove("hiding-in-print");
        menu.classList.remove("hiding-in-print");
        body.classList.remove("full-width");
    },
    "file.exit": () => {
        if (confirm("Close window?")) {
            window.open('about:blank','_self').close()
        }
    },
    "edit.undo": editorUndo,
    "edit.redo": editorRedo,
    "edit.find": find,
}