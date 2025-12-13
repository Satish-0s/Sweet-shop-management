#!/usr/bin/env bash
# Automated script to amend all commits with AI co-authorship

set -e

CO_AUTHOR="Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"

echo "Creating backup branch..."
git branch -f backup-before-coauthor 2>/dev/null || true

echo "Starting interactive rebase..."

# Set up the rebase todo
export GIT_SEQUENCE_EDITOR="sed -i 's/^pick/edit/g'"

# Start rebase on all 6 commits (going back to root)
git rebase -i --root

# This will stop at each commit, allowing us to amend
