# Music System - Testing Checklist

## Pre-Test Setup

1. ✅ Verify files are compiled without errors
   ```bash
   npx tsc --noEmit
   ```

2. ✅ Start development server
   ```bash
   npm run dev
   ```

3. ✅ Open browser console (F12) to check for errors

## Main Menu Tests

### Music Playback
- [ ] Music starts playing automatically on main menu
- [ ] Current track: "Lanterns Up B2" or "Lanterns Up B3"
- [ ] No errors in console

### Volume Controls
- [ ] Volume slider is visible below menu buttons
- [ ] Slider shows current volume percentage
- [ ] Moving slider changes volume in real-time
- [ ] Volume persists after page reload

### Mute Button
- [ ] Speaker icon is visible
- [ ] Clicking icon mutes music
- [ ] Icon changes to muted state (GiSpeakerOff)
- [ ] Clicking again unmutes
- [ ] Mute state persists after page reload

## Party Setup Screen Tests

### Music Transition
- [ ] Navigate to party setup (New Run → select heroes)
- [ ] Music crossfades smoothly (2 second fade)
- [ ] Party screen music plays after fade completes
- [ ] No abrupt cuts or pops

### Multiple Tracks
- [ ] Party screen has 2 tracks configured
- [ ] Tracks should shuffle if multiple exist
- [ ] Tracks loop seamlessly

## Cross-Screen Tests

### Navigation
1. Main Menu → Party Setup
   - [ ] Music changes smoothly
   - [ ] Volume level maintained

2. Party Setup → Main Menu (Back button)
   - [ ] Music changes back to menu music
   - [ ] No duplicate audio playing

3. Rapid navigation
   - [ ] Click New Run, immediately go Back
   - [ ] No audio glitches
   - [ ] Fade completes properly

### Volume Persistence
- [ ] Set volume to 50%
- [ ] Navigate between screens
- [ ] Volume stays at 50%
- [ ] Reload page
- [ ] Volume still at 50%

### Mute Persistence
- [ ] Mute music
- [ ] Navigate between screens
- [ ] Music stays muted
- [ ] Reload page
- [ ] Music still muted

## Browser Console Tests

Check for:
- [ ] No "Failed to load music track" errors
- [ ] No audio element errors
- [ ] No undefined variable errors
- [ ] No import errors

## Performance Tests

### Memory
- [ ] Play for 5+ minutes
- [ ] Open DevTools → Performance → Memory
- [ ] No significant memory leaks
- [ ] Audio elements are cleaned up properly

### CPU
- [ ] During crossfade, CPU usage is reasonable
- [ ] No frame drops during fade
- [ ] Music doesn't stutter

## Edge Cases

### Rapid Context Changes
- [ ] Quickly navigate: Menu → Party → Menu → Party
- [ ] No audio overlaps
- [ ] Crossfades work correctly
- [ ] No console errors

### Browser Autoplay Policy
- [ ] If music doesn't autoplay, check browser settings
- [ ] Try clicking anywhere on page first
- [ ] Music should start after user interaction

### Tab Switching
- [ ] Switch to another browser tab
- [ ] Music continues playing
- [ ] Switch back
- [ ] Music still playing normally

### Background Tab
- [ ] Minimize browser
- [ ] Music continues (browser-dependent)
- [ ] Restore browser
- [ ] Music still works

## Audio File Tests

### File Loading
- [ ] Check Network tab in DevTools
- [ ] MP3 files load successfully
- [ ] No 404 errors for audio files
- [ ] Files load from correct paths

### File Format
- [ ] MP3 files play in all browsers
- [ ] No codec errors
- [ ] Audio quality is good

## LocalStorage Tests

### Volume Storage
1. Set volume to 75%
2. Open DevTools → Application → LocalStorage
3. [ ] Check for "musicVolume" key
4. [ ] Value should be "0.75"

### Music Enabled Storage
1. Mute music
2. Check LocalStorage
3. [ ] Check for "musicEnabled" key
4. [ ] Value should be "false"

## Integration Tests

### Game State
- [ ] Music settings saved in game state
- [ ] Export save includes music settings
- [ ] Import save restores music settings

### Multiple Sessions
1. Set volume to 30%
2. Close browser
3. Open browser
4. Return to game
5. [ ] Volume is 30%

## Known Issues to Test

### Issue: Music Not Playing
**Test:**
- [ ] Check if browser blocked autoplay
- [ ] Try clicking page before testing
- [ ] Check browser console for errors

**Expected:** Music plays after user interaction

### Issue: Choppy Transitions
**Test:**
- [ ] Test crossfade on slow connection
- [ ] Check if files are too large

**Expected:** Smooth fade, no stuttering

### Issue: Volume Doesn't Change
**Test:**
- [ ] Move slider
- [ ] Check if audio element volume changes

**Expected:** Immediate volume change

## Future Integration Tests

Once integrated into dungeon screen:

### Boss Music
- [ ] Enter boss fight
- [ ] Music changes to boss theme
- [ ] Correct boss tier music plays
- [ ] Returns to normal music after

### Victory/Defeat
- [ ] Win a run
- [ ] Victory music plays
- [ ] Lose a run
- [ ] Defeat music plays

### Event-Based Music
- [ ] Merchant event → shop music
- [ ] Rest event → rest music
- [ ] Combat event → normal dungeon music

## Test Results

Date: __________
Tester: __________

### Passed Tests: _____ / _____

### Failed Tests:
1. ________________________________
2. ________________________________
3. ________________________________

### Notes:
________________________________
________________________________
________________________________

### Overall Status: ☐ Pass ☐ Fail ☐ Needs Work
