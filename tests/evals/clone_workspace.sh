#!/bin/bash
set -e

# clone_workspace.sh
# Usage: ./clone_workspace.sh <scenario> [run_name]

SCENARIO=$1
RUN_NAME=${2:-$(date +%Y%m%d_%H%M)}

if [ -z "$SCENARIO" ]; then
    echo "Usage: ./clone_workspace.sh <scenario> [run_name]"
    echo "Available scenarios:"
    ls scenarios
    exit 1
fi

BASE_DIR=$(cd "$(dirname "$0")" && pwd)
TEMPLATE_DIR="$BASE_DIR/templates"
SCENARIO_DIR="$BASE_DIR/scenarios/$SCENARIO"
WORKSPACE_DIR="$BASE_DIR/workspaces/${SCENARIO}_${RUN_NAME}"

if [ ! -d "$SCENARIO_DIR" ]; then
    echo "Error: Scenario '$SCENARIO' not found in $BASE_DIR/scenarios/"
    exit 1
fi

echo "Creating workspace: $WORKSPACE_DIR"
mkdir -p "$WORKSPACE_DIR"

# 1. Copy template source code and shared artifacts
echo "Step 1: Cloning template..."
cp -r "$TEMPLATE_DIR/"* "$WORKSPACE_DIR/"

# 2. Copy scenario-specific artifacts (overwrites/merges)
echo "Step 2: Applying scenario configuration..."
cp -r "$SCENARIO_DIR/gsd-lite" "$WORKSPACE_DIR/"

echo "---------------------------------------------------"
echo "✅ Workspace Ready!"
echo "Path: $WORKSPACE_DIR"
echo ""
echo "To run this evaluation:"
echo "1. Connect fs-mcp to the workspace root:"
echo "   uvx fs-mcp@latest --root $WORKSPACE_DIR"
echo ""
echo "2. Start OpenCode and follow the scenario script:"
echo "   $SCENARIO_DIR/scenario.md"
echo "---------------------------------------------------"