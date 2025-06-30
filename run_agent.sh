#!/usr/bin/env bash
# ensure UTF-8 locale (optional—see note below)
# export LANG=en_US.UTF-8
# export LC_ALL=en_US.UTF-8

# your OpenAI key
export OPENAI_API_KEY="sk-…your-real-key…"

# activate the virtualenv
source "$(dirname "$0")/.venv/bin/activate"

# run the agent and append logs
python "$(dirname "$0")/agent.py" >> "$(dirname "$0")/agent.log" 2>&1

