#!/usr/bin/env bash
# rename-module.sh — Rename a MagicMirror React module
# Usage  : ./rename-module.sh <NewModuleName>
# Example: ./rename-module.sh MMM-ReactClock
#
# First run: automatically removes the template .git folder.
# Safe to run multiple times — detects the current name automatically
# from package.json and replaces all three name variants:
#   • Proper-case  (MMM-ReactSample)
#   • kebab-lower  (mmm-reactsample)  — CSS classes, package.json name, etc.
#   • camelCase    (mmmReactsample)   — dataset JS properties

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

# ── helpers ───────────────────────────────────────────────────────────────────

die() { echo "ERROR: $*" >&2; exit 1; }

# kebab-case -> camelCase  (e.g. "mmm-foo-bar" -> "mmmFooBar")
to_camel() {
    local result="" first=true part
    IFS='-' read -ra _parts <<< "$1"
    for part in "${_parts[@]}"; do
        if $first; then
            result="$part"
            first=false
        else
            result="${result}$(printf '%s' "${part:0:1}" | tr '[:lower:]' '[:upper:]')${part:1}"
        fi
    done
    printf '%s' "$result"
}

# In-place sed compatible with macOS (BSD sed) and Linux (GNU sed)
sedi() {
    if [[ "$(uname)" == "Darwin" ]]; then
        sed -i '' "$@"
    else
        sed -i "$@"
    fi
}

# ── argument validation ───────────────────────────────────────────────────────

[[ $# -eq 1 ]] || die "Usage: $0 <NewModuleName>  (e.g. $0 MMM-ReactClock)"
NEW_NAME="$1"
[[ "$NEW_NAME" == MMM-* ]] || die "New name must start with 'MMM-'  (got: '$NEW_NAME')"

# ── detect current name from package.json ─────────────────────────────────────

[[ -f package.json ]] || die "package.json not found — run from the module root directory."

if command -v node >/dev/null 2>&1; then
    OLD_JS=$(node -e "process.stdout.write(require('./package.json').main || '')")
else
    OLD_JS=$(grep '"main"' package.json | head -1 \
        | sed 's/.*"main"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
fi

OLD_NAME="${OLD_JS%.js}"
[[ -n "$OLD_NAME" ]] || die "Could not read 'main' field from package.json."
[[ "$OLD_NAME" == MMM-* ]] || \
    die "Current name '$OLD_JS' from package.json does not start with 'MMM-'."

# ── remove template .git on first run ────────────────────────────────────────

if [[ -d .git ]]; then
    # Check whether this still looks like the template repo
    TEMPLATE_REMOTE="https://github.com/alphaorderly/Magic-Mirror-v2-React-module-template"
    CURRENT_REMOTE=$(git -C . remote get-url origin 2>/dev/null || true)
    if [[ "$CURRENT_REMOTE" == "$TEMPLATE_REMOTE"* ]]; then
        echo "Detected template .git folder — removing it."
        rm -rf .git
        echo "  removed : .git  (run 'git init' to start your own repo)"
    else
        echo "Note: .git exists but points to '$CURRENT_REMOTE' — leaving it as-is."
    fi
    echo ""
fi

if [[ "$OLD_NAME" == "$NEW_NAME" ]]; then
    echo "Module is already named '$NEW_NAME' — nothing to do."
    exit 0
fi

# ── derive all three name variants ────────────────────────────────────────────

OLD_LOWER=$(printf '%s' "$OLD_NAME" | tr '[:upper:]' '[:lower:]')
OLD_CAMEL=$(to_camel "$OLD_LOWER")

NEW_LOWER=$(printf '%s' "$NEW_NAME" | tr '[:upper:]' '[:lower:]')
NEW_CAMEL=$(to_camel "$NEW_LOWER")

echo "Renaming  : $OLD_NAME  →  $NEW_NAME"
echo "  kebab   : $OLD_LOWER  →  $NEW_LOWER"
echo "  camel   : $OLD_CAMEL  →  $NEW_CAMEL"
echo ""

# ── replace occurrences in source files ──────────────────────────────────────

CHANGED=0
while IFS= read -r file; do
    if grep -qF "$OLD_NAME"  "$file" 2>/dev/null \
    || grep -qF "$OLD_LOWER" "$file" 2>/dev/null \
    || grep -qF "$OLD_CAMEL" "$file" 2>/dev/null
    then
        sedi \
            -e "s/${OLD_NAME}/${NEW_NAME}/g"   \
            -e "s/${OLD_LOWER}/${NEW_LOWER}/g" \
            -e "s/${OLD_CAMEL}/${NEW_CAMEL}/g" \
            "$file"
        echo "  updated : $file"
        CHANGED=$((CHANGED + 1))
    fi
done < <(find . \
    \( -path ./node_modules -o -path ./dist -o -path ./.git \) -prune \
    -o -type f \( \
        -name "*.js"   -o -name "*.ts"   -o -name "*.tsx"  \
        -o -name "*.json" -o -name "*.md"  -o -name "*.css" \
        -o -name "*.html" -o -name "*.yml" -o -name "*.yaml" \
    \) -print | sort)

# ── rename the module wrapper .js file ───────────────────────────────────────

OLD_JS_PATH="./${OLD_NAME}.js"
NEW_JS_PATH="./${NEW_NAME}.js"

if [[ -f "$OLD_JS_PATH" ]]; then
    mv "$OLD_JS_PATH" "$NEW_JS_PATH"
    echo "  renamed : ${OLD_NAME}.js  →  ${NEW_NAME}.js"
elif [[ -f "$NEW_JS_PATH" ]]; then
    echo "  (wrapper already at ${NEW_NAME}.js)"
else
    echo "WARNING: Expected wrapper '${OLD_JS_PATH}' not found — skipping file rename."
fi

echo ""
echo "Done — $CHANGED file(s) updated."
echo ""
if [[ ! -d .git ]]; then
    echo "Next step: initialise your own git repo:"
    echo "  git init && git add . && git commit -m 'chore: initial commit'"
    echo ""
fi
echo "Tip: To also rename the directory itself, run from the parent:"
echo "     mv $OLD_NAME $NEW_NAME"
