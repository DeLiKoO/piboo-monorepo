# Building the Docker image for aarch64

Check [rust-node-builder-arm64v8's README.md](rust-node-builder-arm64v8/README.md) to build the docker image

# Building for aarch64 on Docker
```bash
docker run --privileged -it -v $(pwd):/home/developer/piboo rust-node-builder-arm64v8 /bin/bash
```

Once inside the guest shell, you are logged in as root. Wait for systemd to start and snap to update, then log in as `developer`:
```bash
su - developer
```

Go to the project's directory and build it
```bash
cd ~/piboo
npm install -g yarn
yarn install && yarn build
yarn dist
```
