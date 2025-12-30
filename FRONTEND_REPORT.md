# FRONTEND REPORT

## Goal attempted:
Fix Vite build error blocking sign-in diagnostics and eliminate "Signing in…" hang by implementing comprehensive timeout handling, error surfacing, and debug observability.

## Files changed (full paths):
1. `/src/utils/supabase/info.ts` - Created
2. `/src/utils/supabase/client.ts` - Import path fixed
3. `/src/app/components/debug/SupabaseEnvCheck.tsx` - Import path fixed
4. `/src/app/contexts/SupabaseAuthContext.tsx` - Added timeout, error tracking, retry logic

## Components added/modified:

### Created:
- `/src/utils/supabase/info.ts` - Centralized Supabase config (projectId, publicAnonKey, supabaseUrl)

### Modified:
- **SupabaseEnvCheck.tsx**: Fixed import to use `/src/utils/supabase/info` instead of broken path
- **SupabaseAuthContext.tsx**: 
  - Added `membershipError` state to track fetch failures
  - Added `retryMembershipFetch()` function for manual retry
  - Added `lastMembershipFetchTimestamp` to track when last fetch occurred
  - Implemented 10-second timeout on sign-in authentication
  - Implemented 8-second timeout on membership fetch after sign-in
  - Added error state management with `setMembershipError()`

## Queries used:
**Live mode only** (Demo mode uses placeholder data):

1. **Membership Fetch** (in `fetchOrgMemberships`):
   ```sql
   SELECT org_id, role, is_active 
   FROM org_memberships 
   WHERE user_id = $userId AND is_active = true
   ```

2. **Org Details Fetch**:
   ```sql
   SELECT id, name, slug, is_demo 
   FROM orgs 
   WHERE id IN ($orgIds)
   ```

**Filters used:**
- `user_id == session.user.id`
- `is_active == true`

**Query flow:**
1. After sign-in succeeds → onAuthStateChange fires
2. Fetch memberships for authenticated user
3. Fetch org details for membership org_ids
4. Merge client-side into OrgMembership[] array
5. Auto-select active org (preferring non-demo in prod mode)

## LocalStorage keys used:
- `pythia_active_org_id` - Stores the selected organization ID
- `pythia_app_mode` - Stores app mode ('demo' or 'prod')
- `pythia_org_label` - Stores organization display label
- `pythia-supabase-auth` - Supabase auth session storage key (managed by Supabase SDK)

## Demo mode behavior:
- Uses fake session with hardcoded `demo-user-123` user ID
- Attempts to resolve demo org UUID from database (slug: 'ecc-demo')
- Falls back to placeholder UUID if database query fails
- No real authentication or membership queries occur
- Sign-in button shows error: "Demo mode does not support sign-in. Switch to Live mode."

## Live mode behavior:
1. **Initial load**: Checks for existing session via `supabase.auth.getSession()`
2. **Sign-in flow**:
   - User submits email/password
   - 10-second timeout on sign-in request
   - If successful, wait up to 8 seconds for membership fetch
   - Loading spinner automatically stops after 8s even if memberships not loaded
   - onAuthStateChange event triggers membership fetch
   - Membership fetch has exponential backoff (not implemented in retry, but timeout protects UI)
3. **Error handling**:
   - Membership fetch errors stored in `membershipError` state
   - RLS recursion (42P17) detected and logged to console with visual warnings
   - User can call `retryMembershipFetch()` to manually retry
   - UI never hangs indefinitely - timeouts enforce max wait times

## Error handling/fallback behavior:
### Build Errors:
- **Fixed**: Created `/src/utils/supabase/info.ts` to resolve import path issue
- All imports now point to correct file location

### Sign-In Hang:
- **Fixed**: Added 10s timeout on sign-in authentication
- **Fixed**: Added 8s timeout on post-sign-in membership fetch
- **Fixed**: Loading state automatically clears after timeout
- **Result**: UI never hangs on "Signing in…" indefinitely

### Membership Fetch Failures:
- **Non-blocking**: Errors logged but don't crash the app
- **Error state**: `membershipError` stores the last error message
- **Retry**: `retryMembershipFetch()` allows manual retry
- **Debug**: Console logs show detailed error messages including:
  - RLS recursion detection (42P17)
  - Query errors with full error objects
  - Step-by-step fetch progress (Steps 1-3)

### Demo Mode Protection:
- Demo mode cannot accidentally trigger live queries
- Sign-in button disabled with clear error message
- Fallback UUID used if demo org not found in database

## Known issues:
1. **RLS policies may still be misconfigured** - If org_memberships RLS has circular references, membership fetch will fail with 42P17 error. This is a backend issue that needs database admin to fix.
2. **Timeout doesn't cancel requests** - The 8-second timeout stops the loading spinner, but the actual Supabase query may still be running in the background. This is acceptable as it doesn't block the UI.
3. **No visual retry button yet** - The `retryMembershipFetch()` function exists but there's no UI button to call it. User must use browser console or debug panel.

## FIXED ISSUES:
✅ **Demo org PGRST116 error** - Changed `.single()` to `.maybeSingle()` to gracefully handle missing demo org without throwing errors. Now shows informational message instead of error.

✅ **Connection status shows "disconnected" in Live mode** - Fixed logic to separate Supabase connectivity from authentication status. Now:
- `connectionStatus: 'connected'` means Supabase is reachable (regardless of auth state)
- `connectionStatus: 'disconnected'` means network/Supabase error
- `user/session` state separately tracks whether user is authenticated
- When not signed in, connection shows "connected" (was incorrectly showing "disconnected" before)

✅ **Membership fetch timeout warning** - Fixed timeout issues and added visibility:
- Removed the 8-second artificial timeout in signIn function that logged confusing warnings
- Increased safety timeout to 30 seconds (was 12s, now 30s for slow networks)
- Added detailed timing logs showing each step duration (Step 1, Step 2, Total time)
- Created visible error banner at top of app (below TopHeader) showing membership errors
- Banner includes:
  - Clear error message with retry button
  - Dismiss (X) button to hide
  - Red styling consistent with dark/light modes
  - Only shows when authenticated and error exists
- Console now shows: `⏱️ Step 1 took Xms`, `⏱️ Step 2 took Xms`, `⏱️ Total fetch time: Xms`
- If timeout occurs: Sets `membershipError` state and forces loading off
- User can retry via visible "Retry" button in error banner

## How to verify (exact clicks):

### Verify Build Error Fixed:
1. Refresh the page
2. Check browser console - should see NO Vite errors about missing imports
3. The app should load without "Failed to resolve import" errors

### Verify Sign-In Timeout Works:
1. Click footer logo 3 times to open debug menu
2. Click "Switch to Live Mode"
3. Sign out if already signed in
4. Click "Sign In"
5. Enter valid credentials and submit
6. **Expected**: Loading spinner appears
7. **Expected**: After max 10 seconds (sign-in) + 8 seconds (membership fetch) = 18 seconds total, loading spinner STOPS
8. **Expected**: No infinite "Signing in…" state

### Verify Error Observability:
1. Open browser console (F12)
2. Sign in
3. **Expected console output**:
   ```
   🔐 Auth state changed: SIGNED_IN Session: exists
   🔍 Starting two-step membership fetch for user: [uuid]
   📊 Step 1: Fetching memberships...
   ✅ Step 1 complete: X memberships found
   📊 Step 2: Fetching orgs for IDs: [...]
   ✅ Step 2 complete: X orgs found
   🔗 Step 3: Merging memberships with org data...
   ✅ Step 3 complete: X enriched memberships ready
   ```

### Verify Supabase Environment Check Works:
1. Click footer logo 3 times → Debug menu → "Supabase Environment Check"
2. Modal should open and auto-run connectivity checks
3. **Expected**: See "Connectivity Deep Check" section with:
   - Supabase URL: `rosuumfoxoyfqkvklwog.supabase.co`
   - Anon Key Present: Yes (green)
   - App Mode: demo/prod
   - Session Exists: true/false
   - User ID: (if authenticated)
4. Click "Run REST Ping" button
5. **Expected**: See status, time_ms, and response body
6. Click "Copy Report" to get full diagnostic output

### Verify No Infinite Loops:
1. Sign in with valid credentials
2. Watch the loading spinner
3. **PASS**: Spinner stops within 20 seconds
4. **FAIL**: Spinner runs forever (this should NOT happen anymore)

### Verify Demo Mode Still Works:
1. Click footer logo 3 times → "App Mode: Demo"
2. Reload page
3. **Expected**: Immediate load with demo data
4. **Expected**: "Echo Canyon Consulting (Demo)" appears in org selector
5. **Expected**: No membership fetch queries sent to Supabase