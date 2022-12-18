# Ubunutu base system
FROM --platform=linux/arm64/v8 arm64v8/ubuntu:latest
USER root
WORKDIR /root

ENV NODE_VERSION "16.16.0"

# Base system dependencies
RUN apt update && apt upgrade -y

# Build tools
RUN apt update && apt install -y nano git build-essential python3
RUN apt update && apt install -y libclang-dev

# curl
RUN apt install -y curl ca-certificates
ENV CURL_CA_BUNDLE "/etc/ssl/certs/ca-certificates.crt"

# create user -- replace 1000 with your uid and gid on host machine
RUN useradd --uid 1000 --user-group --create-home developer
WORKDIR /home/developer
USER developer

# Rust
RUN curl -o rustup.sh --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs
RUN chmod +x rustup.sh
RUN ./rustup.sh -y
ENV PATH "$PATH:/home/developer/.cargo/bin"
RUN cargo --version
RUN rustc --version

# Node.js
RUN curl -O --proto '=https' --tlsv1.2 -sSf https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-arm64.tar.gz
RUN tar xzvf node-v${NODE_VERSION}-linux-arm64.tar.gz
RUN rm node-v${NODE_VERSION}-linux-arm64.tar.gz
RUN ln -s node-v${NODE_VERSION}-linux-arm64 node
ENV PATH "$PATH:/home/developer/node/bin"
RUN npm -v
RUN node -v

# yarn
RUN npm install -g yarn

# cargo config to fix huge memory leak during cargo install
COPY ./.cargo/config .cargo/config
COPY ./.profile .

# Project dependencies
USER root
RUN apt update && apt install -y libv4l-dev
USER developer
