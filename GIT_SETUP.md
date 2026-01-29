# Git Configuration

This repository is configured to use a custom Git server instead of GitHub.

## Repository URL
```
http://192.168.1.11:14000/TCGM/drunner.git
```

## Common Git Commands

### Push changes to remote
```powershell
git add .
git commit -m "Your commit message"
git push origin main
```

### Pull latest changes
```powershell
git pull origin main
```

### Check remote configuration
```powershell
git remote -v
```

### Update remote URL (if needed)
```powershell
git remote set-url origin http://192.168.1.11:14000/TCGM/drunner.git
```

## Initial Push (First Time)
If this is your first push to the new repository:
```powershell
git push -u origin main
```

The `-u` flag sets the upstream branch, so future `git push` commands will default to `origin main`.

## Notes
- This is a custom Git server, not GitHub
- Standard Git commands work the same way
- No GitHub-specific features (Actions, Pages, Issues) are available
