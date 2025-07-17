# Magic Gradio Proxy

A Python backend service that acts as a proxy between ArticulateHub and the Magic Articulate HuggingFace Space.

## Purpose

This service solves the Node.js compatibility issues when directly calling HuggingFace Gradio clients from the ArticulateHub backend. It provides a stable Python-based intermediary for AI model interactions.

## Architecture

```
ArticulateHub Backend → HTTP API → Magic Gradio Proxy → HF Space → AI Model
```

## Features

- **FastAPI REST API** with comprehensive endpoints
- **File Upload Support** with base64 encoding
- **Processing Pipeline** for 3D model articulation
- **Multi-format Downloads** (JSON, OBJ, TXT, ZIP)
- **Security Features** including IP whitelisting
- **Structured Logging** with daily rotation
- **Health Monitoring** and connection management
- **Docker Support** for containerized deployment

## API Endpoints

### Health Check
- `GET /health` - Service health and connection status

### File Operations
- `POST /upload` - Upload 3D model files (base64 encoded)
- `POST /process` - Process uploaded models through AI
- `POST /download` - Download processing results

### Management
- `POST /reconnect` - Force reconnection to HF Space

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your HF token and space name
```

### 3. Run the Service

```bash
python main.py
```

The service will start on `http://localhost:5719`

## Configuration

Environment variables can be set in `.env` file:

- `HOST` - Service host (default: 0.0.0.0)
- `PORT` - Service port (default: 5719)
- `HF_TOKEN` - HuggingFace API token
- `HF_SPACE` - HuggingFace Space name
- `ALLOWED_IPS` - Comma-separated list of allowed IP addresses
- `REQUEST_TIMEOUT` - Request timeout in seconds
- `LOG_LEVEL` - Logging level (INFO, DEBUG, WARNING, ERROR)

## Docker Deployment

### Build Image

```bash
docker build -t magic-gradio-proxy .
```

### Run Container

```bash
docker run -d \
  --name magic-proxy \
  -p 5719:5719 \
  -v $(pwd)/logs:/app/logs \
  -e HF_TOKEN=your_token \
  -e HF_SPACE=your_space \
  magic-gradio-proxy
```

## Usage Example

### Upload and Process Model

```python
import requests
import base64

# 1. Upload model
with open("model.obj", "rb") as f:
    file_content = base64.b64encode(f.read()).decode()

upload_response = requests.post("http://localhost:5719/upload", json={
    "file_name": "model.obj",
    "file_content": file_content,
    "file_type": "obj"
})

file_path = upload_response.json()["file_path"]

# 2. Process model
process_response = requests.post("http://localhost:5719/process", json={
    "model_file_path": file_path,
    "text_prompt": "humanoid skeleton for animation",
    "confidence": 0.8,
    "preview": True
})

result = process_response.json()
```

## Testing

Run the basic test suite:

```bash
python tests/test_client.py
```

## Integration with ArticulateHub

The proxy service is designed to be called from the ArticulateHub NestJS backend:

```typescript
// In your NestJS service
const proxyResponse = await this.httpService.post('http://localhost:5719/process', {
  model_file_path: uploadedFilePath,
  text_prompt: userPrompt,
  seed: 42
}).toPromise();
```

## Security

- **IP Whitelisting**: Only allows connections from specified IP addresses
- **Token Authentication**: Uses HuggingFace tokens for API access
- **Input Validation**: Pydantic models ensure data integrity
- **Error Handling**: Prevents information leakage through proper error messages

## Logging

The service uses structured JSON logging with daily rotation:
- Logs are stored in `logs/magic_proxy_YYYY-MM-DD.log`
- Old logs are automatically cleaned up after 7 days
- All API requests and responses are logged for debugging

## Troubleshooting

### Connection Issues
- Verify HF_TOKEN is valid
- Check HF_SPACE name is correct
- Ensure internet connectivity to HuggingFace

### Permission Errors
- Check file permissions on logs directory
- Verify Docker user permissions if using containers

### Performance Issues
- Increase REQUEST_TIMEOUT for large models
- Monitor logs for processing times
- Consider horizontal scaling for high load

## License

MIT License