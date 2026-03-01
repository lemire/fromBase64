# Base64 Decoding Benchmark

This project benchmarks the performance of `Uint8Array.fromBase64` for decoding base64-encoded data using different datasets.

## Datasets

- **Images**: Single base64-encoded image files (`bing.txt`, `googlelogo.txt`).
- **DNS**: Multiple base64-encoded lines from `swedenzonebase.txt`, decoded individually.
- **Emails**: Multiple base64-encoded email files, decoded individually and concatenated.

## Requirements

- Node.js (version 25.5.0 or later for native `Uint8Array.fromBase64` support) or Bun.
- The base64 data files in the `base64data/` directory.

## Running the Benchmark

### With Node.js

```bash
node benchmark.js
```

### With Bun

```bash
bun run benchmark.js
```

The script will load all data at startup, then run 100 iterations of each benchmark, reporting average, min, and max times, as well as throughput in GB/s (where 1 GB = 1000³ bytes).

## Output Example

```
Loading data...
Data loaded.
Running benchmark: Decode bing.txt
  Min throughput: 1.500 GB/s
  Average throughput: 1.645 GB/s
  Max throughput: 2.000 GB/s

...
```

## Notes

- If `Uint8Array.fromBase64` is not available, it falls back to `Buffer.from` with base64 decoding.
- Benchmarks measure decoding performance only; data loading is done upfront.