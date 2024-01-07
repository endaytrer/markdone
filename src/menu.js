import { actions } from './actions';

const divider = {}

const menu = {
    submenu: {
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
                    divider,
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
            d1: divider,
            find: { name: "Find / Replace..." }
        }
    },
    help: {
        name: "Help",
        submenu: {
            about: { name: "About"}
        }
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
    "edit.find": "C-F"
}
/**
 * Use it every time shortcut is changed
 * @param {object} shortcuts 
 */
function invertMapShortcuts(shortcuts) {
    const ans = {};
    for (const key in shortcuts) {
        const val = shortcuts[key];
        if (val in ans) {
            ans[val].push(key);
        } else {
            ans[val] = [key]
        }
    }
    return ans;
}
let shortcutInvertMap = invertMapShortcuts(shortcuts);
const modifierMap = {
    'M': "Meta",
    'C': "Ctrl",
    'A': "Alt",
    'S': "Shift"
};


let menuOpened = false;
let currentParents = [null, null, null];
const menuPanels = currentParents.map(() => document.createElement('div'));

/**
 * @param {HTMLDivElement} parent 
 */
function renderMenuPanel(parent, level) {
    if (parent === currentParents[level]) return;
    currentParents[level] = parent;
    if (level >= menuPanels.length) return;

    // remove the parent of it and sub-layers;
    for (let i = level; i < menuPanels.length; i++) {
        if (menuPanels[i].parentElement) {
            menuPanels[i].parentElement.classList.remove("active");
            menuPanels[i].parentElement.removeChild(menuPanels[i])
        }
    }
    menuPanels[level].innerHTML = '';
    // indexing into the menu item
    const { id } = parent;
    const menuKeys = id.split('-').slice(1);
    let menuItem = menu;
    for (const menuKey of menuKeys) {
        menuItem = menuItem.submenu[menuKey]
    }
    for (const subKey in menuItem.submenu) {
        const value = menuItem.submenu[subKey];
        if (value == divider) {
            const line = document.createElement("td");
            line.className="separator";
            line.colSpan = 2;
            menuPanels[level].appendChild(line);
            continue;
        }
        const element = document.createElement("tr");
        element.className = "submenu-button";
        element.innerHTML = `<td class="name">${value.name}</td>`
        let isSubmenu = false;
        const menuKeyStr = menuKeys.join('.')
        if (`${menuKeyStr}.${subKey}` in shortcuts) {
            const shortcut = shortcuts[`${menuKeyStr}.${subKey}`];
            let [modifiers, key] = shortcut.split('-');
            modifiers = modifiers.split('').map((v) => modifierMap[v])
            let str = modifiers.reduce((p, v) => p + v + "+", "")
            str += key
            element.innerHTML += `<td class="shortcut">${str}</td>`
        } else if (value.submenu) {
            // Key with shortcut shall not have submenu
            element.innerHTML += `<td class="submenu-indicator">&#128898;</td>`;
            isSubmenu = true;
        } else {
            element.innerHTML += `<td class="shortcut"></td>`;
        }
        element.id = `${id}-${subKey}`;
        if (!isSubmenu) {
            element.addEventListener('click', async (e) => {
                e.stopPropagation();
                const indexer = `${menuKeyStr}.${subKey}`;
    
                // if unimplemented, throws error.
                await actions[indexer]();
                closeMenu(0);
            })

            element.addEventListener('mouseenter', (e) => {
                e.stopPropagation();
                closeMenu(level + 1);
                currentParents[level] = parent;
            })
        } else {
            // element.addEventListener('click', (e) => {
            //     e.stopPropagation();
            //     renderMenuPanel(element, level + 1)
            // })

            element.addEventListener('mouseenter', (e) => {
                e.stopPropagation();
                renderMenuPanel(element, level + 1);
            })
        }
        menuPanels[level].appendChild(element);
    }
    parent.classList.add("active");
    parent.appendChild(menuPanels[level]);
}
/**
 * @param {HTMLDivElement} item 
 */
function menuItemClick(item) {
    menuOpened = true;
    renderMenuPanel(item, 0);
}
/**
 * @param {HTMLDivElement} item 
 */
function menuItemHover(item) {
    if (!menuOpened) return;
    renderMenuPanel(item, 0);
}

/**
 * @param {HTMLDivElement} parent 
 */
export function closeMenu(level) {
    for (let i = level; i < menuPanels.length; i++) {
        if (menuPanels[i].parentElement) {
            menuPanels[i].parentElement.classList.remove("active");
            menuPanels[i].parentElement.removeChild(menuPanels[i])
        }
        currentParents[i] = null;
    }
    if (level === 0) {
        menuOpened = false;
    }
}

/**
 * @param {HTMLDivElement} parent 
 */
export function renderMenu(parent) {
    menuPanels[0].id = "menu-panel";
    menuPanels.forEach((val, idx) => {
        if (idx !== 0)
            val.id = `submenu-panel-${idx}`;
        val.className = "menu-panel";
    })
    for (const key in menu.submenu) {
        const value = menu.submenu[key];
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

document.onkeydown = async (ev) => {
    // ev.preventDefault()
    let keySequence = "";
    // in order of meta, ctrl, alt and shift
    if (ev.metaKey) keySequence += "M";
    if (ev.ctrlKey) keySequence += "C";
    if (ev.altKey) keySequence += "A";
    if (ev.shiftKey) keySequence += "S";
    // if no modifiers, continue;
    if (keySequence === "") return;
    if (ev.key === 'Meta' || ev.key === 'Ctrl' || ev.key === 'Alt' || ev.key === 'Shift') return;
    keySequence += "-" + ev.key.toUpperCase();
    if (!(keySequence in shortcutInvertMap)) return;
    ev.preventDefault();
    ev.stopPropagation();
    for (const action of shortcutInvertMap[keySequence]) {
        // if unimplemented, throws error.
        await actions[action]();
    }
}