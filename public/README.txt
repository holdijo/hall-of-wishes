ROOM OF REQUIREMENTS - DEPLOYMENT GUIDE
========================================

OVERVIEW
--------
The Room of Requirements is a magical productivity web application built with Harry Potter themes.
It includes goal tracking, milestone management, weekly planning, and secure data backup features.

SECURITY FEATURES
-----------------
✓ One-time password authentication (PBKDF2 hashed)
✓ Session-based access control
✓ Encrypted data export/import
✓ Hardened .htaccess configuration
✓ Protection against common web vulnerabilities

PASSWORD
--------
The application uses a secure one-time password: RequiresRoom2024!
This password is required on first access in each browser tab.

DEPLOYMENT INSTRUCTIONS
-----------------------

1. UPLOAD FILES
   - Extract the ZIP file contents directly into your Hostinger public_html folder
   - Do NOT create a subfolder - files should be at the root level
   - Ensure all files maintain their directory structure

2. REQUIRED FILES STRUCTURE
   public_html/
   ├── index.html (main application)
   ├── calendar.html (calendar view)
   ├── .htaccess (security configuration)
   ├── assets/ (CSS, JS, images, fonts)
   └── README.txt (this file)

3. APACHE CONFIGURATION
   - The .htaccess file is pre-configured for security
   - It includes protection for sensitive files
   - HTTP Basic Auth is ready but commented out

4. ENABLE HTTP BASIC AUTH (OPTIONAL)
   a) Create a .htpasswd file:
      htpasswd -c .htpasswd yourusername
   
   b) Update .htaccess:
      Uncomment the AuthUserFile line and set the correct path:
      AuthUserFile /home/yourusername/public_html/.htpasswd
   
   c) Uncomment the Basic Auth section in .htaccess

5. VERIFY DEPLOYMENT
   - Visit your domain to access the main application
   - Use password: RequiresRoom2024!
   - Click calendar icon to test calendar.html
   - Test export/import functionality

FEATURES
--------
• Long-Term Goals with 7 Habits alignment
• Eisenhower Matrix for Milestones/Projects  
• Weekly Planner with roles, big rocks, and tasks
• Owl Post notifications for changes and deadlines
• Calendar view with automatic event population
• Dark/Light mode toggle
• Encrypted backup export/import
• Offline functionality once loaded
• Mobile-optimized with iOS PWA support

BROWSER COMPATIBILITY
--------------------
✓ Chrome 90+
✓ Firefox 88+
✓ Safari 14+
✓ Edge 90+
✓ Mobile browsers (iOS Safari, Chrome Mobile)

DATA STORAGE
------------
• All data stored locally in browser localStorage
• No server-side database required
• Export backups regularly for data safety
• Calendar syncs automatically with main app data

SECURITY NOTES
--------------
• Password is hashed with PBKDF2 (100,000 iterations)
• Session expires when browser tab closes
• .htaccess blocks access to sensitive files
• Content Security Policy headers enabled
• No external dependencies for core functionality

CUSTOMIZATION
-------------
To change the access password:
1. Generate new PBKDF2 hash using 100,000 iterations
2. Update EXPECTED_HASH in the AuthGuard component
3. Rebuild and redeploy

SUPPORT
-------
The application is fully static and self-contained.
Check browser console for any JavaScript errors.
Ensure .htaccess is properly configured on your server.

CHANGELOG
---------
v1.0 - Initial release with full feature set
     - Harry Potter themed UI
     - Complete productivity management system
     - Security hardening
     - Mobile optimization

BACKUP STRATEGY
---------------
1. Use the built-in export feature regularly
2. Store exported JSON files securely
3. Keep multiple backup copies
4. Test import functionality periodically

The Room of Requirements will always provide what you need! 🏰✨