# noderscam

WebCam support addon for node.js based on rscam (v4l2)

# Base system dependencies
sudo apt update && apt upgrade -y

# Build tools
sudo apt install -y nano git build-essential python3 python3-pip
sudo apt install -y llvm libclang-dev libv4l-dev

# Prerequisites for cross compilation
sudo apt install -y gcc-aarch64-linux-gnu binutils-aarch64-linux-gnu
rustup target add aarch64-unknown-linux-gnu

sudo apt install -y python3-pip python3-dev libpython3-dev libsqlite3-dev


pip3 install cross-sysroot

PATH=$PATH:~/.local/bin
cross-sysroot

PATH=$PATH:~/.local/bin

cross-sysroot --distribution debian --distribution-version stable --architecture arm64 --build-root ~/.cross-sysroot/aarch64-unknown-linux-gnu packages.list


# Cross compilation
yarn workspace noderscam build --target=aarch64-unknown-linux-gnu