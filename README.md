# Markdone

> [!WARNING]
> Under development. Things are not working.

**Markdone, a ready-to-use markdown editor without cloud. Free and open source under GPLv3.**

![preview](https://github.com/endaytrer/markdone/assets/49216312/7eb9a930-ff20-4cac-8e87-94df00614516)

Powered by [WASM](https://webassembly.org/), [Rust](https://www.rust-lang.org),
[pulldown-cmark](https://github.com/endaytrer/pulldown-cmark) (a fork from [raphlinus/pulldown-cmark](https://github.com/raphlinus/pulldown-cmark))
and [CodeMirror](https://codemirror.net/).

### Try it!
Markdone is deployed at [markdone.danielgu.org](https://markdone.danielgu.org).

### Progress

- [x] Markdown editing
- [x] CommonMark Standard with extra TeX math support
- [x] Real-time preview
- [x] Save to local file
- [x] Load from local file
- [x] Print or print to PDF
- [ ] Local-storage filesystem to hold workspace
- [ ] Remote hosting for images
- [ ] Packing ans saving
- [ ] Export
- [ ] Functional menu bar
- [ ] Settings and key binding
- [ ] Themes and customization

### Run locally

Make sure to have `cargo`, `wasm-pack` and `npm` installed.

```bash
$ (cd libmarkdown && wasm-pack build --target web)
$ npm i
$ npm run serve # development server.
```

**Build production server**

```bash
$ (cd libmarkdown && wasm-pack build --target web)
$ npm run build
```

The bundled pack is located at `dist`.
