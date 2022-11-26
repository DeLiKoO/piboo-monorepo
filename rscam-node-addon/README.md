# rscam-node-addon

WebCam support addon for node.js based on rscam (v4l2)

# Base system dependencies
sudo apt update && apt upgrade -y

# Build tools
sudo apt install -y nano git build-essential python3
sudo apt install -y llvm libclang-dev libv4l-dev

# Prerequisites for cross compilation
sudo apt install -y gcc-aarch64-linux-gnu binutils-aarch64-linux-gnu
rustup target add aarch64-unknown-linux-gnu
