import * as wasm from "libmarkdown";
import renderMathInElement from "katex/contrib/auto-render/auto-render"
import { basicSetup } from 'codemirror';
import { EditorView, ViewPlugin, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { indentUnit } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';

let editor;
let uploader;

/**
 * @param {HTMLDivElement} body 
 */
export function render(body) {
    body.innerHTML = wasm.parse(editor.state.doc.toString());

    // postprocess latex
    renderMathInElement(body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
        ],
        throwOnError: false
    })

    // postprocess code blocks
    body.querySelectorAll('.pre-wrapper').forEach((wrapper) => {
        let title = document.createElement('div');
        title.className="pre-title"

        let titleLabel = document.createElement('span');
        if (wrapper.getAttribute('lang'))
            titleLabel.innerText = "Language: " + wrapper.getAttribute('lang');
        title.appendChild(titleLabel);

        let pre = wrapper.querySelector('pre');
        pre.style = undefined;
        const lines = pre.innerHTML.split('\n').slice(0, -1);
        pre.innerHTML = '';
        lines.forEach((line, index) => {
            const lineElement = document.createElement("code");
            lineElement.innerHTML = line;
            pre.appendChild(lineElement)
            if (index != lines.length - 1)
                pre.innerHTML += '\n'
        });
        const copyButton = document.createElement("button");
        copyButton.className="copy-button"
        copyButton.innerHTML = '<i class="fa-regular fa-clipboard"></i>'
        copyButton.addEventListener('click', (_) => {
            navigator.clipboard.writeText(pre.innerText)
            pre.setAttribute("copied", "true")
            setTimeout(() => {
                pre.removeAttribute("copied");
            }, 500)
        });
        title.appendChild(copyButton)
        wrapper.insertBefore(title, wrapper.firstChild);

    })
} 
function debounce(fn, timeMs) {
    let timeout = 0;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, timeMs);
    }
}

/**
 * @param {HTMLDivElement} parent 
 */
export async function initEditor(parent, body) {
    uploader = document.getElementById('uploader');
    let debouncedRender = debounce(() => render(body), 200);
    await wasm.default();
    editor = new EditorView({
        extensions: [
            basicSetup,
            // theme
            EditorView.baseTheme({
                "&.cm-editor.cm-focused": {
                    outline: "none"
                }
            }),
            // markdown setup
            markdown(),
            // view
            EditorView.lineWrapping,
            // keymap
            ViewPlugin.fromClass(class {
                constructor(view) {}
                update(update) {
                    if (update.docChanged) {
                        debouncedRender()
                    }
                }
            }),
            keymap.of([indentWithTab]),

            // 4 unit indent
            indentUnit.of("    "),
        ],
        parent: parent
    })
}
export function save() {
    const data = editor.state.doc.toString();
    const file = new Blob([data]);

    const a = document.createElement("a");
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = "Untitled.md";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}
export async function open() {
    const result = await new Promise((res, rej) => {
        uploader.oninput = () => {
            const file = uploader.files[0];
            const reader = new FileReader();
            reader.onloadend = (e) => {
                if (e.target.readyState === FileReader.DONE) {
                    res(reader.result);
                } else {
                    rej("cannot read");
                }
            }
            reader.readAsText(file);
        }
        uploader.click();
    });

    editor.dispatch({changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: result
    }})
}