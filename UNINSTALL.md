# Complete Uninstall Guide for n8n-nodes-infomaniak

If you're experiencing issues with the Infomaniak node loading TypeScript source files instead of compiled JavaScript, follow this complete uninstallation procedure.

## Problem Symptoms

```
TypeError: Cannot read properties of undefined (reading 'getAll')
at execute (/var/lib/n8n/.n8n/nodes/node_modules/n8n-nodes-infomaniak/nodes/...)
```

The path shows `.../nodes/...` instead of `.../dist/nodes/...`

## Complete Uninstall & Reinstall

### Step 1: Stop n8n

```bash
# If running as a service
sudo systemctl stop n8n

# If running in terminal
# Press Ctrl+C

# If running via Docker
docker stop n8n
```

### Step 2: Remove the Package Completely

```bash
# Navigate to n8n directory
cd ~/.n8n

# Remove the package
npm uninstall n8n-nodes-infomaniak

# IMPORTANT: Manually delete the entire module folder
rm -rf node_modules/n8n-nodes-infomaniak
rm -rf nodes/node_modules/n8n-nodes-infomaniak

# Clear npm cache
npm cache clean --force
```

### Step 3: Clean n8n Cache

```bash
# Remove n8n cache directories
rm -rf ~/.n8n/nodes
rm -rf ~/.n8n/cache
```

### Step 4: Reinstall the Latest Version

```bash
# Reinstall (use version 1.5.2 or later)
npm install n8n-nodes-infomaniak@latest

# Verify installation
npm list n8n-nodes-infomaniak
```

### Step 5: Restart n8n

```bash
# Restart n8n
n8n start

# Or if using systemd
sudo systemctl start n8n

# Or if using Docker
docker start n8n
```

## Docker-Specific Instructions

If using Docker:

```bash
# Stop container
docker stop n8n

# Remove the container
docker rm n8n

# Remove the volume (WARNING: This removes ALL n8n data)
docker volume rm n8n_data

# Or if you want to keep workflows but remove nodes
docker exec n8n rm -rf /home/node/.n8n/nodes
docker exec n8n rm -rf /home/node/.n8n/cache

# Restart container
docker start n8n
```

## Verification

After reinstalling:

1. Go to **Settings** → **Community Nodes**
2. Check that version is **1.5.2** or later
3. Create a test workflow with the Infomaniak node
4. The paths in any errors should show `.../dist/nodes/...` not `.../nodes/...`

## Still Having Issues?

If the problem persists:

```bash
# Check what's actually installed
ls -la ~/.n8n/node_modules/n8n-nodes-infomaniak/

# You should see ONLY:
# - dist/ directory
# - package.json
# - index.js
# - README.md
# - LICENSE.md

# You should NOT see:
# - nodes/ directory (source files)
# - credentials/ directory (source files)
```

If you see `nodes/` or `credentials/` folders, the package was not installed correctly. Repeat the uninstall procedure.
