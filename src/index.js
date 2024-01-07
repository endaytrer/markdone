
import { renderMenu, closeMenu } from './menu';
import { initEditor, render } from './editor';
let area;
let body;
let menu;

window.onload = async () => {
    area = document.getElementById("text-area");
    body = document.getElementById("markdown-body");
    await initEditor(area, body);
    menu = document.getElementById("top-menu");
    renderMenu(menu);
    document.querySelector("main").addEventListener('click', () => closeMenu(0))
    render(body);
}
