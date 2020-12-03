# publish [![](https://img.shields.io/npm/v/@lets/publish.svg)](https://www.npmjs.com/package/@lets/publish) [![](https://img.shields.io/badge/source--000000.svg?logo=github&style=social)](https://github.com/omrilotan/publish)

## 🛵 Publish only if this version was not already published

```bash
npx @lets/publish@1
```

Options:
```bash
npx @lets/publish -- [--help] [--dry-run]
```

| Option | Meaning
| - | -
| --help | Print this help document
| --dry-run | Declare what you were going to do but don't do it

Github workflow example
```yml
name: Publish
on:
  - push
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version:
          - '14'
    steps:
    - uses: actions/checkout@v2
    - name: Add NPM token
      if: github.ref == 'refs/heads/main'
      run: echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
      env:
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    - name: Build and Publish
      if: github.ref == 'refs/heads/main'
      run: npx @lets/publish@1
```
