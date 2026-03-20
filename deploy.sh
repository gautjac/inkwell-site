#!/bin/bash
cd "$(dirname "$0")"

TOKEN="nfp_YxDKbaSR3z3xTJPNbDPvJcPHCBySoq2Z1fe3"

# Create site if needed (will fail silently if exists)
NETLIFY_AUTH_TOKEN=$TOKEN npx netlify-cli sites:create --name inkwell-landing-page --account-slug 6941ac27009ae343cb306d6f 2>/dev/null || true

# Deploy
NETLIFY_AUTH_TOKEN=$TOKEN npx netlify-cli deploy --prod --dir=.

echo "Done!"
