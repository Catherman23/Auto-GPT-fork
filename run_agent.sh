#!/usr/bin/env bash
# load your OpenAI key
export OPENAI_API_KEY="sk-…your-key…"
# activate the venv
source "$(dirname "$0")/.venv/bin/activate"
# run the agent and append all output to agent.log
python "$(dirname "$0")/agent.py" >> "$(dirname "$0")/agent.log" 2>&1
