
import { renderMenu, closeMenu } from './menu';
import { initEditor, render } from './editor';
let area;
let body;
let topMenu;

window.onload = async () => {
    area = document.getElementById("text-area");
    body = document.getElementById("markdown-body");
    await initEditor(area, body);
    topMenu = document.getElementById("top-menu");
    renderMenu(topMenu);
    document.querySelector("main").addEventListener('click', closeMenu)
    render(body);
}
