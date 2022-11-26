# rust-node-builder-arm64v8

Ubuntu-based Docker image targeting arm64v8 CPUs
for building Rust and Node.js 12 projects

Generated builds are suited to use on Raspberry Pi 4 with a 64-bit Linux OS (recommended: Raspian, Ubuntu)

## Prerequisite : installing QEMU on your host machine 
If your host machine is x86_64, please run the following commands to install qemu-user-static so the aarch64 code within the container can be run through QEMU.
```
sudo apt update
sudo apt install -y qemu-user-static
```

## Building the image
```
docker buildx build -t rust-node-builder-arm64v8:latest --platform linux/arm64/v8 .
```

## Running an interactive shell
```
docker run -it rust-node-builder-arm64v8
root@6e3f4aee301b:~# uname -m
aarch64
```
