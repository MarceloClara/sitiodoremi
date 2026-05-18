#!/usr/bin/env bash
# PreToolUse hook: bloqueia instalacoes Python no sistema local.
# Permite: docker, venv ativado, binario direto do venv, criacao de venv, VIRTUAL_ENV inline.

set -u

# Le o comando do JSON do stdin
cmd=$(jq -r '.tool_input.command // ""' 2>/dev/null)

# Sem comando -> nao opina
if [ -z "$cmd" ]; then
  exit 0
fi

# === ALLOWLIST ===

# 1) Comandos Docker (docker run/exec/compose) - sandboxados
if [[ "$cmd" =~ (^|[[:space:];|\&])(sudo[[:space:]]+)?docker[[:space:]] ]]; then
  exit 0
fi

# 2) Criacao de venv ("python -m venv X") sem install no mesmo comando
if [[ "$cmd" =~ python[3]?[[:space:]]+-m[[:space:]]+venv[[:space:]] ]] \
   && [[ ! "$cmd" =~ (pip[[:space:]]+install|easy_install|pipx[[:space:]]+install|uv[[:space:]]+pip[[:space:]]+install) ]]; then
  exit 0
fi

# 3) Uso direto do binario do venv (.venv/bin/pip, ./venv/bin/pip, venv/bin/pip)
if [[ "$cmd" =~ (^|[[:space:];|\&])(\./)?\.?venv/bin/pip([[:space:]]|$) ]]; then
  exit 0
fi

# 4) Ativacao de venv antes do comando (source ... activate && ...)
if [[ "$cmd" =~ (source[[:space:]]+|^[[:space:]]*\.[[:space:]]+|[[:space:]]\.[[:space:]]+)\.?venv/bin/activate[[:space:]]*(\&\&|\;) ]]; then
  exit 0
fi

# 5) VIRTUAL_ENV definido inline antes do comando
if [[ "$cmd" =~ ^[[:space:]]*VIRTUAL_ENV= ]]; then
  exit 0
fi

# === BLOCKLIST ===
block_match=""
if [[ "$cmd" =~ (^|[[:space:];|\&])pip[3]?[[:space:]]+install ]]; then
  block_match="pip install"
elif [[ "$cmd" =~ python[3]?[[:space:]]+-m[[:space:]]+pip[[:space:]]+install ]]; then
  block_match="python -m pip install"
elif [[ "$cmd" =~ (^|[[:space:];|\&])easy_install ]]; then
  block_match="easy_install"
elif [[ "$cmd" =~ (^|[[:space:];|\&])pipx[[:space:]]+install ]]; then
  block_match="pipx install"
elif [[ "$cmd" =~ (^|[[:space:];|\&])uv[[:space:]]+pip[[:space:]]+install ]]; then
  block_match="uv pip install"
fi

if [ -n "$block_match" ]; then
  reason="BLOQUEADO: \"$block_match\" detectado fora de venv/docker.
Nao instale pacotes Python no Python do sistema.

Como corrigir:
  1) Criar venv:           python3 -m venv .venv
  2) Ativar e instalar:    source .venv/bin/activate && pip install <pkg>
  3) Binario direto:       ./.venv/bin/pip install <pkg>
  4) Container Docker:     docker run --rm -v \$PWD:/app python pip install <pkg>
  5) Env var inline:       VIRTUAL_ENV=.venv ./.venv/bin/pip install <pkg>"

  jq -n --arg reason "$reason" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
fi

exit 0
