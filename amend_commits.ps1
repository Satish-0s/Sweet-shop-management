# Script to amend git commits with AI co-authorship
# This script will rewrite commit history to add proper attribution

$coAuthor = "Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"

# Commit messages based on the work done
$commitMessages = @{
    "ceb5829" = @"
feat: enhance frontend UI with modern design

Improved styling with glassmorphism effects, responsive layouts,
and interactive components for better user experience.

$coAuthor
"@
    "cd3267d" = @"
feat: implement backend API and authentication

Created Express server with MongoDB integration, JWT authentication,
and middleware for protected routes.

$coAuthor
"@
    "ce0d53b" = @"
feat: add sweet and purchase management features

Implemented CRUD operations for sweets and purchases with
proper validation and error handling.

$coAuthor
"@
    "6bb3ee4" = @"
chore: remove unwanted backend files

Cleaned up unnecessary files and organized project structure.

$coAuthor
"@
    "6edafd8" = @"
feat: implement React frontend with routing

Created frontend application with authentication context,
protected routes, and API integration using Axios.

$coAuthor
"@
    "0cf5f0a" = @"
fix: resolve authentication and UI issues

Fixed navbar profile dropdown interaction, corrected API endpoint
authentication, and improved error handling in frontend.

$coAuthor
"@
}

Write-Host "This script will rewrite git history to add AI co-authorship." -ForegroundColor Yellow
Write-Host "Current commits will be amended with proper messages and attribution." -ForegroundColor Yellow
Write-Host ""
Write-Host "WARNING: This will rewrite history and require force push!" -ForegroundColor Red
Write-Host ""
Read-Host "Press Enter to continue or Ctrl+C to cancel"

# Create a backup branch
Write-Host "`nCreating backup branch..." -ForegroundColor Cyan
git branch backup-before-coauthor

# Use filter-branch to rewrite commits
Write-Host "`nRewriting commit history..." -ForegroundColor Cyan

$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

git filter-branch -f --msg-filter '
    commit_hash=$(git rev-parse HEAD)
    commit_short=${commit_hash:0:7}
    
    case $commit_short in
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
' HEAD~6..HEAD

Write-Host "`nCommit history has been rewritten!" -ForegroundColor Green
Write-Host "`nReview the changes with: git log --format='%h %s%n%b' -6" -ForegroundColor Cyan
Write-Host "`nTo push changes: git push --force-with-lease origin main" -ForegroundColor Cyan
Write-Host "`nTo restore original: git reset --hard backup-before-coauthor" -ForegroundColor Yellow
