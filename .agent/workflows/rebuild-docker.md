---
description: Rebuild and restart the Docker container
---

1. Stop the running containers:
   ```powershell
   docker-compose down
   ```

2. Rebuild the containers without cache (to ensure latest code changes are applied):
   ```powershell
   docker-compose build --no-cache
   ```

3. Start the containers in detached mode:
   ```powershell
   docker-compose up -d
   ```

4. Follow the logs to ensure everything starts correctly:
   ```powershell
   docker-compose logs -f
   ```
