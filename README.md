# Bazel TypeScript Demo

This repository contains the code from my blog post "[Building TypeScript with Bazel](https://blog.mgechev.com/2018/11/19/introduction-bazel-typescript-tutorial/)".

## Usage

To setup the project run:

```bash
yarn
```

To build the project:

```bash
./node_modules/.bin/bazel build :bundle
```

Execute the produced bundle:

```bash
node bazel-bin/bundle.js
```

## License

MIT

