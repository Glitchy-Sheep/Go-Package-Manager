<p align="center">
  <img src="https://raw.githubusercontent.com/Glitchy-Sheep/Go-Package-Manager/refs/heads/main/assets/header.png" width="700"/>
</p>

The **Go Package Manager** is a Visual Studio Code extension designed to make working with Go packages effortless. 

**Install your go packages by their memorable names** instead of whole module.

**Or even use keywords** like `router` or `database`

<img src="https://raw.githubusercontent.com/Glitchy-Sheep/Go-Package-Manager/refs/heads/main/assets/showcase.gif">

## Features ✨

- **Search/Install Go Packages directly from VSCode**: You can also check their licenses and used count.
- **Sorted by Popularity**: Find reliable packages faster.
- **Auto Insert `import...` and `go get` Command**.
- **Open Package in Browser**: One-click to open any Go package in your default browser for further exploration.

## Guide 📃

1. Open command palette (`Ctrl + Shift + P`)
2. Start typing any of the available commands (or their part):
    - `GPM: Add Go Package (go get)`
    - `GPM: Insert Go Package Import (Path)`
3. Enter query (package name or keywords)
4. Find package of your need and use it with pleasure ✨


## Requirements ⚙️

The only things you need are:
- **Internet connection** - for parsing packages information.
- **Go**: Of course 😁

## Extension Settings ⚙️

This extension does not require additional settings (*yet*). 
However, you can configure some behavior/hotkeys for commands to make it even faster.

## Why did I build it 🔍

Go's `go get` and `import` system has always frustrated me.

Coming from languages like Python, JavaScript, and Dart, *I missed the simplicity* of just installing packages `by name` — without dealing with `host/nickname/package` paths.

**I could memorize packages, but github nicknames...**

**This extension was born out of that pain.** 
I just wanted to install a few packages, but instead had to:

- Look up each package's page
- Copy its full import path
- Paste it into my code/terminal
- Break my coding flow state
- Run `go mod tidy`
- And sometimes lose progress due to an accidental Ctrl+S that auto-formatted away my unused (yet) imports

It was especially tedious when I was just learning the language.
So, I built the tool to solve this problem.

## Roadmap 🔧
- [x] Search packages by name or keyword
- [x] Show basic package information (used by / license / description)
- [x] Auto-insert go get command
- [x] Open package in browser
- [x] Insert import into editor or clipboard
- [ ] Settings for better UX
- [ ] Batch install
- [ ] Favorite packages/packs so you don't need to even remember their names and be the laziest person in da world.


## Release Notes 📢

### 1.1.0
- Enhance look of packages list (remove obsolete http... part and use import path instead)

### 1.0.2
- Make gopher bigger (logo resolution 128->1024)

### 1.0.1
- Add new gopher logo for the extension

### 1.0.0
- Initial release: Search, install, and manage Go packages with ease! 🎉
