#!/usr/bin/env bash
# PreToolUse hook for Edit|Write: blocks edits to Drizzle migrations that git tracks (committed or
# staged). Untracked files, such as a fresh --custom migration, stay editable. Bash edits are not
# covered. Fails closed: any unexpected error blocks the edit.

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null) || {
  echo "protect-migrations: could not parse hook input" >&2; exit 2; }
[ -z "$file" ] && exit 0

case "$file" in
  */packages/db/drizzle/*) ;;
  *) exit 0 ;;
esac

dir=$(dirname "$file")
while [ ! -d "$dir" ]; do dir=$(dirname "$dir"); done

if git -C "$dir" ls-files --error-unmatch "$file" >/dev/null 2>&1; then
  echo "Blocked: $file is a tracked migration. Never edit committed or applied migrations; change the schema and run pnpm db:generate." >&2
  exit 2
fi
exit 0
