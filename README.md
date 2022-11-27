# Building the Docker image for aarch64

Check [rust-node-builder-arm64v8's README.md](rust-node-builder-arm64v8/README.md) to build the docker image

# Building for aarch64 on Docker
`docker run -m 4096m -it -v $(pwd):/Projects rust-node-builder-arm64v8 /bin/bash`

Once inside the guest shell:
```
cd /Projects
npm install -g yarn
yarn install && yarn build && yarn dist
```
