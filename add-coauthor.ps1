# PowerShell script to amend git commits with AI co-authorship
# Run this script from the repository root

$ErrorActionPreference = "Stop"

Write-Host "`n=== Git Commit AI Co-Authorship Tool ===" -ForegroundColor Cyan
Write-Host "This will amend your commits with proper AI attribution`n" -ForegroundColor Yellow

# Commit data: hash -> [subject, body]
$commits = @(
    @{
        hash    = "ceb5829"
        subject = "feat: enhance frontend UI with modern design"
        body    = "Improved styling with glassmorphism effects, responsive layouts,`nand interactive components for better user experience."
    },
    @{
        hash    = "cd3267d"
        subject = "feat: implement backend API and authentication"
        body    = "Created Express server with MongoDB integration, JWT authentication,`nand middleware for protected routes."
    },
    @{
        hash    = "ce0d53b"
        subject = "feat: add sweet and purchase management features"
        body    = "Implemented CRUD operations for sweets and purchases with`nproper validation and error handling."
    },
    @{
        hash    = "6bb3ee4"
        subject = "chore: remove unwanted backend files"
        body    = "Cleaned up unnecessary files and organized project structure."
    },
    @{
        hash    = "6edafd8"
        subject = "feat: implement React frontend with routing"
        body    = "Created frontend application with authentication context,`nprotected routes, and API integration using Axios."
    },
    @{
        hash    = "0cf5f0a"
        subject = "fix: resolve authentication and UI issues"
        body    = "Fixed navbar profile dropdown interaction, corrected API endpoint`nauthentication, and improved error handling in frontend."
    }
)

$coAuthor = "Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"

# Create backup
Write-Host "Creating backup branch 'backup-before-coauthor'..." -ForegroundColor Green
git branch -f backup-before-coauthor
Write-Host "✓ Backup created`n" -ForegroundColor Green

# Create a temporary script for git filter-branch
$filterScript = @"
#!/bin/sh
case `$(git rev-parse --short HEAD) in
"@

foreach ($commit in $commits) {
    $filterScript += @"

    $($commit.hash))
        echo "$($commit.subject)"
        echo ""
        echo "$($commit.body)"
        echo ""
        echo "$coAuthor"
        ;;
"@
}

$filterScript += @"

    *)
        cat
        ;;
esac
"@

# Save filter script
$filterScriptPath = Join-Path $PWD ".git\commit-msg-filter.sh"
$filterScript | Out-File -FilePath $filterScriptPath -Encoding UTF8 -NoNewline

Write-Host "Rewriting commit history..." -ForegroundColor Yellow
Write-Host "(This may take a moment)`n" -ForegroundColor Gray

# Run filter-branch
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"
git filter-branch -f --msg-filter "sh '$filterScriptPath'" -- --all

# Clean up
Remove-Item $filterScriptPath -ErrorAction SilentlyContinue

Write-Host "`n✓ Commits have been rewritten!`n" -ForegroundColor Green

# Show results
Write-Host "=== Updated Commit History ===" -ForegroundColor Cyan
git log --format="%Cgreen%h%Creset %s%n%b" -6

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Review the changes above" -ForegroundColor White
Write-Host "2. Push to remote: " -NoNewline -ForegroundColor White
Write-Host "git push --force-with-lease origin main" -ForegroundColor Yellow
Write-Host "3. If something went wrong: " -NoNewline -ForegroundColor White
Write-Host "git reset --hard backup-before-coauthor" -ForegroundColor Yellow
Write-Host ""
