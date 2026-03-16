#!/usr/bin/env bash
set -euo pipefail

# discuss-skill installer
# Copies Claude Code adapter commands to ~/.claude/commands/

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_COMMANDS_DIR="$HOME/.claude/commands"

echo "discuss-skill installer"
echo "======================"
echo ""

# Create commands directory if needed
if [ ! -d "$CLAUDE_COMMANDS_DIR" ]; then
    echo "Creating $CLAUDE_COMMANDS_DIR..."
    mkdir -p "$CLAUDE_COMMANDS_DIR"
fi

# Copy Claude adapter commands
CLAUDE_ADAPTER_DIR="$SCRIPT_DIR/adapters/claude/.claude/commands"

if [ ! -d "$CLAUDE_ADAPTER_DIR" ]; then
    echo "Error: Claude adapter not found at $CLAUDE_ADAPTER_DIR"
    exit 1
fi

# Create scripts directory if needed
CLAUDE_SCRIPTS_DIR="$HOME/.claude/scripts"
if [ ! -d "$CLAUDE_SCRIPTS_DIR" ]; then
    echo "Creating $CLAUDE_SCRIPTS_DIR..."
    mkdir -p "$CLAUDE_SCRIPTS_DIR"
fi

echo "Installing Claude Code command..."
cp "$CLAUDE_ADAPTER_DIR/discuss.md" "$CLAUDE_COMMANDS_DIR/discuss.md"

echo "Installing council orchestrator..."
cp "$SCRIPT_DIR/scripts/headless-council.js" "$CLAUDE_SCRIPTS_DIR/headless-council.js"
mkdir -p "$CLAUDE_SCRIPTS_DIR/prompts"
cp "$SCRIPT_DIR/scripts/prompts/"*.template "$CLAUDE_SCRIPTS_DIR/prompts/"

echo ""
echo "Installed:"
echo "  $CLAUDE_COMMANDS_DIR/discuss.md"
echo "  $CLAUDE_SCRIPTS_DIR/headless-council.js"
echo "  $CLAUDE_SCRIPTS_DIR/prompts/*.template"
echo ""
echo "Usage:"
echo "  /discuss \"topic\" output.md                  Start external discussion (default)"
echo "  /discuss \"topic\" output.md --mode council   Start internal council debate"
echo "  /discuss existing-discussion.md              Join an existing discussion"
echo ""

# Copy protocol doc to a known location for reference
PROTOCOL_DIR="$HOME/.claude/discuss-protocol"
if [ ! -d "$PROTOCOL_DIR" ]; then
    mkdir -p "$PROTOCOL_DIR"
fi
cp "$SCRIPT_DIR/protocol/discuss-protocol-v1.md" "$PROTOCOL_DIR/"
echo "Protocol spec copied to: $PROTOCOL_DIR/discuss-protocol-v1.md"

echo ""
echo "For Codex: point Codex to adapters/codex/AGENTS.md in this repo."
echo ""
echo "Done."
