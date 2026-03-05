# 🔧 Network Error Troubleshooting Guide

## You're seeing: "Network error — check your connection and try again"

This means the app cannot reach CoinGecko's API. Here's how to diagnose and fix it:

---

## 🚀 Quick Fixes (Try These First)

### 1. **Check Your Internet**
```powershell
# Test if you have internet
ping google.com
```
If this fails, check your WiFi/network connection.

### 2. **Refresh the Page**
Sometimes it's a temporary glitch. Press `F5` or `Ctrl+R`.

### 3. **Wait 2-3 Minutes**
CoinGecko's free API has rate limits. If you've made many requests, wait a bit.

### 4. **Try a Different Browser**
Open the app in Chrome, Firefox, or Edge to rule out browser-specific issues.

---

## 🔍 Advanced Diagnostics

### Run the Diagnostic Script

1. Open your FDV Checker app in the browser
2. Press `F12` to open DevTools
3. Go to the **Console** tab
4. Copy and paste the contents of `diagnose.js` into the console
5. Press `Enter`

The script will test:
- ✅ API connectivity
- ✅ Data endpoint access
- ✅ CORS headers
- ✅ Response times

### Check Browser Console

Press `F12` and look for errors in the Console:

| Error Message | What It Means | Solution |
|--------------|---------------|----------|
| `Failed to fetch` | No network connection | Check internet |
| `429 Too Many Requests` | Rate limited | Wait 2-5 minutes |
| `CORS policy blocked` | Browser security | Try different browser |
| `ERR_NAME_NOT_RESOLVED` | DNS issue | Clear DNS cache |
| `ERR_CONNECTION_REFUSED` | Firewall/Proxy | Check firewall settings |

---

## 🛠️ Common Solutions

### Solution 1: Clear Browser Cache
```
Chrome/Edge: Ctrl+Shift+Delete → Clear browsing data
Firefox: Ctrl+Shift+Delete → Clear cookies and cache
```

### Solution 2: Disable Browser Extensions
Some ad blockers or privacy extensions block API requests. Try disabling them temporarily.

### Solution 3: Check Firewall
If you're on a corporate network, the firewall might block crypto APIs. Try:
- Mobile hotspot
- Home network
- VPN (if allowed)

### Solution 4: Flush DNS Cache
```powershell
# Windows
ipconfig /flushdns

# macOS
sudo dscacheutil -flushcache

# Linux
sudo systemd-resolve --flush-caches
```

### Solution 5: Check CoinGecko Status
Visit https://www.coingeckostatus.com/ to see if their API is down.

---

## 💡 What We've Added to Help

### Automatic Retries
The app now automatically retries failed requests up to 3 times with exponential backoff.

### API Status Indicator
A yellow warning banner appears if the API is unreachable, so you know what's happening.

### Better Error Messages
More specific error messages tell you exactly what went wrong:
- ⚠️ Rate limited
- ⚠️ Token not found
- ⚠️ API unreachable
- ⚠️ Unexpected response

---

## 📊 Still Not Working?

### Check if it's working for others:
1. Ask a friend to try the app
2. Test on a different network
3. Try using mobile data

### Temporary Workaround:
If CoinGecko API is consistently blocked in your area, you can:
1. Use a VPN service
2. Set up a backend proxy
3. Use an alternative API provider

---

## 🆘 Contact Support

If none of these solutions work:
1. Take a screenshot of the browser console (F12)
2. Note your network type (WiFi, mobile data, corporate)
3. Check if other websites are loading normally
4. Try accessing https://api.coingecko.com/api/v3/ping directly in your browser

---

## ✅ Success Indicators

When everything is working correctly, you should see:
- ✅ No error messages in the console
- ✅ Bitcoin price loads automatically
- ✅ Search works for tokens
- ✅ All metrics display properly

---

**Last Updated:** March 5, 2026  
**App Version:** FDV Checker v1.0
