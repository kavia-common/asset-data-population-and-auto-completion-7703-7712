#!/bin/bash
cd /home/kavia/workspace/code-generation/asset-data-population-and-auto-completion-7703-7712/asset_devices_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

