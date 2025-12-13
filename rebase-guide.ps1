# Manual Git Rebase Guide for Adding AI Co-Authorship

Write-Host "`n=== Step-by-Step Guide to Add AI Co-Authorship ===" -ForegroundColor Cyan
Write-Host "`nBackup branch 'backup-before-coauthor' has been created.`n" -ForegroundColor Green

Write-Host "Follow these steps:`n" -ForegroundColor Yellow

Write-Host "STEP 1: Start Interactive Rebase" -ForegroundColor Cyan
Write-Host "Run: " -NoNewline
Write-Host "git rebase -i --root`n" -ForegroundColor White

Write-Host "STEP 2: In the editor that opens, change 'pick' to 'edit' for all commits`n" -ForegroundColor Cyan

Write-Host "STEP 3: For each commit, run these commands:`n" -ForegroundColor Cyan

$commits = @(
    @{
        hash = "ceb5829"
        cmd  = 'git commit --amend -m "feat: enhance frontend UI with modern design

Improved styling with glassmorphism effects, responsive layouts,
and interactive components for better user experience.

Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"'
    },
    @{
        hash = "cd3267d"
        cmd  = 'git commit --amend -m "feat: implement backend API and authentication

Created Express server with MongoDB integration, JWT authentication,
and middleware for protected routes.

Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"'
    },
    @{
        hash = "ce0d53b"
        cmd  = 'git commit --amend -m "feat: add sweet and purchase management features

Implemented CRUD operations for sweets and purchases with
proper validation and error handling.

Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"'
    },
    @{
        hash = "6bb3ee4"
        cmd  = 'git commit --amend -m "chore: remove unwanted backend files

Cleaned up unnecessary files and organized project structure.

Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"'
    },
    @{
        hash = "6edafd8"
        cmd  = 'git commit --amend -m "feat: implement React frontend with routing

Created frontend application with authentication context,
protected routes, and API integration using Axios.

Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"'
    },
    @{
        hash = "0cf5f0a"
        cmd  = 'git commit --amend -m "fix: resolve authentication and UI issues

Fixed navbar profile dropdown interaction, corrected API endpoint
authentication, and improved error handling in frontend.

Co-authored-by: Antigravity AI <AI@users.noreply.github.com>"'
    }
)

$i = 1
foreach ($commit in $commits) {
    Write-Host "Commit $i ($($commit.hash)):" -ForegroundColor Yellow
    Write-Host $commit.cmd -ForegroundColor White
    Write-Host "git rebase --continue`n" -ForegroundColor White
    $i++
}

Write-Host "STEP 4: After all commits are amended, force push:" -ForegroundColor Cyan
Write-Host "git push --force-with-lease origin main`n" -ForegroundColor White

Write-Host "If anything goes wrong:" -ForegroundColor Red
Write-Host "git rebase --abort" -ForegroundColor White
Write-Host "git reset --hard backup-before-coauthor`n" -ForegroundColor White

# Save commands to file for easy copy-paste
$commandsFile = "commit-commands.txt"
"" | Out-File $commandsFile
"=== Commands to run during interactive rebase ===" | Out-File $commandsFile -Append
"" | Out-File $commandsFile -Append

foreach ($commit in $commits) {
    "# Commit: $($commit.hash)" | Out-File $commandsFile -Append
    $commit.cmd | Out-File $commandsFile -Append
    "git rebase --continue" | Out-File $commandsFile -Append
    "" | Out-File $commandsFile -Append
}

Write-Host "Commands saved to: $commandsFile" -ForegroundColor Green
Write-Host "You can copy-paste from this file during the rebase.`n" -ForegroundColor Green
