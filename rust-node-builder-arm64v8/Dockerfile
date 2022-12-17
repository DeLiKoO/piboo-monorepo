FROM --platform=linux/arm64/v8 ubuntu:kinetic as builder

USER root
WORKDIR /root

# Base system updates
RUN apt update
RUN apt dist-upgrade --yes

# Dependencies for installing snap
RUN apt install --yes curl sudo jq squashfs-tools

# Grab the core snap from the stable channel and unpack it in the proper place
# (the 'Snap-CDN: none' header allows building in restricted network
# environments such as Launchpad builders)
RUN curl -L -H 'Snap-CDN: none' $(curl -H 'X-Ubuntu-Series: 16' -H 'X-Ubuntu-Architecture: arm64' 'https://api.snapcraft.io/api/v1/snaps/details/core' | jq '.download_url' -r) --output core.snap
RUN mkdir -p /snap/core
RUN unsquashfs -d /snap/core/current core.snap

# Grab the core18 snap from the stable channel and unpack it in the proper place
RUN curl -L -H 'Snap-CDN: none' $(curl -H 'X-Ubuntu-Series: 16' -H 'X-Ubuntu-Architecture: arm64' 'https://api.snapcraft.io/api/v1/snaps/details/core18' | jq '.download_url' -r) --output core18.snap
RUN mkdir -p /snap/core18
RUN unsquashfs -d /snap/core18/current core18.snap

# Grab the core20 snap from the stable channel and unpack it in the proper place
RUN curl -L -H 'Snap-CDN: none' $(curl -H 'X-Ubuntu-Series: 16' -H 'X-Ubuntu-Architecture: arm64' 'https://api.snapcraft.io/api/v1/snaps/details/core20' | jq '.download_url' -r) --output core20.snap
RUN mkdir -p /snap/core20
RUN unsquashfs -d /snap/core20/current core20.snap

# Grab the core22 snap from the stable channel and unpack it in the proper place
RUN curl -L -H 'Snap-CDN: none' $(curl -H 'X-Ubuntu-Series: 16' -H 'X-Ubuntu-Architecture: arm64' 'https://api.snapcraft.io/api/v1/snaps/details/core22' | jq '.download_url' -r) --output core22.snap
RUN mkdir -p /snap/core22
RUN unsquashfs -d /snap/core22/current core22.snap

# Grab the snapcraft snap from the stable channel and unpack it in the proper place
RUN curl -L -H 'Snap-CDN: none' $(curl -H 'X-Ubuntu-Series: 16' -H 'X-Ubuntu-Architecture: arm64' 'https://api.snapcraft.io/api/v1/snaps/details/snapcraft?channel=stable' | jq '.download_url' -r) --output snapcraft.snap
RUN mkdir -p /snap/snapcraft
RUN unsquashfs -d /snap/snapcraft/current snapcraft.snap

# Create a snapcraft runner
RUN mkdir -p /snap/bin
RUN echo "#!/bin/sh" > /snap/bin/snapcraft
RUN snap_version="$(awk '/^version:/{print $2}' /snap/snapcraft/current/meta/snap.yaml)" && echo "export SNAP_VERSION=\"$snap_version\"" >> /snap/bin/snapcraft
RUN echo 'exec "$SNAP/usr/bin/python3" "$SNAP/bin/snapcraft" "$@"' >> /snap/bin/snapcraft
RUN chmod +x /snap/bin/snapcraft

# Multi-stage build, only need the snaps from the builder. Copy them one at a
# time so they can be cached.
FROM ubuntu:bionic
COPY --from=builder /snap/core /snap/core
COPY --from=builder /snap/core18 /snap/core18
COPY --from=builder /snap/core20 /snap/core20
COPY --from=builder /snap/core22 /snap/core22
COPY --from=builder /snap/snapcraft /snap/snapcraft
COPY --from=builder /snap/bin/snapcraft /snap/bin/snapcraft

# Generate locale
RUN apt update && apt dist-upgrade --yes && apt install --yes sudo snapd locales && locale-gen en_US.UTF-8

# Set the proper environment
ENV LANG="en_US.UTF-8"
ENV LANGUAGE="en_US:en"
ENV LC_ALL="en_US.UTF-8"
ENV PATH="/snap/bin:$PATH"
ENV SNAP="/snap/snapcraft/current"
ENV SNAP_NAME="snapcraft"
ENV SNAP_ARCH="arm64"

# curl
RUN apt install -y curl ca-certificates
ENV CURL_CA_BUNDLE "/etc/ssl/certs/ca-certificates.crt"

# Build tools
RUN apt update && apt install -y libclang-dev
RUN apt update && apt install -y nano git build-essential
# RUN apt update && apt install -y nano git python3
# RUN curl 'https://bootstrap.pypa.io/pip/3.6/get-pip.py' --output get-pip.py
# RUN python3 get-pip.py
# TODO setup venv

# User account creation
# Replace 1000 with the id you use on your host machine
RUN useradd -u 1000 developer
USER developer
ENV NODE_VERSION "16.16.0"
WORKDIR /home/developer

# Rust
RUN curl -o rustup.sh --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs
RUN chmod +x rustup.sh
RUN ./rustup.sh -y
ENV PATH "$PATH:/home/developer/.cargo/bin"
RUN cargo --version
RUN rustc --version

# Node.js
RUN curl -O --proto '=https' --tlsv1.2 -sSf https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-arm64.tar.gz
RUN mkdir -p nodejs
RUN tar xzvf node-v${NODE_VERSION}-linux-arm64.tar.gz --directory nodejs --strip-components=1
ENV PATH "$PATH:/home/developer/nodejs/bin"
RUN npm -v
RUN node -v

# yarn
RUN npm install -g yarn

# cargo config to fix huge memory leak during cargo install
COPY ./.cargo/config .cargo/config

# copy bashrc for developer to setup its PATH environment variable
COPY .profile .

USER root
WORKDIR /root

# Native dependencies for the project
RUN apt update && apt install -y libv4l-dev
