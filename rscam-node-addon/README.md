# rscam-node-addon

WebCam support addon for node.js based on rscam (v4l2)

# Base system dependencies
sudo apt update && sudo apt upgrade -y

# Build tools
sudo apt install -y nano git build-essential python3
sudo apt install -y llvm libclang-dev libv4l-dev

# Prerequisites for cross compilation
### sudo dpkg --add-architecture arm64 ## nope
sudo apt update && sudo apt upgrade -y
sudo apt install -y gcc-aarch64-linux-gnu binutils-aarch64-linux-gnu
sudo apt install -y llvm libclang-dev libv4l-dev
rustup target add aarch64-unknown-linux-gnu
pip3 install cross-sysroot

# Cross compilation
cross-sysroot --distribution debian --distribution-version stable --architecture arm64 --build-root ~/.cross-sysroot/aarch64-unknown-linux-gnu packages.list