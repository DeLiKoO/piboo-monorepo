# Recommended node & electron versions
- electron 20.3.8
- node 16.15.0

# Will not run on electron version
- electron 21.3.1
- node 16.16.0
Issue with rscam due to frame capture buffer being outside V8's heap
FATAL ERROR: v8_ArrayBuffer_NewBackingStore When the V8 Sandbox is enabled, ArrayBuffer backing stores must be allocated inside the sandbox address space. Please use an appropriate ArrayBuffer::Allocator to allocate these buffers.
https://github.com/nodejs/abi-stable-node/issues/441
https://github.com/nodejs/node-addon-api/issues/1227



