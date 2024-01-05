
use syntect::parsing::SyntaxSet;
use syntect::highlighting::{ThemeSet, Theme};
use syntect::html::highlighted_html_for_string;
use wasm_bindgen::prelude::*;
use pulldown_cmark::{Parser, Options, html, Event, Tag, TagEnd, CowStr};
#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert(&format!("Hello, world!"));
}

// Copyright (C) 2023 Enrico Guiraud
//
// This file is part of highlight-pulldown.
//
// highlight-pulldown is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// highlight-pulldown is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with highlight-pulldown. If not, see <http://www.gnu.org/licenses/>.

fn highlight<'a, It: Iterator<Item = Event<'a>>>(syntax_set: &SyntaxSet, theme: &Theme, events: It) -> Vec<Event<'a>> {
    let mut in_code_block = false;

    let mut syntax = syntax_set.find_syntax_plain_text();
    let mut lang: Option<String> = None;

    let mut to_highlight = String::new();

    let mut out_events = Vec::new();

    for event in events {
        match event {
            Event::Start(Tag::CodeBlock(kind)) => {
                syntax = match kind {
                    pulldown_cmark::CodeBlockKind::Fenced(code_lang) => {
                        let stref: &str = &code_lang;
                        lang = Some(String::from(stref));
                        syntax_set.find_syntax_by_token(&code_lang).unwrap_or(syntax_set.find_syntax_plain_text())
                    }
                    _ => syntax_set.find_syntax_plain_text()
                };
                in_code_block = true;
            },
            Event::End(TagEnd::CodeBlock) => {
                let mut html = String::from(format!("<div class=\"pre-wrapper\" lang=\"{}\">", &lang.unwrap()));
                html.push_str(&highlighted_html_for_string(&to_highlight, syntax_set, syntax, theme).unwrap());
                html.push_str("</div>");
                lang = None;
                to_highlight.clear();
                in_code_block = false;
                out_events.push(Event::Html(CowStr::from(html)));
            }
            Event::Text(t) => {
                if in_code_block {
                    to_highlight.push_str(&t);
                } else {
                    out_events.push(Event::Text(t));
                }
            }
            e => {
                out_events.push(e);
            }
        };
    }
    out_events
}

#[wasm_bindgen]
pub fn parse(text: &str) -> String {
    let syntax_set = SyntaxSet::load_defaults_newlines();
    let theme_set = ThemeSet::load_defaults();

    let theme = &theme_set.themes["base16-ocean.light"];

    let options = Options::all();

    let parser = Parser::new_ext(text, options);
    let parser = highlight(&syntax_set, theme, parser);
    let mut output = String::new();
    html::push_html(&mut output, parser.into_iter());

    output
}

#[cfg(test)]
mod tests; 