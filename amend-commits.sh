#!/bin/bash
# Bash script to amend commits with AI co-authorship using git filter-branch

export FILTER_BRANCH_SQUELCH_WARNING=1

# Define commit messages
declare -A COMMIT_MSGS

COMMIT_MSGS["ceb5829"]="feat: enhance frontend UI with modern design

Improved styling with glassmorphism effects, responsive layouts,
and interactive components for better user experience."

COMMIT_MSGS["cd3267d"]="feat: implement backend API and authentication

Created Express server with MongoDB integration, JWT authentication,
and middleware for protected routes."

COMMIT_MSGS["ce0d53b"]="feat: add sweet and purchase management features

Implemented CRUD operations for sweets and purchases with
proper validation and error handling."

COMMIT_MSGS["6bb3ee4"]="chore: remove unwanted backend files

Cleaned up unnecessary files and organized project structure."

COMMIT_MSGS["6edafd8"]="feat: implement React frontend with routing

Created frontend application with authentication context,
protected routes, and API integration using Axios."

COMMIT_MSGS["0cf5f0a"]="fix: resolve authentication and UI issues

Fixed navbar profile dropdown interaction, corrected API endpoint
authentication, and improved error handling in frontend."

CO_AUTHOR="Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"

echo "Creating backup branch..."
git branch -f backup-before-coauthor

echo "Rewriting commit history..."

git filter-branch -f --msg-filter '
    SHORT_HASH=$(git log -1 --pretty=format:%h $GIT_COMMIT)
    
    case "$SHORT_HASH" in
        ceb5829)
            echo "feat: enhance frontend UI with modern design"
            echo ""
            echo "Improved styling with glassmorphism effects, responsive layouts,"
            echo "and interactive components for better user experience."
            echo ""
            echo "Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"
            ;;
        cd3267d)
            echo "feat: implement backend API and authentication"
            echo ""
            echo "Created Express server with MongoDB integration, JWT authentication,"
            echo "and middleware for protected routes."
            echo ""
            echo "Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"
            ;;
        ce0d53b)
            echo "feat: add sweet and purchase management features"
            echo ""
            echo "Implemented CRUD operations for sweets and purchases with"
            echo "proper validation and error handling."
            echo ""
            echo "Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"
            ;;
        6bb3ee4)
            echo "chore: remove unwanted backend files"
            echo ""
            echo "Cleaned up unnecessary files and organized project structure."
            echo ""
            echo "Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"
            ;;
        6edafd8)
            echo "feat: implement React frontend with routing"
            echo ""
            echo "Created frontend application with authentication context,"
            echo "protected routes, and API integration using Axios."
            echo ""
            echo "Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"
            ;;
        0cf5f0a)
            echo "fix: resolve authentication and UI issues"
            echo ""
            echo "Fixed navbar profile dropdown interaction, corrected API endpoint"
            echo "authentication, and improved error handling in frontend."
            echo ""
            echo "Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"
            ;;
        *)
            cat
            ;;
    esac
' -- --all

echo ""
echo "✓ Commit history rewritten!"
echo ""
echo "Review changes with: git log --format='%h %s%n%b' -6"
echo "Push changes with: git push --force-with-lease origin main"
echo "Restore backup with: git reset --hard backup-before-coauthor"
