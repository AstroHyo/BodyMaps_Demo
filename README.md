# BodyMaps Demo

## Environment Variables

- `RUNPOD_ENDPOINT`: RunPod Serverless endpoint URL. Exclude trailing `/runsync`.
- `RUNPOD_ENDPOINT_KEY`: RunPod API key
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob token
- `PASSWORD`: Set to password for (insecure and basic) authentication.

## Devs

```bash
$ npm run dev
```

## RunPod Serverless Worker

RunPod worker Dockerfile can be found at [AstroHyo/SuPreM_demo/runpod-worker](https://github.com/AstroHyo/SuPreM_demo/tree/main/runpod-worker), and it requires to be at least 9980cb06e406213f367f86719425fc2cfd8bf759 or later commit.
