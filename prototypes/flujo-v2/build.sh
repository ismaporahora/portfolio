#!/bin/sh
# Compila el prototipo: concatena las fuentes en orden (comparten scope global,
# como los <script type="text/babel"> del archivo de diseño) y transforma el JSX.
# Uso: ./build.sh /ruta/a/esbuild
set -e
cd "$(dirname "$0")"
ESBUILD="${1:-esbuild}"
cat src/shared.jsx src/steps.jsx src/retro.jsx src/flow.jsx src/result.jsx \
    src/screens-static.jsx src/screens-product.jsx src/newgrade.jsx src/gradehome2.jsx src/main.jsx \
  | "$ESBUILD" --loader=jsx --minify --target=es2019 --legal-comments=none > app.js
echo "app.js: $(wc -c < app.js) bytes"
