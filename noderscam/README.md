# noderscam (experimental)

WebCam support addon for node.js based on rscam (v4l2)
This is meant to be a cleaner implementation of the previous `rscam-node-addon`

# Native compilation or compilation under QEMU/Docker

## Base system dependencies
```bash
sudo apt update && sudo apt upgrade -y
```

## Build tools
```bash
sudo apt install -y nano git build-essential python3 llvm libclang-dev
```

## Dependencies
```bash
sudo apt install -y libv4l-dev
```

# Cross compilation for aarch64 (not yet working)

## Cross compilation build tools

```bash
sudo apt install -y gcc-aarch64-linux-gnu binutils-aarch64-linux-gnu crossbuild-essential-arm64
rustup target add aarch64-unknown-linux-gnu
```

## Building a sysroot
```bash
sudo apt install -y python3-pip python3-dev libpython3-dev libsqlite3-dev
pip3 install cross-sysroot
PATH=$PATH:~/.local/bin
cross-sysroot --distribution debian --distribution-version stable --architecture arm64 --build-root ~/.cross-sysroot/aarch64-unknown-linux-gnu packages.list
```

## Adding dependecies from source (TBD)
Requires source for
- libv4l2
- libjpeg6
- ...

## Building (not yet working)

```bash
yarn workspace noderscam build --target=aarch64-unknown-linux-gnu
```
