#!/usr/bin/env bash
set -euo pipefail

# trigger-ci-branches.sh
# Stash local changes, create an empty commit on each local branch that has an upstream,
# push it, then return to the original branch and restore the stash.

REPO_ROOT=$(git rev-parse --show-toplevel)
ORIG_DIR=$(pwd)
ORIG_BRANCH=$(git rev-parse --abbrev-ref HEAD)

timestamp=$(date +%s)
stash_name="pre-trigger-ci-stash-$timestamp"

echo "Stashing any local changes as '$stash_name'..."
has_changes=false
if ! git diff --quiet || ! git diff --cached --quiet; then
  has_changes=true
  git stash push -u -m "$stash_name"
  echo "Changes stashed."
fi

echo "Finding local branches with an upstream..."
mapfile -t branches < <(git for-each-ref --format='%(refname:short)|%(upstream:short)' refs/heads | awk -F'|' '$2!=""{print $1}')

if [ ${#branches[@]} -eq 0 ]; then
  echo "No local branches with remotes found."
  if [ "$has_changes" = true ]; then
    echo "Restoring stash..."
    git stash pop || echo "Warning: failed to pop stash; you can restore it manually with 'git stash list'"
  fi
  exit 0
fi

echo "Found ${#branches[@]} branches to trigger CI on."

for br in "${branches[@]}"; do
  echo "---\nProcessing branch: $br"
  if [ "$br" = "main" ]; then
    echo "Skipping 'main' branch."
    continue
  fi
  git checkout "$br"
  # create an empty commit to trigger workflows
  git commit --allow-empty -m "trigger ci"
  echo "Pushing $br..."
  git push
done

echo "Returning to original branch: $ORIG_BRANCH"
git checkout "$ORIG_BRANCH"

if [ "$has_changes" = true ]; then
  echo "Restoring stash $stash_name..."
  git stash pop || echo "Warning: failed to pop stash; you can restore it manually with 'git stash list'"
fi

echo "Done."

cd "$ORIG_DIR"
