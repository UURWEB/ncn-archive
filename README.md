# NCN Archived Website — GitHub Pages Edition

This is a completely static early-2010s website and ARG for the former NCN.

- **Northern Confederation of Noble** was the smaller, earlier state centered on Noble.
- **Northern Confederate Nations** was the title used at the NCN's greatest territorial size.
- **Noblecrest** was its capital and administrative center.
- The flag is a vertical **red–white–red** tricolor.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload **the contents of this folder** to the repository root. `index.html` must be at the top level, not inside another folder.
3. Open the repository's **Settings**.
4. Select **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`, then save.
7. GitHub will provide the public website address.

No Node.js, npm, database, server, or build command is needed.

## Static ARG behavior

The terminal simulates a recovered backend entirely in the browser. It uses `localStorage` to remember archive clearance and gate six hidden routes. This is convincing for an ARG, but it is not real security: anyone with access to the GitHub repository can inspect the files.

### Owner passphrases

1. `CREST-14`
2. `WHITE-CORRIDOR`
3. `NOBLE-IS-NOT-DEAD`

### Main commands

```text
HELP
STATUS
WHOAMI
AUTH <passphrase>
DIR
OPEN <file-id>
ROUTES
ROUTE <route-id>
NODES
PING <node>
TRACE <node>
LOGS relay
MAIL
READMAIL <id>
LOGOUT
```

### Full test path

```text
AUTH CREST-14
DIR
OPEN ledger-7
OPEN relay-log
ROUTES
ROUTE relay-nc14

AUTH WHITE-CORRIDOR
OPEN white-corridor
OPEN presidium-minutes
ROUTES
ROUTE continuity

AUTH NOBLE-IS-NOT-DEAD
OPEN root-index
OPEN remnant-orders
PING pres-z
ROUTES
ROUTE presidium-zero
```

## Editing

- Public pages are normal `.html` files in the root and `archive/` folder.
- Styles are in `assets/styles.css`.
- Terminal content and commands are in `assets/terminal.js`.
- Hidden pages are in `system/`.
- Gate behavior is in `assets/gate.js`.

The passphrases are compared as hashes rather than appearing plainly in the terminal script, but this is only light concealment suitable for a game.
