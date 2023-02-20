# First Visual Studio Code Extension

## Getting started

- [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)

```sh
npm install -g yo generator-code
```

```sh
yo code
```

```sh
     _-----_     ╭──────────────────────────╮
    |       |    │   Welcome to the Visual  │
    |--(o)--|    │   Studio Code Extension  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? What type of extension do you want to create? (Use arrow keys)
❯ New Extension (TypeScript)
  New Extension (JavaScript)
  New Color Theme
  New Language Support
  New Code Snippets
  New Keymap
  New Extension Pack
  New Language Pack (Localization)
  New Web Extension (TypeScript)
  New Notebook Renderer (TypeScript)

? What type of extension do you want to create? New Extension (TypeScript)
? What's the name of your extension? Hello World
? What's the identifier of your extension? hello-world
? What's the description of your extension?
? Initialize a git repository? No
? Bundle the source code with webpack? No
? Which package manager to use? npm
```

```sh
code hello-world
```

- Then, inside the editor, press `F5`. This will compile and run the extension in a new Extension Development Host window.
- Run the Hello World command from the Command Palette (`>Hello World`) in the new window.
- You should see the Hello World from HelloWorld! notification showing up. Success!

## Developing the extension

- [Docs](https://code.visualstudio.com/api/get-started/your-first-extension#developing-the-extension)
- `>Developer: Reload Window`

## Debugging the extension

- [Docs](https://code.visualstudio.com/api/get-started/your-first-extension#debugging-the-extension)
- `>View: Show Run and Debug`
