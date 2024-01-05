import { actions } from './actions';

const divider = {}

const menu = {
    file: {
        name: "File",
        submenu: {
            new: { name: "New" },
            d0: divider,
            open: { name: "Open..."},
            upload: { name: "Open from Local..."},
            d1: divider,
            save: { name: "Save" },
            saveAs: { name: "Save as..." },
            download: { name: "Save to Local" },
            d2: divider,
            export: {
                name: "Export...",
                submenu: {
                    pdf: { name: "PDF" },
                    html: { name: "HTML" },
                }
            },
            print: { name: "Print..." },
            d3: divider,
            preferences: { name: "Preferences..."},
            d4: divider,
            exit: { name: "Exit" }
        }
    },
    edit: {
        name: "Edit",
        submenu: {
            undo: { name: "Undo", disabled: true },
            redo: { name: "Redo", disabled: true },
            d0: divider,
            cut: { name: "Cut" },
            copy: { name: "Copy" },
            paste: { name: "Paste" },
            d1: divider,
            find: { name: "Find" },
            replace: { name: "Replace" },
        }
    },
    help: {
        name: "Help",
        submenu: {
            about: { name: "About"}
        }
    }
}
let shortcuts = {
    "file.new": "C-N",
    "file.open": "C-O",
    "file.save": "C-S",
    "file.saveAs": "CS-S",
    "file.print": "C-P",
    "file.preferences": "C-,",
    "file.exit": "C-W",
    "edit.undo": "C-Z",
    "edit.redo": "CS-Z",
    "edit.cut": "C-X",
    "edit.copy": "C-C",
    "edit.paste": "C-V",
    "edit.find": "C-F",
    "edit.replace": "C-H"
}
const modifierMap = {
    'C': "Ctrl",
    'S': "Shift",
    'A': "Alt",
    'M': "Meta"
};


let menuOpened = false;
let currentParent = null;
const menuPanel = document.createElement("div");
const menuTable = document.createElement("table");
menuPanel.appendChild(menuTable)
/**
 * @param {HTMLDivElement} parent 
 */
function renderMenuPanel(parent) {
    if (parent === currentParent) return;
    closeMenu();
    menuOpened = true;
    currentParent = parent;
    const { id } = parent;
    const menuKey = id.split("-")[1];
    const menuItem = menu[menuKey];
    for (const subKey in menuItem.submenu) {
        const value = menuItem.submenu[subKey];
        if (value == divider) {
            const line = document.createElement("hr");
            menuTable.appendChild(line);
            continue;
        }
        const element = document.createElement("tr");
        element.className = "submenu-button";
        if (`${menuKey}.${subKey}` in shortcuts) {
            const shortcut = shortcuts[`${menuKey}.${subKey}`];
            let [modifiers, key] = shortcut.split('-');
            modifiers = modifiers.split('').map((v) => modifierMap[v])
            let str = modifiers.reduce((p, v) => p + v + "+", "")
            str += key
            element.innerHTML = `<td class="name">${value.name}</td> <td class="shortcut">${str}</td>`
        } else {
            element.innerHTML = `<td class="name">${value.name}</td> <td></td>`;
        }
        element.id = `menu-${menuKey}-${subKey}`;
        element.addEventListener('mouseenter', (e) => {
        })
        element.addEventListener('mouseleave', (e) => {
        })
        element.addEventListener('click', async (e) => {
            e.stopPropagation();
            const indexer = `${menuKey}.${subKey}`;
            if (indexer in actions) {
                await actions[indexer]()
            } else {
                console.log(`${menuKey}.${subKey}.click()`)
            }
            closeMenu();
        })
        menuTable.appendChild(element);
    }
    parent.classList.add("active");
    parent.appendChild(menuPanel);
}
/**
 * @param {HTMLDivElement} item 
 */
function menuItemClick(item) {
    console.log("click")
    menuOpened = true;
    renderMenuPanel(item);
}
/**
 * @param {HTMLDivElement} item 
 */
function menuItemHover(item) {
    if (!menuOpened) return;
    renderMenuPanel(item);
}

/**
 * @param {HTMLDivElement} parent 
 */
export function closeMenu() {
    if (menuPanel.parentElement) {
        menuPanel.parentElement.classList.remove("active");
        menuPanel.parentElement.removeChild(menuPanel)
    }
    menuOpened = false;
    currentParent = null;
    menuTable.innerHTML = "";
}

/**
 * @param {HTMLDivElement} parent 
 */
export function renderMenu(parent) {
    menuPanel.id = "menu-panel";
    for (const key in menu) {
        const value = menu[key];
        const element = document.createElement("button");
        element.className = "menu-button";
        element.innerText = value.name;
        element.id = `menu-${key}`
        element.addEventListener('click', (e) => menuItemClick(element))
        element.addEventListener('mouseenter', (e) => {
            menuItemHover(element)
        })
        parent.appendChild(element);
    }
}

document.onkeydown = (ev) => {
    // ev.preventDefault()
    console.log(ev.key)
}