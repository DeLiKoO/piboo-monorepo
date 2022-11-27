# Ubunutu base system
FROM --platform=linux/arm64/v8 arm64v8/ubuntu:latest
WORKDIR /root

ENV NODE_VERSION "16.16.0"

# Base system dependencies
RUN apt update && apt upgrade -y

# Build tools
RUN apt update && apt install -y nano git build-essential python3
RUN apt update && apt install -y libclang-dev libv4l-dev
# RUN apt install -y gcc-aarch64-linux-gnu

# curl
RUN apt install -y curl ca-certificates
ENV CURL_CA_BUNDLE "/etc/ssl/certs/ca-certificates.crt"

# Rust
RUN curl -o rustup.sh --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs
RUN chmod +x rustup.sh
RUN ./rustup.sh -y
ENV PATH "$PATH:/root/.cargo/bin"
RUN cargo --version
RUN rustc --version

# Node.js
RUN curl -O --proto '=https' --tlsv1.2 -sSf https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-arm64.tar.gz
RUN tar xzvf node-v${NODE_VERSION}-linux-arm64.tar.gz
RUN ln -s /root/node-v${NODE_VERSION}-linux-arm64 /opt/node-v${NODE_VERSION}
RUN ln -s /opt/node-v${NODE_VERSION} /opt/node
ENV PATH "$PATH:/opt/node/bin"
RUN npm -v
RUN node -v

# yarn
RUN npm install -g yarn

# cargo config to fix huge memory leak during cargo install
COPY ./.cargo/config .cargo/config
