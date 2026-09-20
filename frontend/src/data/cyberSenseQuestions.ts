export interface CyberSenseOption {
  id: string;
  text: string;
  responseHeadline: string;
  responseBody: string;
  saferHabit: string;
}

export interface CyberSenseQuestion {
  id: string;
  category: string;
  scenario: string;
  prompt: string;
  options: [CyberSenseOption, CyberSenseOption, CyberSenseOption];
}

export const cyberSenseQuestions: Record<string, CyberSenseQuestion[]> = {
  // 1. PHISHING & SUSPICIOUS LINKS
  phishing: [
    {
      id: 'phish-1',
      category: 'Phishing & Links',
      scenario: 'Your friend sends an unexpected DM: "Bro, is this you in this video?" with a shortened link.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'phish-1-a',
          text: 'Ignore it & ask your friend via call first',
          responseHeadline: 'Crisis averted: curiosity didn\'t kill the browser.',
          responseBody: 'Compromised social accounts automatically blast curiosity-bait messages to every contact. A 20-second voice call disarms the trap before credentials get stolen.',
          saferHabit: 'Always verify unexpected links through an independent channel before touching them.'
        },
        {
          id: 'phish-1-b',
          text: 'Click the link quickly to see if it really is you',
          responseHeadline: 'Plot twist: you just cast yourself in a phishing movie.',
          responseBody: 'That link was counting on pure panic. It routes straight to a clone login page designed to capture your password and pass it along to the botnet.',
          saferHabit: 'Attackers weaponize urgency and panic—take a breath and inspect the source.'
        },
        {
          id: 'phish-1-c',
          text: 'Forward the message to another friend to check',
          responseHeadline: 'Sharing is caring, except when forwarding malware.',
          responseBody: 'Passing along suspicious links just turns you into an unwitting distributor for the scammer\'s campaign. If they click it, their account is on the line too.',
          saferHabit: 'Quarantine and report suspicious messages instead of propagating them into group chats.'
        }
      ]
    },
    {
      id: 'phish-2',
      category: 'Phishing & Links',
      scenario: 'You get an urgent SMS: "Your bank account is suspended due to pending KYC. Click http://hdfc-kyc-update.net immediately."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'phish-2-a',
          text: 'Open the official bank app directly to check alerts',
          responseHeadline: 'Dodged a bullet: your account stays yours, not theirs.',
          responseBody: 'Real banks communicate through official push notifications and banking dashboards, never through hyphenated third-party domains hosted on cheap registries.',
          saferHabit: 'Always access financial services through official installed apps or bookmarks.'
        },
        {
          id: 'phish-2-b',
          text: 'Click the link to complete verification quickly',
          responseHeadline: 'Turns out "urgent KYC" was just an urgent donation to scammers.',
          responseBody: 'That form was specifically designed to harvest your NetBanking customer ID, password, and OTP in real-time while displaying a fake loading spinner.',
          saferHabit: 'No legitimate financial institution ever demands emergency verification via an unverified SMS link.'
        },
        {
          id: 'phish-2-c',
          text: 'Reply STOP or SEND DETAILS to the SMS',
          responseHeadline: 'Congratulations, you just RSVP\'d to a spam syndicate.',
          responseBody: 'Replying tells the automated dialer that your phone number has an active, responsive human behind it, instantly bumping you to priority target lists.',
          saferHabit: 'Block and report unsolicited SMS sender IDs rather than replying.'
        }
      ]
    },
    {
      id: 'phish-3',
      category: 'Phishing & Links',
      scenario: 'You receive an email claiming your Netflix payment failed, featuring a giant red "Update Payment" button.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'phish-3-a',
          text: 'Open your browser and visit netflix.com directly',
          responseHeadline: 'Flawless move: streaming drama stays on screen, not in your bank.',
          responseBody: 'Navigating directly completely neutralizes lookalike domains and spoofed sender headers. If your account truly had a billing issue, the native portal displays it.',
          saferHabit: 'Always manage subscription billing directly within the official website settings.'
        },
        {
          id: 'phish-3-b',
          text: 'Click the button and enter your credit card info',
          responseHeadline: 'Now streaming: someone else spending your money.',
          responseBody: 'Subscription renewal warnings are high-volume phishing templates designed to harvest fresh card numbers, CVVs, and billing addresses.',
          saferHabit: 'Inspect the actual sender email address, not just the brand logo inside the message.'
        },
        {
          id: 'phish-3-c',
          text: 'Forward the email to all shared account members',
          responseHeadline: 'Family plan meets family-wide panic.',
          responseBody: 'If any single family member panics and clicks the fake button, the payment card on file for the entire household is compromised.',
          saferHabit: 'Verify account alerts independently before broadcasting them to roommates or family.'
        }
      ]
    },
    {
      id: 'phish-4',
      category: 'Phishing & Links',
      scenario: 'A QR code sticker on a public parking meter promises "Quick parking payment - 20% discount if paid here."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'phish-4-a',
          text: 'Use the official parking terminal or official city app',
          responseHeadline: 'Spot on: 20% discount avoided, 100% of your money kept.',
          responseBody: 'Physical quishing involves pasting fake QR stickers over real parking meters. The sticker routes drivers to fake payment portals that pocket your cash and leave you with a parking ticket.',
          saferHabit: 'Never scan loose stickers pasted over municipal payment terminals.'
        },
        {
          id: 'phish-4-b',
          text: 'Scan the sticker immediately to claim the discount',
          responseHeadline: 'A 50-cent sticker just outsmarted a 50,000-rupee phone.',
          responseBody: 'Scammers can print hundreds of adhesive QR codes in minutes. Scanning them directs your browser to rogue gateways or malicious wallet drainers.',
          saferHabit: 'Inspect public payment kiosks for signs of physical tampering or overlaid stickers.'
        },
        {
          id: 'phish-4-c',
          text: 'Scan the code just to preview the landing page URL',
          responseHeadline: 'Window shopping at a malware boutique.',
          responseBody: 'Even landing on a malicious URL can fingerprint your mobile browser, trigger drive-by downloads, or leak geolocation headers.',
          saferHabit: 'If a payment surface looks tampered with, don\'t scan it even for curiosity.'
        }
      ]
    },
    {
      id: 'phish-5',
      category: 'Phishing & Links',
      scenario: 'You get a calendar invite from an unknown sender titled "HR: Performance Bonus Distribution" containing a link.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'phish-5-a',
          text: 'Delete without accepting and report the invite as spam',
          responseHeadline: 'Professional instinct: no bonus link, no compromised identity.',
          responseBody: 'Calendar phishing bypasses traditional email junk folders by injecting invites directly into your schedule. Deleting and reporting denies the attacker an active hook.',
          saferHabit: 'Decline unknown calendar invites without clicking attachments or RSVP links.'
        },
        {
          id: 'phish-5-b',
          text: 'Click the link to check if your team is included',
          responseHeadline: 'The bonus was fake. The password harvest was very real.',
          responseBody: 'Attackers love dangling financial compensation because workplace curiosity overrides caution. That link led straight to a cloned single-sign-on portal.',
          saferHabit: 'Official HR compensation changes are always announced through verified internal portals.'
        },
        {
          id: 'phish-5-c',
          text: 'Accept the invite so you can join the meeting later',
          responseHeadline: 'Inviting a threat actor to sit permanently on your calendar.',
          responseBody: 'Accepting sends a confirmation ping back to the attacker and keeps the malicious URL persistently visible on your daily notification feed.',
          saferHabit: 'Adjust calendar preferences to only display invites from known contacts.'
        }
      ]
    }
  ],

  // 2. PASSWORD SECURITY
  passwords: [
    {
      id: 'pass-1',
      category: 'Password Security',
      scenario: 'You use the exact same favorite password across your primary email, shopping accounts, and streaming services.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pass-1-a',
          text: 'Adopt a password manager and generate unique passwords',
          responseHeadline: 'Fortress built: one key breaks, the rest stay locked.',
          responseBody: 'Password managers remember complex 20-character randomized passcodes so you don\'t have to. A breach on one obscure shoe store won\'t endanger your primary inbox.',
          saferHabit: 'Isolate every service with a unique password using a trusted password manager.'
        },
        {
          id: 'pass-1-b',
          text: 'Keep the password but just add an exclamation mark at the end',
          responseHeadline: 'Adding "!" to a password is like locking a door with a sticky note.',
          responseBody: 'Automated credential-stuffing tools test predictable variations like "Password123!" in milliseconds across thousands of websites simultaneously.',
          saferHabit: 'Simple symbol substitutions at the end of a reused password add near-zero real security.'
        },
        {
          id: 'pass-1-c',
          text: 'Do nothing until one of the sites sends a breach email',
          responseHeadline: 'Gambling with credentials while hackers hold the cards.',
          responseBody: 'Breaches frequently stay undiscovered or unreported for months after credential dumps are already circulating on underground forums.',
          saferHabit: 'Proactive credential hygiene prevents quiet, background account takeovers.'
        }
      ]
    },
    {
      id: 'pass-2',
      category: 'Password Security',
      scenario: 'A major food delivery app you used two years ago reports that its user database was leaked on an internet forum.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pass-2-a',
          text: 'Change passwords on every site where you reused that credential',
          responseHeadline: 'Firewall active: blast radius contained before impact.',
          responseBody: 'Attackers buy leaked databases specifically to run credential stuffing bots against Amazon, Google, and PayPal. Resetting shared credentials stops them in their tracks.',
          saferHabit: 'Assume any password exposed in a public leak will immediately be tested across major portals.'
        },
        {
          id: 'pass-2-b',
          text: 'Ignore the news since you haven’t ordered food in months',
          responseHeadline: 'Old pizza account today, hijacked inbox tomorrow.',
          responseBody: 'Hackers don\'t care about your past burger orders—they care that you reused the exact same email and password combination on your cloud storage or bank.',
          saferHabit: 'Old neglected accounts carry dangerous exposure if they share passwords with active ones.'
        },
        {
          id: 'pass-2-c',
          text: 'Just delete the delivery app from your phone',
          responseHeadline: 'App deleted from screen, database still sitting on the dark web.',
          responseBody: 'Uninstalling a mobile app only deletes local client files. Your credentials, stored payment tokens, and addresses remain on the compromised cloud server.',
          saferHabit: 'App uninstallation is not account remediation—always reset credentials and request account deletion.'
        }
      ]
    },
    {
      id: 'pass-3',
      category: 'Password Security',
      scenario: 'You need to create a new master password for a secure service. Which structure is superior?',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pass-3-a',
          text: 'Pick a 4-word memorable passphrase with spaces or symbols',
          responseHeadline: 'Math wins: easy for your brain, impossible for supercomputers.',
          responseBody: 'A multi-word passphrase like "guitar-orbit-velvet-falcon" creates enormous mathematical entropy that would take brute-force cracking rigs millennia to guess.',
          saferHabit: 'Length beats complexity—use long, memorable passphrases instead of short scrambled words.'
        },
        {
          id: 'pass-3-b',
          text: 'Use your pet name combined with your birth year',
          responseHeadline: 'Serving your password on a silver platter to anyone who checks your Instagram.',
          responseBody: 'Biographical facts like pet names, children\'s birthdays, and sports teams are the first parameters fed into targeted dictionary attacks.',
          saferHabit: 'Keep personal biographical information completely out of your secret passcodes.'
        },
        {
          id: 'pass-3-c',
          text: 'Use a short 8-character string with complex symbols like P@$$w0rd',
          responseHeadline: 'The illusion of complexity: 1998 called, it wants its password back.',
          responseBody: 'Standard leetspeak substitutions are hardcoded into every cracking dictionary on earth. Eight characters can be cracked in hours regardless of symbols.',
          saferHabit: 'Prioritize passphrase length over tricky character substitutions.'
        }
      ]
    },
    {
      id: 'pass-4',
      category: 'Password Security',
      scenario: 'Your colleague asks you to quickly text them your shared department login password over an open group chat.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pass-4-a',
          text: 'Share via an encrypted secret share link or team vault',
          responseHeadline: 'Enterprise standard: secret delivered, zero forensic crumbs left behind.',
          responseBody: 'Password vaults or self-destructing encrypted links ensure secrets aren\'t backed up into unencrypted cloud chat histories or visible on lock screen previews.',
          saferHabit: 'Never leave persistent plaintext credentials sitting in mobile chat channels.'
        },
        {
          id: 'pass-4-b',
          text: 'Text it directly with username and password in one message',
          responseHeadline: 'Congratulations, your department password is now immortalized in chat history.',
          responseBody: 'That credential is now backed up across multiple phones, synced to cloud photo backups, and visible whenever someone accidentally mirrors their screen.',
          saferHabit: 'Plaintext passwords in group chats turn everyday lost phones into company-wide incidents.'
        },
        {
          id: 'pass-4-c',
          text: 'Send the password in chat, then delete the message for yourself',
          responseHeadline: 'Out of sight, still sitting on twenty other screens.',
          responseBody: 'Deleting a message for yourself only removes it from your screen. It remains fully visible in the chat logs and notifications of everyone else in the group.',
          saferHabit: 'One-sided deletions do nothing to clean up credential exposure.'
        }
      ]
    },
    {
      id: 'pass-5',
      category: 'Password Security',
      scenario: 'You notice a browser popup asking: "Would you like to save this banking password?" on a shared lab computer.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pass-5-a',
          text: 'Select "Never" and ensure browser session data is cleared',
          responseHeadline: 'Clean exit: the next user gets a blank screen, not your life savings.',
          responseBody: 'Browser password caches on public terminals store credentials in local profile databases that can be exported or viewed with two clicks in browser settings.',
          saferHabit: 'Never permit password autofill or session caching on hardware you do not personally own.'
        },
        {
          id: 'pass-5-b',
          text: 'Click "Save" so you won’t have to type it again tomorrow',
          responseHeadline: 'Left your keys in the front door of a public library.',
          responseBody: 'The very next student who sits down at that computer can open the banking URL, autofill your credentials, and inspect account balances.',
          saferHabit: 'Shared computers should be treated as untrusted, hostile environments.'
        },
        {
          id: 'pass-5-c',
          text: 'Click "Save" but close the browser window',
          responseHeadline: 'Closing the window doesn\'t delete the hard drive.',
          responseBody: 'Saved passwords are saved to disk, not RAM. Closing the browser window leaves the credential file completely intact for the next user.',
          saferHabit: 'Use incognito mode on shared workstations, but avoid sensitive banking altogether.'
        }
      ]
    }
  ],

  // 3. OTP & ACCOUNT SECURITY
  otp: [
    {
      id: 'otp-1',
      category: 'OTP & Accounts',
      scenario: 'A caller claiming to be telecom support says: "We are upgrading your SIM to 5G. Read out the 6-digit code we just sent."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'otp-1-a',
          text: 'Disconnect immediately; never share OTPs with anyone',
          responseHeadline: 'Trap dismantled: your phone number stays in your pocket.',
          responseBody: 'That 6-digit code was a porting token or account takeover authorization. Telecom carriers never require verbal OTP readouts to provision network upgrades.',
          saferHabit: 'No genuine customer support agent ever needs your one-time verification code.'
        },
        {
          id: 'otp-1-b',
          text: 'Read out the code so your network speed upgrades faster',
          responseHeadline: 'Faster 5G? More like a high-speed SIM swap heist.',
          responseBody: 'You just handed over the master key to migrate your phone number onto an attacker\'s device, giving them complete access to all your incoming banking OTPs.',
          saferHabit: 'Your OTP is your digital signature—giving it away is handing over the keys to your identity.'
        },
        {
          id: 'otp-1-c',
          text: 'Give them a fake number to see if they notice',
          responseHeadline: 'Playing 4D chess with someone who steals phone numbers for a living.',
          responseBody: 'Engaging keeps you tagged on active target lists. A sharp, immediate disconnect and carrier account review is the only safe procedure.',
          saferHabit: 'Hang up and report scam callers immediately instead of playing games.'
        }
      ]
    },
    {
      id: 'otp-2',
      category: 'OTP & Accounts',
      scenario: 'You receive an unexpected SMS with an OTP for an app you didn\'t open, followed by a polite message: "Mistakenly sent to your number, please forward it."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'otp-2-a',
          text: 'Ignore the request and review your account activity',
          responseHeadline: 'Sharp thinking: politeness weaponized, threat rejected.',
          responseBody: 'Attackers trigger password resets using breached email lists, then pretend it was an innocent accident so you hand over the recovery passcode.',
          saferHabit: 'Unexpected OTPs mean someone is testing your account credentials right now.'
        },
        {
          id: 'otp-2-b',
          text: 'Forward the message to be polite and helpful',
          responseHeadline: 'Manners: 10/10. Account security: 0/10.',
          responseBody: 'Being courteous just authorized a stranger straight into your profile. That code was generated by their active login attempt against your username.',
          saferHabit: 'Civility should never override authentication barriers.'
        },
        {
          id: 'otp-2-c',
          text: 'Send a screenshot of the SMS with the code blurred',
          responseHeadline: 'Halfway into the spider\'s web.',
          responseBody: 'Engaging confirms your line is monitored and receptive, and metadata or preview caches can still expose recovery tokens.',
          saferHabit: 'Total silence and an immediate password reset is the proper remedy for unexpected OTP alerts.'
        }
      ]
    },
    {
      id: 'otp-3',
      category: 'OTP & Accounts',
      scenario: 'You get a text: "Your WhatsApp code is 842-194. Do not share this with anyone." You did not request it.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'otp-3-a',
          text: 'Keep the code private and verify your two-step PIN in app',
          responseHeadline: 'Perimeter holds: the door was knocked on, not opened.',
          responseBody: 'Someone tried registering your number on a new device. Without the code and your custom secondary PIN, their session attempt hits a dead end.',
          saferHabit: 'Enable a separate two-step verification PIN in all messaging applications.'
        },
        {
          id: 'otp-3-b',
          text: 'Post the screenshot on your status asking who is trying to hack you',
          responseHeadline: 'Congratulations, you just broadcast your private code to everyone.',
          responseBody: 'Posting security codes on social media stories gives the attacker—and any opportunistic contact—the exact characters needed to complete the takeover.',
          saferHabit: 'Never screenshot or upload authentication codes to social platforms.'
        },
        {
          id: 'otp-3-c',
          text: 'Uninstall and reinstall the messaging app immediately',
          responseHeadline: 'Panicked re-installation achieves nothing but another code.',
          responseBody: 'Your local app is fine; the login probe happened externally on a remote handset. Reinstalling locally only locks you out temporarily.',
          saferHabit: 'Stay calm, keep codes to yourself, and check app security settings.'
        }
      ]
    },
    {
      id: 'otp-4',
      category: 'OTP & Accounts',
      scenario: 'A buyer on an online classifieds site insists: "I am sending a verification PIN to confirm your address before sending payment."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'otp-4-a',
          text: 'Refuse; sellers never need to verify OTPs to receive funds',
          responseHeadline: 'Classifieds classic dismantled: you sell goods, not your bank balance.',
          responseBody: 'Receiving money or scheduling a parcel courier never requires sharing a security verification code. The buyer was trying to link your wallet to their terminal.',
          saferHabit: 'Verification codes authenticate outgoing withdrawals, never incoming payments.'
        },
        {
          id: 'otp-4-b',
          text: 'Share the PIN so the courier delivery gets scheduled',
          responseHeadline: 'And just like that… your wallet balance took the courier ride.',
          responseBody: 'That PIN authorized a merchant debit request. Instead of receiving payment for your used couch, you paid for the scammer\'s shopping spree.',
          saferHabit: 'Never enter or share a PIN/OTP to receive money.'
        },
        {
          id: 'otp-4-c',
          text: 'Ask them to send half the payment first via cash',
          responseHeadline: 'Negotiating payment terms with a ghost.',
          responseBody: 'The buyer had zero interest in your product—their entire operation was an authorization code extraction script.',
          saferHabit: 'Cease communication immediately when buyers introduce artificial OTP verification rituals.'
        }
      ]
    },
    {
      id: 'otp-5',
      category: 'OTP & Accounts',
      scenario: 'An automated IVR call announces: "Suspicious login attempt detected on your bank. Press 1 and enter your OTP to cancel it."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'otp-5-a',
          text: 'Hang up and call the number on the back of your physical card',
          responseHeadline: 'Robo-heist aborted: dialed the real bankers instead.',
          responseBody: 'Criminal syndicates use automated IVR voice bots to trick alarmed users into keying in OTPs, which the bot forwards straight to live transaction gateways.',
          saferHabit: 'Entering OTPs on telephone keypads during incoming calls transfers money straight to attackers.'
        },
        {
          id: 'otp-5-b',
          text: 'Press 1 and quickly punch in the OTP to stop the fraud',
          responseHeadline: 'You pressed 1 to cancel, but your bank heard "Transfer Everything".',
          responseBody: 'The phone bot was finalizing the exact unauthorized transaction it claimed it was canceling. Dual-tone frequencies transmitted your code straight into their API.',
          saferHabit: 'Fraud cancellations never require entering transaction authorization codes.'
        },
        {
          id: 'otp-5-c',
          text: 'Stay on the line to argue with the automated voice',
          responseHeadline: 'Debating an audio file while your time slips away.',
          responseBody: 'Automated robocall systems record your audio and mark your line as an active, responsive candidate for secondary voice phishing campaigns.',
          saferHabit: 'Cut incoming unexpected security calls instantly and call the phone number printed on your debit card.'
        }
      ]
    }
  ],

  // 4. UPI, BANKING & PAYMENT SCAMS
  payments: [
    {
      id: 'pay-1',
      category: 'UPI & Payments',
      scenario: 'Someone calls claiming they accidentally sent ₹5,000 to your UPI ID and sent a collect request so you can "refund" them.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pay-1-a',
          text: 'Decline the request and check your bank statement directly',
          responseHeadline: 'Reverse robbery denied: your balance remains untouched.',
          responseBody: 'Approving a collect request or typing your UPI PIN always deducts funds from your account. The caller never sent you any money in the first place.',
          saferHabit: 'Entering a UPI PIN is strictly for sending money, never for receiving or refunding.'
        },
        {
          id: 'pay-1-b',
          text: 'Approve the collect request and type your UPI PIN',
          responseHeadline: 'You just tipped a scammer ₹5,000 for calling your phone.',
          responseBody: 'A collect request is a payment order that pulls money OUT of your savings. Typing your PIN authorized ₹5,000 to leave your account immediately.',
          saferHabit: 'You NEVER need a UPI PIN to receive money or process refunds.'
        },
        {
          id: 'pay-1-c',
          text: 'Forward the collect notification to your friend to pay them',
          responseHeadline: 'Passing the financial grenade to a friend.',
          responseBody: 'The collect request stays active for whoever approves it. Forwarding it puts your friends at risk of losing their hard-earned money.',
          saferHabit: 'Decline and report suspicious collect requests directly within your UPI app.'
        }
      ]
    },
    {
      id: 'pay-2',
      category: 'UPI & Payments',
      scenario: 'A second-hand marketplace buyer sends you a screenshot of a "successful payment" and says: "Scan this QR code to claim your cash."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pay-2-a',
          text: 'Decline to scan; QR codes in UPI are solely for making payments',
          responseHeadline: 'Physics of UPI respected: money flows outward when you scan.',
          responseBody: 'QR codes are payment instructions that initiate outgoing transactions. Legitimate bank transfers reflect in your balance automatically without scanning anything.',
          saferHabit: 'You scan QR codes to pay merchants, never to receive money from buyers.'
        },
        {
          id: 'pay-2-b',
          text: 'Scan the QR code and enter your PIN to accept the cash',
          responseHeadline: 'QR code scanned. Wallet drained. Buyer vanished.',
          responseBody: 'Entering your security PIN authorizes the gateway to debit your bank account and transfer that sum directly to the scammer\'s merchant handle.',
          saferHabit: 'Direct UPI transfers appear in your passbook without scanning any code.'
        },
        {
          id: 'pay-2-c',
          text: 'Scan it using a normal camera app to inspect the payload',
          responseHeadline: 'Looking at the bait doesn\'t make it less of a hook.',
          responseBody: 'The payload is a standard UPI payment URI prefilled with your bank account as the debit target. The payment screenshot was generated by a fake receipt app.',
          saferHabit: 'Never rely on screenshots—always verify balances directly on official bank statements.'
        }
      ]
    },
    {
      id: 'pay-3',
      category: 'UPI & Payments',
      scenario: 'You search online for "Airline Customer Support" and call the first paid sponsored phone number displayed on Google.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pay-3-a',
          text: 'Hang up and find the contact number on the official boarding ticket',
          responseHeadline: 'Saved your boarding pass and your entire bank account.',
          responseBody: 'Cybercrime syndicates buy top sponsored search results to impersonate airline and bank helplines, directing callers to fake call centers.',
          saferHabit: 'Never trust sponsored search ads for emergency customer care contact numbers.'
        },
        {
          id: 'pay-3-b',
          text: 'Install the "remote refund utility" the helpline agent recommends',
          responseHeadline: 'Screen sharing your way into complete financial compromise.',
          responseBody: 'Remote desktop apps like AnyDesk give the fraudster live control of your phone screen, letting them view your passwords and intercept your banking OTPs in plain sight.',
          saferHabit: 'Legitimate customer support never asks you to download screen sharing utilities.'
        },
        {
          id: 'pay-3-c',
          text: 'Pay a ₹10 "refundable verification fee" to register your ticket',
          responseHeadline: 'The ten-rupee gateway to an empty account.',
          responseBody: 'That small token transaction is a trap to harvest your card details and test gateway velocity before triggering massive unauthorized charges.',
          saferHabit: 'Real airlines do not charge verification fees over informal phone calls.'
        }
      ]
    },
    {
      id: 'pay-4',
      category: 'UPI & Payments',
      scenario: 'You receive a text: "Electricity bill unpaid. Power will be disconnected tonight at 9:30 PM. Call this officer number immediately."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pay-4-a',
          text: 'Check your status via the official state electricity portal',
          responseHeadline: 'Nighttime blackout panic canceled: lights stay on, money stays safe.',
          responseBody: 'Late-night utility threats are psychological pressure tactics designed to force panicked victims into transferring cash without checking their real billing ledger.',
          saferHabit: 'State utility boards issue formal paper notices, not informal SMS threats from personal mobile numbers.'
        },
        {
          id: 'pay-4-b',
          text: 'Call the mobile number and pay via the link they text you',
          responseHeadline: 'Your lights were never in danger, but your savings certainly were.',
          responseBody: 'You just wired funds into a disposable UPI mule account operated by an interstate extortion syndicate.',
          saferHabit: 'Pay utility bills strictly through authorized BBPS gateways or official municipal portals.'
        },
        {
          id: 'pay-4-c',
          text: 'Send a screenshot of your previous bill to the mobile number',
          responseHeadline: 'Handing the scammer your address, meter number, and consumer ID.',
          responseBody: 'Sending past utility bills provides fraudsters with personal identifiers that make future impersonation attacks much more convincing.',
          saferHabit: 'Do not interact with or share documents with unverified mobile numbers.'
        }
      ]
    },
    {
      id: 'pay-5',
      category: 'UPI & Payments',
      scenario: 'You receive a scratch card in a gaming app promising: "You won ₹3,499! Click to deposit into your bank account."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'pay-5-a',
          text: 'Dismiss the popup; legitimate rewards don\'t redirect to UPI PIN screens',
          responseHeadline: 'Lottery illusion dismissed: no magic money, no real losses.',
          responseBody: 'Fake scratch cards are phishing lures that launch your installed UPI app with a pre-filled outbound debit payment disguised as a "claim" button.',
          saferHabit: 'Authentic cashbacks credit your account balance directly without requiring a transaction PIN.'
        },
        {
          id: 'pay-5-b',
          text: 'Tap claim, select your UPI app, and type your security PIN',
          responseHeadline: 'Congratulations! You just won the privilege of sending ₹3,499 away.',
          responseBody: 'The moment you entered your security PIN, that exact amount was deducted from your savings. PIN entry ALWAYS authorizes money moving OUT.',
          saferHabit: 'PIN entry in UPI always means you are paying, never receiving.'
        },
        {
          id: 'pay-5-c',
          text: 'Share the scratch card link with three groups to unlock the prize',
          responseHeadline: 'Multiplying the trap across your entire friend network.',
          responseBody: 'Viral referral mechanics exploit social trust to turn users into spam megaphones for predatory financial phishing campaigns.',
          saferHabit: 'If unlocking a reward requires forwarding links to groups, it is an outright scam.'
        }
      ]
    }
  ],

  // 5. SOCIAL ENGINEERING
  socialEngineering: [
    {
      id: 'soc-1',
      category: 'Social Engineering',
      scenario: 'A caller claims to be from the College IT Department and insists: "We need your portal password right now or your exam hall ticket will be cancelled."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'soc-1-a',
          text: 'Refuse and visit the college IT administrative desk in person',
          responseHeadline: 'Authority bluff called: exam hall ticket secure, password safe.',
          responseBody: 'Real system administrators have direct backend database access; they never need students to verbally disclose passwords over informal phone calls.',
          saferHabit: 'Legitimate administrators never demand credentials over phone calls or chat apps.'
        },
        {
          id: 'soc-1-b',
          text: 'Give them the password immediately so your exam is safe',
          responseHeadline: 'Exam anxiety weaponized: the hacker just passed with flying colors.',
          responseBody: 'Panic is the primary lever in social engineering. Believing the fake threat gave an attacker complete access to your student records and portal data.',
          saferHabit: 'When faced with sudden threats of disciplinary action, verify in person with university staff.'
        },
        {
          id: 'soc-1-c',
          text: 'Ask them to email your personal Gmail account first',
          responseHeadline: 'Changing the channel doesn\'t change the criminal.',
          responseBody: 'A scammer can easily send a convincing phishing email template to your personal inbox to continue the pressure campaign.',
          saferHabit: 'Never share institutional passwords outside official, authenticated login screens.'
        }
      ]
    },
    {
      id: 'soc-2',
      category: 'Social Engineering',
      scenario: 'You get an urgent message on WhatsApp from your boss\'s picture: "I am in an executive meeting and cannot talk. Buy 5 Apple gift cards for a client immediately."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'soc-2-a',
          text: 'Call your boss or their direct assistant on their known office line',
          responseHeadline: 'CEO fraud shattered: gift cards remain on the store shelf.',
          responseBody: 'Executive impersonation relies on employees fearing to question authority. A quick voice confirmation on a known office number collapses the scheme instantly.',
          saferHabit: 'Any urgent request for gift cards, vouchers, or crypto is almost certainly fraudulent.'
        },
        {
          id: 'soc-2-b',
          text: 'Rush to the store and purchase the vouchers with personal funds',
          responseHeadline: 'Five gift cards purchased, zero boss reimbursement coming.',
          responseBody: 'Gift card serial codes are laundered within minutes of being transmitted over chat. Corporate expenses follow purchase orders, not secret messaging errands.',
          saferHabit: 'Corporate procurement uses official PO systems, never personal gift card shopping trips.'
        },
        {
          id: 'soc-2-c',
          text: 'Reply asking what value cards they want before heading out',
          responseHeadline: 'Confirming your compliance for the attacker\'s benefit.',
          responseBody: 'Asking for card values signals that you believe the impersonator, encouraging them to request maximum denomination vouchers.',
          saferHabit: 'Verify out-of-band on official communication channels whenever money or vouchers are requested.'
        }
      ]
    },
    {
      id: 'soc-3',
      category: 'Social Engineering',
      scenario: 'A police officer video calls you in uniform claiming an illegal package in your name was seized at customs and you face arrest within hours.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'soc-3-a',
          text: 'Terminate the call and report the encounter to the 1930 cyber helpline',
          responseHeadline: '"Digital arrest" myth shattered: your savings stay in your custody.',
          responseBody: 'There is no legal concept of a "digital arrest" in India. Law enforcement never conducts formal interrogations, court sessions, or settlements over Skype or WhatsApp.',
          saferHabit: 'No genuine law enforcement agency demands money or holds citizens on video call arrests.'
        },
        {
          id: 'soc-3-b',
          text: 'Stay on the video call and agree to transfer funds to a "court safe account"',
          responseHeadline: 'Surrendered your life savings to a theatrical costume performance.',
          responseBody: 'Scammers stage fake police stations and wear costumes to terrify victims into emptying their bank accounts into illicit mule accounts.',
          saferHabit: 'The concept of a "government safe verification account" is completely fictitious.'
        },
        {
          id: 'soc-3-c',
          text: 'Show them your ID card and bank passbook on video to prove innocence',
          responseHeadline: 'Handing blackmailers all the leverage they were missing.',
          responseBody: 'Showing financial records and identity cards provides the syndicate with exact details to escalate their extortion demands.',
          saferHabit: 'Hang up immediately and walk into your nearest local police station if you have real concerns.'
        }
      ]
    },
    {
      id: 'soc-4',
      category: 'Social Engineering',
      scenario: 'A stranger in a coffee shop frantically asks: "My phone died and my mother is in the hospital. Can I log into my email on your laptop?"',
      prompt: 'What would you do?',
      options: [
        {
          id: 'soc-4-a',
          text: 'Offer to make a phone call for them, but never hand over your unlocked computer',
          responseHeadline: 'Empathy with boundaries: helped a stranger, kept your data safe.',
          responseBody: 'An unlocked browser provides full access to your saved cookies, passwords, session tokens, and file folders in under thirty seconds.',
          saferHabit: 'Never hand an unlocked laptop or personal device to an unfamiliar individual.'
        },
        {
          id: 'soc-4-b',
          text: 'Step away to buy a coffee while letting them use your unlocked browser',
          responseHeadline: 'Leaving your digital life completely unattended on a public table.',
          responseBody: 'Sixty seconds is more than enough time to install a rogue browser extension, export stored passwords, or plant a reverse shell.',
          saferHabit: 'Physical workstation access equals complete security compromise.'
        },
        {
          id: 'soc-4-c',
          text: 'Let them use your laptop as long as you open a guest profile',
          responseHeadline: 'A guest profile is better, but physical hardware is still exposed.',
          responseBody: 'A malicious actor can insert a BadUSB device, monitor local network traffic, or probe connected hardware from any user session.',
          saferHabit: 'Keep personal devices under your exclusive control; offer to dial emergency numbers on speakerphone instead.'
        }
      ]
    },
    {
      id: 'soc-5',
      category: 'Social Engineering',
      scenario: 'An international recruiter on LinkedIn offers a remote job with 4x your salary, requiring an upfront "onboarding registration fee".',
      prompt: 'What would you do?',
      options: [
        {
          id: 'soc-5-a',
          text: 'Research the company independently and reject requests for fees',
          responseHeadline: 'Advance-fee trap identified: real employers pay you, not the reverse.',
          responseBody: 'Legitimate corporate organizations never ask candidates to pay for background checks, laptops, or onboarding processing fees.',
          saferHabit: 'Any recruitment opportunity that requires upfront payment is an advance-fee fraud.'
        },
        {
          id: 'soc-5-b',
          text: 'Pay the small fee because the offered salary is life-changing',
          responseHeadline: 'The job was a mirage, but the registration fee was very real money.',
          responseBody: 'Once you pay the initial fee, the scammers will invent visa fees, insurance fees, and compliance fees until you finally realize no job exists.',
          saferHabit: 'Never pay money to secure an employment offer.'
        },
        {
          id: 'soc-5-c',
          text: 'Send your passport copy and bank details before deciding to pay',
          responseHeadline: 'Gifted your complete identity package to an international syndicate.',
          responseBody: 'Providing identity documents allows fraudsters to open synthetic bank accounts, register burner SIMs, and commit loan fraud under your legal name.',
          saferHabit: 'Never transmit identity documents to unvetted social media recruiters.'
        }
      ]
    }
  ],

  // 6. SOCIAL MEDIA & IMPERSONATION
  socialMedia: [
    {
      id: 'sm-1',
      category: 'Social Media',
      scenario: 'An Instagram account with your friend\'s exact profile picture and username (plus an underscore) DMs: "Hey, I need emergency money."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'sm-1-a',
          text: 'Call your friend on their real phone number to verify',
          responseHeadline: 'Clone account spotted: friend called, fraudster blocked.',
          responseBody: 'Impersonators scrape public profile photos and biographies to create clone accounts and exploit mutual friend trust for emergency loans.',
          saferHabit: 'Always verify unexpected financial requests through an independent voice call.'
        },
        {
          id: 'sm-1-b',
          text: 'Transfer the funds quickly since friends help friends in need',
          responseHeadline: 'Your generosity was genuine. Your friend\'s clone was not.',
          responseBody: 'Your real friend had no idea their photos were being used to fleece their follower list, and the transfer went straight to a money mule.',
          saferHabit: 'Scammers exploit genuine friendships to bypass analytical thinking.'
        },
        {
          id: 'sm-1-c',
          text: 'Ask the DM account security questions about your childhood',
          responseHeadline: 'Playing detective while giving away security question answers.',
          responseBody: 'Engaging risks leaking real biographical information that attackers can use to break your personal account security questions.',
          saferHabit: 'Report the clone account directly through the platform and notify the real individual.'
        }
      ]
    },
    {
      id: 'sm-2',
      category: 'Social Media',
      scenario: 'You see a viral post: "Elon Musk is giving away 5,000 Bitcoin! Send 0.1 BTC to this wallet and get 0.2 BTC back instantly."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'sm-2-a',
          text: 'Ignore and report the post as fraudulent cryptocurrency spam',
          responseHeadline: 'Common sense prevailing: no billionaire is running a money doubling machine.',
          responseBody: 'Every single "send crypto to get double back" campaign is an absolute drain scam promoted using hijacked verified social media profiles.',
          saferHabit: 'Treat all "double your cryptocurrency" offers as guaranteed theft.'
        },
        {
          id: 'sm-2-b',
          text: 'Send a tiny test transaction first to see if it doubles',
          responseHeadline: 'Congratulations, your test transaction passed the test of disappearing forever.',
          responseBody: 'Blockchain transactions are mathematically irreversible. There is no customer support, no chargeback, and zero refunds on decentralized ledgers.',
          saferHabit: 'There are no "test transactions" on public blockchains—once sent, it is gone.'
        },
        {
          id: 'sm-2-c',
          text: 'Comment your wallet address asking for the giveaway',
          responseHeadline: 'Target painted: you just tagged your wallet for targeted phishing.',
          responseBody: 'Posting wallet addresses on fraudulent promotion threads flags your account as interested in crypto giveaways, inviting targeted dusting attacks and phishing.',
          saferHabit: 'Do not interact with or amplify fraudulent financial promotions.'
        }
      ]
    },
    {
      id: 'sm-3',
      category: 'Social Media',
      scenario: 'A message on Discord from a server admin says: "You have been selected as a community moderator. Download this verification tool to accept."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'sm-3-a',
          text: 'Ignore the file and report the hijacked account to server leads',
          responseHeadline: 'Token stealer dodged: Discord account and server remain secure.',
          responseBody: 'Compromised admin accounts are regularly used to distribute infostealers that harvest Discord session tokens, saved browser cookies, and local credentials.',
          saferHabit: 'Never download executable files or scripts to claim roles or prizes on social platforms.'
        },
        {
          id: 'sm-3-b',
          text: 'Download and run the executable to test your microphone',
          responseHeadline: 'Role unlocked: Victim. Session tokens dispatched to a hacker webhook.',
          responseBody: 'The executable harvested your active session tokens, giving attackers complete control over your accounts without even knowing your password.',
          saferHabit: 'Executing unknown binaries from chat messages is the top vector for gamer account compromises.'
        },
        {
          id: 'sm-3-c',
          text: 'Upload the tool to your private cloud storage to inspect later',
          responseHeadline: 'Backing up a trojan horse to your cloud drive.',
          responseBody: 'Syncing infostealers across personal cloud drives risks infecting your other connected workstations and triggering cloud account security suspensions.',
          saferHabit: 'Permanently delete suspicious executables and empty the recycle bin.'
        }
      ]
    },
    {
      id: 'sm-4',
      category: 'Social Media',
      scenario: 'A popular quiz on Facebook asks: "Find out which celebrity you are! Log in with Facebook to give access to your friends list and photos."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'sm-4-a',
          text: 'Skip the quiz; third-party data scraping apps harvest personal profiles',
          responseHeadline: 'Privacy defended: traded zero personal data for a five-second novelty.',
          responseBody: 'Viral personality quizzes monetize by vacuuming friend lists, location telemetry, and profile photos into marketing databases and data broker networks.',
          saferHabit: 'Be strict about third-party OAuth permissions linked to your primary social accounts.'
        },
        {
          id: 'sm-4-b',
          text: 'Grant all permissions because knowing your celebrity twin is fun',
          responseHeadline: 'Your entire social graph traded for a JPEG of Keanu Reeves.',
          responseBody: 'You surrendered the private profile information of your friends and yourself to an unvetted offshore developer for a randomized image generator.',
          saferHabit: 'Novelty quizzes are frequently Trojan horses for massive demographic data harvesting.'
        },
        {
          id: 'sm-4-c',
          text: 'Grant permissions, take the quiz, and hope they forget your data',
          responseHeadline: 'The internet never forgets, especially data harvesting servers.',
          responseBody: 'Once an external app API scrapes your profile data, it is stored on third-party servers outside your control, regardless of whether you remove the app later.',
          saferHabit: 'Audit and revoke unused permissions in the "Connected Apps" tab of your social accounts.'
        }
      ]
    },
    {
      id: 'sm-5',
      category: 'Social Media',
      scenario: 'You receive a notification: "Someone logged into your Instagram account from Moscow, Russia. If this wasn\'t you, tap this link."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'sm-5-a',
          text: 'Open the Instagram app directly and inspect "Login Activity" in Settings',
          responseHeadline: 'Direct verification wins: spoofed notification neutralized.',
          responseBody: 'Checking authentic security logs inside the native app protects you from falling for fake login alert pages designed to intercept your real password.',
          saferHabit: 'Always verify security alerts inside official app settings rather than notification links.'
        },
        {
          id: 'sm-5-b',
          text: 'Tap the link immediately and type your current password to secure it',
          responseHeadline: 'The login notification was fake. Your password handover was 100% real.',
          responseBody: 'The notification was engineered to induce immediate panic. Entering your password on that landing page delivered it directly to the real attackers.',
          saferHabit: 'Panic prompts are designed to stop you from inspecting the browser address bar.'
        },
        {
          id: 'sm-5-c',
          text: 'Post a story telling people your account might get hacked',
          responseHeadline: 'Broadcasting vulnerability before checking if a fire even exists.',
          responseBody: 'Announcing potential security compromises publicly invites opportunistic scammers to target your followers with fake recovery services.',
          saferHabit: 'Check settings calmly, change credentials if needed, and activate multi-factor authentication.'
        }
      ]
    }
  ],

  // 7. PUBLIC WI-FI & DEVICE SAFETY
  deviceSafety: [
    {
      id: 'dev-1',
      category: 'Public Wi-Fi & Devices',
      scenario: 'You find a clean USB flash drive sitting on the desk of your university computer lab labeled "Final Exam Solutions".',
      prompt: 'What would you do?',
      options: [
        {
          id: 'dev-1-a',
          text: 'Hand it over to campus lost-and-found without plugging it in',
          responseHeadline: 'Keystroke injection thwarted: exam integrity and laptop preserved.',
          responseBody: 'Malicious USB drops (like Rubber Ducky devices) emulate human keyboards to inject automated PowerShell commands and backdoors in milliseconds.',
          saferHabit: 'Never connect untrusted physical USB hardware to your computer.'
        },
        {
          id: 'dev-1-b',
          text: 'Plug it in quickly just to see whose files are on it',
          responseHeadline: 'Curiosity plugged in. Antivirus bypassed. Backdoor active.',
          responseBody: 'BadUSB hardware can emulate human keystrokes faster than any human can react, downloading payloads before security software can analyze the drive.',
          saferHabit: 'Physical USB drives found in public spaces should always be treated as hostile devices.'
        },
        {
          id: 'dev-1-c',
          text: 'Plug it into your friend\'s laptop instead',
          responseHeadline: 'With friends like this, who needs cyber adversaries?',
          responseBody: 'Sacrificing a classmate\'s computer doesn\'t eliminate the hazard—it compromises their machine and exposes everyone on the same local Wi-Fi.',
          saferHabit: 'Treat all stray storage media as hazardous electronic waste.'
        }
      ]
    },
    {
      id: 'dev-2',
      category: 'Public Wi-Fi & Devices',
      scenario: 'You are waiting at an international airport and see an unencrypted open Wi-Fi network called "FREE_AIRPORT_HIGH_SPEED".',
      prompt: 'What would you do?',
      options: [
        {
          id: 'dev-2-a',
          text: 'Use your cellular mobile hotspot or connect through a trusted VPN',
          responseHeadline: 'Encrypted fortress: public airwaves silenced, private traffic protected.',
          responseBody: 'Rogue access points (evil twins) can intercept unencrypted network packets, spoof DNS responses, and redirect your browser to credential harvesters.',
          saferHabit: 'Treat public unencrypted Wi-Fi as hostile; use cellular data or a VPN to protect your traffic.'
        },
        {
          id: 'dev-2-b',
          text: 'Connect immediately and open your banking app to transfer money',
          responseHeadline: 'Broadcasting your financial transactions across the airport departure lounge.',
          responseBody: 'Rogue hotspots can perform man-in-the-middle attacks and manipulate unpinned SSL sessions, exposing session headers to nearby eavesdroppers.',
          saferHabit: 'Never execute sensitive financial transactions over open, public Wi-Fi networks.'
        },
        {
          id: 'dev-2-c',
          text: 'Connect to browse, but don\'t log in anywhere',
          responseHeadline: 'A half-measure: background sync still whispers your telemetry.',
          responseBody: 'Even without active logins, background OS sync services and apps transmit device identifiers and unencrypted DNS requests across the open gateway.',
          saferHabit: 'Disable "Auto-Connect to Open Networks" in your mobile Wi-Fi settings.'
        }
      ]
    },
    {
      id: 'dev-3',
      category: 'Public Wi-Fi & Devices',
      scenario: 'Your operating system prompts you: "Important Security Update Available. Restart to apply patches."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'dev-3-a',
          text: 'Save your work and apply the update promptly',
          responseHeadline: 'Vulnerabilities patched: zero-day exploits turned into closed doors.',
          responseBody: 'Security updates patch discovered vulnerabilities that attackers actively automate into scanning kits. Applying patches promptly is the highest-ROI security habit in existence.',
          saferHabit: 'Apply security patches promptly to keep your operating system defended.'
        },
        {
          id: 'dev-3-b',
          text: 'Click "Remind me in 30 days" for the fourth time',
          responseHeadline: 'Living with an open window while inviting the whole internet inside.',
          responseBody: 'Once security patches are released publicly, reverse engineers inspect them to build exploits targeting systems that delay installation.',
          saferHabit: 'Postponing security updates leaves known vulnerabilities undefended.'
        },
        {
          id: 'dev-3-c',
          text: 'Disable automatic updates permanently so popups stop',
          responseHeadline: 'Turned off the fire alarm so you could sleep in peace.',
          responseBody: 'Disabling system updates freezes your computer in time, guaranteeing that automated worms and vulnerability scanners will eventually breach it.',
          saferHabit: 'Leave automatic updates enabled to maintain pace with emerging attack vectors.'
        }
      ]
    },
    {
      id: 'dev-4',
      category: 'Public Wi-Fi & Devices',
      scenario: 'You are studying in a crowded campus library and need to use the restroom for two minutes.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'dev-4-a',
          text: 'Lock your screen (Win+L / Cmd+Ctrl+Q) or pack the laptop with you',
          responseHeadline: 'Physical boundary secured: muscle memory wins the day.',
          responseBody: 'An unattended unlocked laptop takes less than twenty seconds for a passerby to insert an exploit drive, extract session cookies, or browse open tabs.',
          saferHabit: 'Locking your screen every time you step away should be pure second nature.'
        },
        {
          id: 'dev-4-b',
          text: 'Leave it open with your notes displayed so people know the seat is taken',
          responseHeadline: 'Displaying your unlocked digital life for the whole room to explore.',
          responseBody: 'Anyone walking past can read private emails, copy open browser tabs, or deploy scripts onto your machine in under thirty seconds.',
          saferHabit: 'Never leave an unlocked workstation unattended in any public space.'
        },
        {
          id: 'dev-4-c',
          text: 'Ask the stranger at the next table to watch your unlocked laptop',
          responseHeadline: 'Outsourcing your digital security to a stranger wearing headphones.',
          responseBody: 'A stranger has zero obligation or ability to differentiate a thief from a classmate casually walking up to close the lid and walk away with your machine.',
          saferHabit: 'Your device security is your personal responsibility; lock your workstation.'
        }
      ]
    },
    {
      id: 'dev-5',
      category: 'Public Wi-Fi & Devices',
      scenario: 'You see a public USB charging kiosk at a transit hub that has free loose cables hanging for public use.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'dev-5-a',
          text: 'Use your own wall plug adapter or a USB data-blocker condom',
          responseHeadline: 'Juice-jacking repelled: clean power in, zero data out.',
          responseBody: 'Public charging stations can be modified to negotiate data transfer protocols across standard USB pins alongside power delivery, extracting files without warning.',
          saferHabit: 'Charge from standard AC wall outlets using your own certified power adapter.'
        },
        {
          id: 'dev-5-b',
          text: 'Plug your phone directly into the mysterious loose cable',
          responseHeadline: 'Plugging straight into an unknown data pipeline.',
          responseBody: 'If your device initiates a data handshake, a concealed host machine can dump photos, export contacts, or upload configuration profiles.',
          saferHabit: 'Never connect data pins of your phone to untrusted public charging docks.'
        },
        {
          id: 'dev-5-c',
          text: 'Plug in, but select "Trust this computer" on the popup',
          responseHeadline: 'Tapped "Trust" on an electrical socket. Handed over your file system.',
          responseBody: 'Tapping "Trust" authorizes complete local backup generation and file extraction over the cable without requiring further passcode prompts.',
          saferHabit: 'If a charging cable asks for trust permissions, disconnect it immediately.'
        }
      ]
    }
  ],

  // 8. EMAIL & ATTACHMENT SAFETY
  email: [
    {
      id: 'em-1',
      category: 'Email & Attachments',
      scenario: 'You receive an email from "accounts@paypaI-billing.com" (with a capital I instead of l) with an attachment: "INVOICE_OVERDUE.zip".',
      prompt: 'What would you do?',
      options: [
        {
          id: 'em-1-a',
          text: 'Mark as phishing and delete without opening the archive',
          responseHeadline: 'Homoglyph spoof spotted: the capital "I" didn\'t fool your eyes.',
          responseBody: 'Typosquatting with swapped characters is a hallmark of phishing campaigns delivering ZIP archives packed with malicious scripts (.js, .vbs, .scr).',
          saferHabit: 'Always scrutinize domain spelling in sender email addresses.'
        },
        {
          id: 'em-1-b',
          text: 'Extract the ZIP file to see what bill you were charged for',
          responseHeadline: 'Unzipping a surprise package of ransomware into your system.',
          responseBody: 'ZIP archives conceal executable scripts designed to evade email gateway scanners and establish background reverse shells on Windows systems.',
          saferHabit: 'Never open unsolicited compressed archives from unknown external senders.'
        },
        {
          id: 'em-1-c',
          text: 'Reply to the sender telling them they misaddressed the email',
          responseHeadline: 'Replying to confirm you exist and you read your inbox.',
          responseBody: 'Replying to spam validates your email address as live and monitored, instantly boosting your priority on dark web distribution lists.',
          saferHabit: 'Mark as spam and discard malicious emails in complete silence.'
        }
      ]
    },
    {
      id: 'em-2',
      category: 'Email & Attachments',
      scenario: 'A vendor you work with sends an urgent email: "Our bank account has changed due to auditing. Send tomorrow\'s payment to this new account."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'em-2-a',
          text: 'Call the vendor\'s finance manager on their verified phone number to confirm',
          responseHeadline: 'Business Email Compromise shattered: the real finance team verified the wire.',
          responseBody: 'BEC attacks hijack real vendor email threads to quietly alter bank routing coordinates right before scheduled invoices are paid.',
          saferHabit: 'Any change to supplier banking details requires independent voice verification.'
        },
        {
          id: 'em-2-b',
          text: 'Update the wire details immediately to avoid vendor shipment delays',
          responseHeadline: 'Company funds wired directly into a fraudster\'s offshore account.',
          responseBody: 'The vendor\'s email was compromised. Updating banking details without out-of-band verification is how multi-million dollar corporate wire frauds happen.',
          saferHabit: 'Never modify vendor payment details based solely on an email request.'
        },
        {
          id: 'em-2-c',
          text: 'Reply to the email asking: "Are you sure this is the correct account?"',
          responseHeadline: 'Asking the fraudster if they are really sure they want your money.',
          responseBody: 'Since the attacker controls the hijacked email mailbox, they will enthusiastically confirm that the fake bank account is 100% correct.',
          saferHabit: 'Always verify bank changes through an independent, pre-existing communication channel.'
        }
      ]
    },
    {
      id: 'em-3',
      category: 'Email & Attachments',
      scenario: 'You open a Word document attachment from an external sender, and a yellow bar appears: "Macros have been disabled. Click Enable Content to view."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'em-3-a',
          text: 'Close the file immediately and never enable macros',
          responseHeadline: 'VBA script disarmed: document closed, sandbox maintained.',
          responseBody: 'Document macros execute arbitrary Visual Basic code capable of downloading second-stage infostealers and executing commands directly in your operating system.',
          saferHabit: 'Standard reading documents almost never require enabling executable macros.'
        },
        {
          id: 'em-3-b',
          text: 'Click "Enable Content" so the text formatting fixes itself',
          responseHeadline: 'Clicked "Enable Content". Enabled total malware execution instead.',
          responseBody: 'Enabling content bypasses Microsoft Office sandbox protections, allowing the embedded macro to launch PowerShell commands behind the scenes.',
          saferHabit: 'Treat macro authorization prompts as dangerous software installation requests.'
        },
        {
          id: 'em-3-c',
          text: 'Print the file to PDF to bypass the prompt',
          responseHeadline: 'A creative workaround, but the malicious document is already running.',
          responseBody: 'Interacting with malicious document formats can trigger parser exploits. If an unexpected document demands macro permissions, delete it.',
          saferHabit: 'Delete documents that demand macro privileges immediately.'
        }
      ]
    },
    {
      id: 'em-4',
      category: 'Email & Attachments',
      scenario: 'An email arrives with your old password in the subject line claiming: "I recorded you through your webcam. Pay 500 USD in Bitcoin or I share it."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'em-4-a',
          text: 'Recognize this as a known sextortion scam, delete it, and change any sites reusing that password',
          responseHeadline: 'Bluff called with a yawn: no webcam video, just a lazy database scrape.',
          responseBody: 'Sextortion spammers blast automated scripts using old breached passwords to terrify victims. They have zero video footage; their entire leverage is an old public credential dump.',
          saferHabit: 'They have no video—delete the email and update credentials where that old password was used.'
        },
        {
          id: 'em-4-b',
          text: 'Panic and buy cryptocurrency to pay the demanded fee',
          responseHeadline: 'Paid real cryptocurrency for an imaginary webcam recording.',
          responseBody: 'Paying blackmailers marks you as terrified and compliant, guaranteeing immediate follow-up extortion demands for even larger sums.',
          saferHabit: 'Never pay automated extortion emails that rely on breached password templates.'
        },
        {
          id: 'em-4-c',
          text: 'Reply to the email apologizing and explaining you don\'t have money',
          responseHeadline: 'Feeding the extortion bot your emotional distress.',
          responseBody: 'Replying flags your email as monitored by a terrified human, elevating your profile to manual follow-up extortion lists.',
          saferHabit: 'Mark as spam, delete, reset passwords if reused, and continue your day with confidence.'
        }
      ]
    },
    {
      id: 'em-5',
      category: 'Email & Attachments',
      scenario: 'You receive an email from "Google Security Team" asking you to review an unauthorized login by clicking a "Secure My Account" button.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'em-5-a',
          text: 'Open your browser and navigate to myaccount.google.com/security directly',
          responseHeadline: 'Direct navigation: checked the real dashboard, skipped the phishing hook.',
          responseBody: 'Visiting your account security hub directly allows you to inspect real security logs safely without interacting with credential harvesting links.',
          saferHabit: 'Direct navigation to official account portals bypasses phishing landing pages entirely.'
        },
        {
          id: 'em-5-b',
          text: 'Click the button in the email and sign in on the page that opens',
          responseHeadline: 'Delivered your Google master password to a fake login portal.',
          responseBody: 'The button redirected to an identical replica designed to record your username, password, and session cookie before redirecting you to Google.',
          saferHabit: 'Always check the browser address bar for official top-level domains before signing in.'
        },
        {
          id: 'em-5-c',
          text: 'Check the email on your phone because phones cannot be hacked',
          responseHeadline: 'A dangerous myth: mobile screens just make fake links harder to spot.',
          responseBody: 'Mobile browsers truncate URLs and hide address bars, making fake login portals even more convincing than on desktop monitors.',
          saferHabit: 'Phishing exploits human perception regardless of the device you use.'
        }
      ]
    }
  ],

  // 9. PRIVACY & PERSONAL INFORMATION
  privacy: [
    {
      id: 'priv-1',
      category: 'Privacy & Data',
      scenario: 'A free mobile wallpaper app requests permissions for your contacts, SMS messages, precise location, and camera.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'priv-1-a',
          text: 'Deny permissions and uninstall the application immediately',
          responseHeadline: 'Data harvest denied: a wallpaper app has no business reading your text messages.',
          responseBody: 'Setting wallpapers requires zero runtime permissions other than gallery access. Intrusive permission requests indicate a spyware wrapper harvesting address books for brokers.',
          saferHabit: 'Always question whether an app\'s requested permissions match its core functionality.'
        },
        {
          id: 'priv-1-b',
          text: 'Grant all permissions because everyone wants pretty wallpapers',
          responseHeadline: 'Traded your contacts, messages, and location for a photo of a sunset.',
          responseBody: 'The app can now quietly exfiltrate your address book, monitor incoming SMS OTPs, and track your physical location throughout the day.',
          saferHabit: 'Excessive app permissions are the primary vehicle for background data exfiltration.'
        },
        {
          id: 'priv-1-c',
          text: 'Allow permissions "Only While Using the App"',
          responseHeadline: 'Still too generous: sixty seconds is enough to scrape your whole phonebook.',
          responseBody: 'While open, the application still has complete authority to upload your entire message history and contacts to remote analytics servers.',
          saferHabit: 'If the app\'s utility doesn\'t require the permission, deny it completely.'
        }
      ]
    },
    {
      id: 'priv-2',
      category: 'Privacy & Data',
      scenario: 'You pass your driving test or receive your new passport and are excited to celebrate your achievement.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'priv-2-a',
          text: 'Celebrate with friends without posting photos of government IDs online',
          responseHeadline: 'Celebrated the milestone: identity guarded, fraud avoided.',
          responseBody: 'Government documents contain complete identification datasets—document numbers, date of birth, home address, and signature—used in synthetic identity theft.',
          saferHabit: 'Never upload identity cards, boarding passes, or diplomas to public social media.'
        },
        {
          id: 'priv-2-b',
          text: 'Post an uncensored high-resolution selfie holding your passport',
          responseHeadline: 'Congratulations! You just gifted your KYC package to identity thieves.',
          responseBody: 'High-resolution photos of government IDs can be used to pass automated verification checks on fraudulent financial exchanges and crypto accounts.',
          saferHabit: 'Keep sensitive government identifiers completely off the public internet.'
        },
        {
          id: 'priv-2-c',
          text: 'Cover just your photo and post the rest of the document',
          responseHeadline: 'Covered your face, left the valuable numbers wide open.',
          responseBody: 'Identity thieves don\'t care about your photo—they care about your document number, full legal name, date of birth, and home address.',
          saferHabit: 'Document numbers and biographical details are what fraudsters use to open fraudulent accounts.'
        }
      ]
    },
    {
      id: 'priv-3',
      category: 'Privacy & Data',
      scenario: 'A random quiz website asks for your Aadhaar / National ID number, mother\'s maiden name, and home address to "predict your future".',
      prompt: 'What would you do?',
      options: [
        {
          id: 'priv-3-a',
          text: 'Close the tab; those fields are standard banking security questions',
          responseHeadline: 'Future predicted: your financial accounts remain unhacked.',
          responseBody: 'Disguising financial security questions and government identifiers as viral novelty games is a classic profiling tactic to assemble password recovery datasets.',
          saferHabit: 'Never enter government IDs or security question answers on entertainment websites.'
        },
        {
          id: 'priv-3-b',
          text: 'Fill it out truthfully because you are genuinely curious about the prediction',
          responseHeadline: 'Your future: dealing with identity theft and bank password resets.',
          responseBody: 'You just provided the exact dataset required to answer security questions, reset banking passwords, and impersonate you over customer service lines.',
          saferHabit: 'Your biographical details are authentication tokens—treat them as secrets.'
        },
        {
          id: 'priv-3-c',
          text: 'Fill it out with fake information just to read the joke prediction',
          responseHeadline: 'Fake data protects your identity, but you\'re still feeding ad trackers.',
          responseBody: 'While fake details prevent identity theft, staying on the site allows invasive ad scripts to fingerprint your browser and log your IP address.',
          saferHabit: 'Close disreputable data-harvesting sites entirely.'
        }
      ]
    },
    {
      id: 'priv-4',
      category: 'Privacy & Data',
      scenario: 'You are throwing away old bank statements, tax documents, and utility bills during spring cleaning.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'priv-4-a',
          text: 'Cross-cut shred or physically tear through account numbers before disposal',
          responseHeadline: 'Physical security intact: dumpster divers find paper confetti, not your money.',
          responseBody: 'Scavenging through residential trash remains a surprisingly common method for local fraud rings to discover bank relationships and account numbers.',
          saferHabit: 'Shred or black out account numbers on paper mail before recycling.'
        },
        {
          id: 'priv-4-b',
          text: 'Toss them intact into the public sidewalk recycling bin',
          responseHeadline: 'Paper breadcrumbs left on the sidewalk for anyone to read.',
          responseBody: 'Anyone walking down the street can pull intact statements from your bin, reconstructing your banking relationships, account numbers, and address.',
          saferHabit: 'Physical security is the foundation of digital privacy.'
        },
        {
          id: 'priv-4-c',
          text: 'Just fold the pages in half before throwing them away',
          responseHeadline: 'A folded piece of paper: the world\'s weakest cryptographic barrier.',
          responseBody: 'Folding a document takes one second to unfold. It does nothing to obscure your account numbers or financial transaction records.',
          saferHabit: 'Tear or cross-cut shred sensitive financial records before discarding.'
        }
      ]
    },
    {
      id: 'priv-5',
      category: 'Privacy & Data',
      scenario: 'A retail store cashier asks for your personal phone number, home pincode, and email address just to bill a bottle of water.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'priv-5-a',
          text: 'Politely decline; phone numbers are not legally required for retail billing',
          responseHeadline: 'Boundary established: bought a bottle of water, kept your privacy.',
          responseBody: 'Retailers build commercial tracking graphs and package customer phone numbers into marketing databases that get shared with telemarketers.',
          saferHabit: 'You have the legal right to decline providing personal phone numbers for retail cash/card purchases.'
        },
        {
          id: 'priv-5-b',
          text: 'Call out your phone number loudly across the crowded checkout line',
          responseHeadline: 'Broadcast your personal number to everyone waiting in line.',
          responseBody: 'Calling out phone numbers in public queues links your personal contact info directly to your physical appearance in front of complete strangers.',
          saferHabit: 'Avoid speaking personal phone numbers aloud in crowded commercial spaces.'
        },
        {
          id: 'priv-5-c',
          text: 'Give them your secondary spam number or say you don\'t have a phone',
          responseHeadline: 'Practical compartmentalization: primary inbox stays quiet.',
          responseBody: 'Using a burner alias or secondary number isolates your primary inbox from aggressive marketing databases and promotional SMS floods.',
          saferHabit: 'Compartmentalize secondary contact details away from your primary financial identities.'
        }
      ]
    }
  ],

  // 10. APPS, DOWNLOADS & BROWSER SAFETY
  appsBrowser: [
    {
      id: 'app-1',
      category: 'Apps & Downloads',
      scenario: 'A movie streaming website says: "You must install this HD Video Codec Extension to play this video."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'app-1-a',
          text: 'Close the tab immediately; modern browsers play HTML5 video natively',
          responseHeadline: 'Browser hijacker dodged: modern web browsers play video without mystery extensions.',
          responseBody: 'Fake "codec" or "player" requirements on streaming sites are almost exclusively malicious extensions that hijack your search engine and inject advertisements.',
          saferHabit: 'Never install browser extensions prompted by video streaming popups.'
        },
        {
          id: 'app-1-b',
          text: 'Install the extension quickly so the stream starts buffering',
          responseHeadline: 'Installed a "video player". Got an infostealer that reads every tab you open.',
          responseBody: 'That extension requested permission to "read and change all data on all websites you visit", allowing it to intercept passwords, cookies, and credit cards.',
          saferHabit: 'Browser extensions can read everything on your screen—audit them strictly.'
        },
        {
          id: 'app-1-c',
          text: 'Install it, watch the movie, and plan to remove it next week',
          responseHeadline: 'Malware doesn\'t wait for the closing credits to steal your cookies.',
          responseBody: 'Malicious extensions exfiltrate active session cookies within milliseconds of installation. Removing it a week later is seven days too late.',
          saferHabit: 'Never install untrusted software even temporarily.'
        }
      ]
    },
    {
      id: 'app-2',
      category: 'Apps & Downloads',
      scenario: 'A friend sends you a link to download a "Modded / Cracked Spotify Premium APK" from an unverified forum.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'app-2-a',
          text: 'Stick to official app stores; pirated APKs frequently bundle Trojans',
          responseHeadline: 'Device integrity intact: free music isn\'t worth a remote access trojan.',
          responseBody: 'Cracked software packages modify the original binary to inject remote access tools, keyloggers, and SMS interceptors that bypass platform controls.',
          saferHabit: 'Downloading sideloaded APKs from forums bypasses all operating system security protections.'
        },
        {
          id: 'app-2-b',
          text: 'Enable "Install from Unknown Sources" and install the APK',
          responseHeadline: 'Free tunes on the front end, background spyware on the back end.',
          responseBody: 'The APK plays music while quietly reading your notification feed, intercepting banking OTPs, and uploading device telemetry to command-and-control servers.',
          saferHabit: 'If a commercial subscription service is offered for free, your device security is the price.'
        },
        {
          id: 'app-2-c',
          text: 'Install it on an old backup tablet with your primary Google account',
          responseHeadline: 'Infecting the backup device while keeping the primary account attached.',
          responseBody: 'The compromised tablet on your local Wi-Fi still has access to your Google sync tokens and can sniff unencrypted local network traffic.',
          saferHabit: 'Keep all devices on your home network clean from unauthorized modified binaries.'
        }
      ]
    },
    {
      id: 'app-3',
      category: 'Apps & Downloads',
      scenario: 'A browser popup flashes with a loud siren: "VIRUS DETECTED! Windows is infected with 5 viruses. Call Microsoft Support now!"',
      prompt: 'What would you do?',
      options: [
        {
          id: 'app-3-a',
          text: 'Close the browser tab (or kill the browser process); it is fake scareware',
          responseHeadline: 'Scareware brushed off: browser tabs cannot scan your local hard drive.',
          responseBody: 'Web pages inside a browser sandbox cannot inspect your local filesystem for malware. It is a fraudulent HTML popup designed to panic you into calling a call center.',
          saferHabit: 'Real antivirus alerts come from your local system security tray, never from inside a browser tab.'
        },
        {
          id: 'app-3-b',
          text: 'Call the toll-free number on screen and let them clean your computer',
          responseHeadline: 'Dialing directly into a boiler room tech support scam.',
          responseBody: 'The "technician" on the other end will charge hundreds of dollars to install fake diagnostics and remote desktop utilities that compromise your system.',
          saferHabit: 'Microsoft and Apple never post telephone numbers inside browser alerts demanding support calls.'
        },
        {
          id: 'app-3-c',
          text: 'Click the "Clean Now" button inside the web page',
          responseHeadline: 'Clicked "Clean Now". Downloaded real malware.',
          responseBody: 'Clicking triggers the download of real rogue scareware designed to lock your screen or encrypt your documents until a ransom is paid.',
          saferHabit: 'Use Ctrl+W or Alt+F4 to exit trapped browser popups safely.'
        }
      ]
    },
    {
      id: 'app-4',
      category: 'Apps & Downloads',
      scenario: 'You find an open-source utility on GitHub with 0 stars and no commit history, offering a precompiled `.exe` file in the Releases tab.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'app-4-a',
          text: 'Review the source code, inspect repository credibility, and scan the binary with VirusTotal',
          responseHeadline: 'Engineer\'s prudence: verified the code before running unknown machine code.',
          responseBody: 'Threat actors regularly spin up disposable GitHub repositories to distribute disguised infostealers under popular trending search tags.',
          saferHabit: 'Never blindly execute compiled release binaries from unvetted repositories.'
        },
        {
          id: 'app-4-b',
          text: 'Run the executable as Administrator immediately',
          responseHeadline: 'Rolled out the red carpet with kernel-level administrative privileges.',
          responseBody: 'Running an unknown binary as Administrator allows malicious payloads to disable Windows Defender, install rootkits, and achieve permanent persistence.',
          saferHabit: 'Never elevate permissions on unverified executables.'
        },
        {
          id: 'app-4-c',
          text: 'Bypass your antivirus warning when it flags the executable',
          responseHeadline: 'Silencing the security guard because you wanted the mystery package.',
          responseBody: 'Heuristic detections flag suspicious signature patterns and unrecognized binaries for a reason. Dismissing them removes your last layer of defense.',
          saferHabit: 'Heed security software warnings on newly compiled unknown binaries.'
        }
      ]
    },
    {
      id: 'app-5',
      category: 'Apps & Downloads',
      scenario: 'Your browser asks: "example-recipes.com wants permission to Show Notifications".',
      prompt: 'What would you do?',
      options: [
        {
          id: 'app-5-a',
          text: 'Block notifications unless it is a primary communication app you trust',
          responseHeadline: 'Sanity preserved: desktop notification tray stays quiet and clean.',
          responseBody: 'Rogue websites abuse web push permissions to flood desktops with fake system virus warnings, crypto scams, and illicit advertising banners.',
          saferHabit: 'Deny notification requests from random content websites by default.'
        },
        {
          id: 'app-5-b',
          text: 'Allow notifications just so you can read the cooking recipe',
          responseHeadline: 'Wanted a pasta recipe. Subscribed to hourly fake virus alerts.',
          responseBody: 'Your system tray will now receive persistent popups engineered to look like Windows Defender alerts, prompting you to call fake helplines.',
          saferHabit: 'Reading a website article never requires granting notification privileges.'
        },
        {
          id: 'app-5-c',
          text: 'Allow notifications and mute your computer sound',
          responseHeadline: 'Muted the volume, but the visual spam barrage continues.',
          responseBody: 'The visual popups will continue interrupting your workflow and tempting you with misleading icons even when your speaker volume is zero.',
          saferHabit: 'You can disable notification permission prompts globally in your browser settings.'
        }
      ]
    }
  ],

  // 11. 2FA / MFA & LOGIN SECURITY
  mfa: [
    {
      id: 'mfa-1',
      category: '2FA & MFA',
      scenario: 'You are setting up two-factor authentication on your primary email and can choose between SMS codes or an Authenticator App.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'mfa-1-a',
          text: 'Choose an Authenticator App (like Google Authenticator or Aegis)',
          responseHeadline: 'Gold standard: time-based cryptographic codes that can\'t be SIM-swapped.',
          responseBody: 'TOTP authenticator apps generate rotating codes locally on your device without transmitting anything across telecom cellular networks.',
          saferHabit: 'Authenticator apps are significantly more secure and resilient than SMS-based verification.'
        },
        {
          id: 'mfa-1-b',
          text: 'Stick with SMS because checking text messages feels easier',
          responseHeadline: 'Convenient today, vulnerable to SIM swap attacks tomorrow.',
          responseBody: 'SMS codes travel over legacy telecom protocols and can be intercepted by bribing or social-engineering mobile carrier retail representatives.',
          saferHabit: 'Upgrade from SMS to app-based TOTP or hardware security keys whenever available.'
        },
        {
          id: 'mfa-1-c',
          text: 'Skip 2FA altogether because your password is long enough',
          responseHeadline: 'A single point of failure guarding your entire digital life.',
          responseBody: 'Even a 30-character password is vulnerable to database breaches, browser cookie theft, and reverse-proxy phishing if not backed by 2FA.',
          saferHabit: '2FA blocks 99% of automated credential attacks even if your password is leaked.'
        }
      ]
    },
    {
      id: 'mfa-2',
      category: '2FA & MFA',
      scenario: 'At 3:00 AM, your phone starts buzzing continuously with 20 push approval requests: "Are you trying to sign in?"',
      prompt: 'What would you do?',
      options: [
        {
          id: 'mfa-2-a',
          text: 'Deny the requests, do not approve, and change your account password immediately',
          responseHeadline: 'MFA fatigue defeated: attacker locked out, password refreshed.',
          responseBody: 'MFA bombing bombards victims with notifications in the middle of the night hoping they groggily tap "Approve" just to silence the phone vibration.',
          saferHabit: 'Repeated unexpected MFA prompts mean the attacker already knows your password—change it now.'
        },
        {
          id: 'mfa-2-b',
          text: 'Tap "Approve" just to make your phone stop vibrating so you can sleep',
          responseHeadline: 'Silenced your phone by opening the front door to an intruder.',
          responseBody: 'Tapping Approve grants the attacker an authorized session token. The entire barrage was designed to wear down your patience until you surrendered.',
          saferHabit: 'Never approve an authentication prompt you did not personally trigger.'
        },
        {
          id: 'mfa-2-c',
          text: 'Turn your phone on silent and go back to sleep',
          responseHeadline: 'Ignoring the smoke alarm while the fire keeps burning.',
          responseBody: 'While you didn\'t approve the prompt, the attacker still holds your active password and will try again when you wake up.',
          saferHabit: 'Change account credentials immediately upon detecting unauthorized MFA bombing.'
        }
      ]
    },
    {
      id: 'mfa-3',
      category: '2FA & MFA',
      scenario: 'When setting up 2FA, the service gives you 10 "Backup Recovery Codes" and tells you to save them safely.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'mfa-3-a',
          text: 'Store them securely in an encrypted vault or printed in a physical safe',
          responseHeadline: 'Lifesaver secured: guaranteed account recovery if your phone takes a swim.',
          responseBody: 'If your device is damaged, lost, or reset, recovery codes are your sole cryptographic emergency exit to restore account access without support delays.',
          saferHabit: 'Keep backup codes stored securely outside the device running your authenticator app.'
        },
        {
          id: 'mfa-3-b',
          text: 'Take a quick screenshot and leave it in your public cloud camera roll',
          responseHeadline: 'Stored the emergency keys in an unencrypted photo gallery.',
          responseBody: 'Screenshots synced across cloud photo albums can be indexed by OCR scrapers, exposed in cloud breaches, or read by third-party photo apps.',
          saferHabit: 'Do not leave authentication backup codes sitting in plaintext camera albums.'
        },
        {
          id: 'mfa-3-c',
          text: 'Click "Skip / I have saved them" without writing anything down',
          responseHeadline: 'Self-inflicted digital lockout scheduled for your next phone upgrade.',
          responseBody: 'The moment you upgrade, lose, or break your smartphone, you will be permanently locked out of your account with no secondary recovery route.',
          saferHabit: 'Always save recovery codes before completing 2FA onboarding.'
        }
      ]
    },
    {
      id: 'mfa-4',
      category: '2FA & MFA',
      scenario: 'You sign into your company account and see a prompt: "Number Matching: Type the number shown on your computer into your phone app."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'mfa-4-a',
          text: 'Only type the number if you initiated the login on your screen right now',
          responseHeadline: 'Number matching working as intended: blind push attacks neutralized.',
          responseBody: 'Number matching requires reading a two-digit number from your actual computer screen and typing it on mobile, preventing accidental approvals of remote attacks.',
          saferHabit: 'Number matching stops attackers from tricking you with blind push notifications.'
        },
        {
          id: 'mfa-4-b',
          text: 'Type a number sent to you by a coworker over chat',
          responseHeadline: 'Acting as an unwitting authentication proxy for an intruder.',
          responseBody: 'You just authenticated a remote session for an attacker who was impersonating your coworker or using their compromised chat account.',
          saferHabit: 'Never enter numbers on your authenticator app provided by third parties.'
        },
        {
          id: 'mfa-4-c',
          text: 'Type a random 2-digit number just to test the validation',
          responseHeadline: 'Failed login recorded in the SOC security event log.',
          responseBody: 'Entering incorrect numbers triggers anomaly alerts and account lockouts. Treat authentication prompts with strict intentionality.',
          saferHabit: 'Use authentication mechanisms strictly for your own active sign-in sessions.'
        }
      ]
    },
    {
      id: 'mfa-5',
      category: '2FA & MFA',
      scenario: 'You buy a new smartphone. What is the safest order of operations for your 2FA authenticator app?',
      prompt: 'What would you do?',
      options: [
        {
          id: 'mfa-5-a',
          text: 'Transfer your 2FA accounts to the new phone and verify logins BEFORE wiping the old phone',
          responseHeadline: 'Smooth migration: new phone running, zero locked accounts.',
          responseBody: 'Verifying that TOTP seeds work on the replacement device before erasing the old handset prevents painful lockouts and lengthy account recovery tickets.',
          saferHabit: 'Never wipe your old device until your new phone successfully passes a live 2FA test.'
        },
        {
          id: 'mfa-5-b',
          text: 'Factory reset the old phone immediately, then try downloading the app on the new phone',
          responseHeadline: 'Wiped your authenticator keys into electronic oblivion.',
          responseBody: 'Authenticator app seeds are stored in secure local hardware enclaves. Wiping the old phone erases the secret seeds permanently.',
          saferHabit: 'Always migrate 2FA tokens before initiating factory resets.'
        },
        {
          id: 'mfa-5-c',
          text: 'Disable 2FA on all accounts permanently so you don\'t have to migrate',
          responseHeadline: 'Threw away the deadbolt because carrying the key felt inconvenient.',
          responseBody: 'Disabling multi-factor authentication to save five minutes of migration leaves your email, banking, and social accounts completely defenseless.',
          saferHabit: 'Modern authenticator apps support seamless end-to-end encrypted device-to-device transfers.'
        }
      ]
    }
  ],

  // 12. ONLINE SHOPPING & SCAMS
  shopping: [
    {
      id: 'shop-1',
      category: 'Shopping & Scams',
      scenario: 'You see an Instagram advertisement for brand new Sony noise-canceling headphones for ₹499 (normally ₹25,000) on "sony-clearance-sale.shop".',
      prompt: 'What would you do?',
      options: [
        {
          id: 'shop-1-a',
          text: 'Ignore the deal; 98% discounts on high-ticket electronics on disposable domains are scams',
          responseHeadline: 'Economic reality check: saved ₹499, kept your credit card safe.',
          responseBody: 'Discounts exceeding 80% on brand-new flagship electronics on newly registered .shop or .xyz domains are fabricated storefronts designed to harvest payment credentials.',
          saferHabit: 'If a price is too good to be true, your financial credentials are the product being harvested.'
        },
        {
          id: 'shop-1-b',
          text: 'Order 3 pairs immediately before the inventory runs out',
          responseHeadline: 'Congratulations, you just ordered three pairs of imaginary headphones.',
          responseBody: 'The website was spun up forty-eight hours ago. You will receive no headphones, and your credit card credentials will be charged across overseas gambling gateways.',
          saferHabit: 'Check domain registration ages on WHOIS before trusting unknown discount storefronts.'
        },
        {
          id: 'shop-1-c',
          text: 'Choose "Cash on Delivery" assuming there is zero risk to you',
          responseHeadline: 'The COD trap: you pay the courier before opening a box of soap.',
          responseBody: 'In COD parcel scams, couriers require cash payment before handing over the parcel. Once you open the box to find counterfeit trash, the delivery service cannot refund you.',
          saferHabit: 'Cash on Delivery does not protect against counterfeit or empty parcel fraud.'
        }
      ]
    },
    {
      id: 'shop-2',
      category: 'Shopping & Scams',
      scenario: 'You get an SMS: "India Post: Your package cannot be delivered due to missing house number. Update address at indiapost-portal-update.com/re-route."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'shop-2-a',
          text: 'Ignore and check tracking on the official indiapost.gov.in portal directly',
          responseHeadline: 'Parcel smishing intercepted: no delivery fee paid to overseas syndicates.',
          responseBody: 'Postal delivery smishing messages are blasted in automated bursts of millions. Official postal departments operate strictly on government (.gov.in) domains.',
          saferHabit: 'Official postal services operate on .gov.in domains, never on random .com or .xyz redirects.'
        },
        {
          id: 'shop-2-b',
          text: 'Click the link and pay the ₹25 redelivery fee with your debit card',
          responseHeadline: 'Paid ₹25 for "redelivery". Subscribed your card to recurring monthly theft.',
          responseBody: 'The ₹25 micro-charge is a deceptive gateway designed to tokenize your card for recurring international subscription charges that drain your account.',
          saferHabit: 'Never enter payment card details on unsolicited parcel delivery links.'
        },
        {
          id: 'shop-2-c',
          text: 'Reply to the text asking what is inside the parcel',
          responseHeadline: 'Chatting with an automated SMS relay script.',
          responseBody: 'Replying validates your phone number as an active, attentive recipient, escalating your priority for future phishing bursts.',
          saferHabit: 'Block and report unsolicited parcel status SMS messages.'
        }
      ]
    },
    {
      id: 'shop-3',
      category: 'Shopping & Scams',
      scenario: 'An online marketplace seller says: "If we complete this transaction directly over WhatsApp and bank transfer instead of the app, I can give you a 20% discount."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'shop-3-a',
          text: 'Refuse and keep all communication and payment strictly inside the platform',
          responseHeadline: 'Good call: your money just avoided taking an unscheduled vacation.',
          responseBody: 'Keeping transactions inside the marketplace preserves escrow buyer protection and gives you recourse if the seller fails to deliver the promised item.',
          saferHabit: 'Keep payments and communication strictly inside the official marketplace platform.'
        },
        {
          id: 'shop-3-b',
          text: 'Transfer the discounted amount directly via IMPS to save 20%',
          responseHeadline: 'And just like that… 20% off became 100% gone.',
          responseBody: 'The seller got your money, your phone number got blocked, and the marketplace\'s buyer protection stayed safely out of the conversation.',
          saferHabit: 'A discount is not worth giving up your payment protection.'
        },
        {
          id: 'shop-3-c',
          text: 'Send half now and promise to send the other half after delivery',
          responseHeadline: 'Half a scam is still a scam with a payment receipt.',
          responseBody: 'Splitting the payment does not solve the core vulnerability: you moved outside the platform\'s escrow coverage, and the fraudster happily walks away with half.',
          saferHabit: 'Don\'t move marketplace transactions off-platform just because the seller offers a discount.'
        }
      ]
    },
    {
      id: 'shop-4',
      category: 'Shopping & Scams',
      scenario: 'You are shopping on a new website and notice the browser address bar reads `http://` (Not Secure) instead of `https://` with a padlock.',
      prompt: 'What would you do?',
      options: [
        {
          id: 'shop-4-a',
          text: 'Do not enter passwords or payment details on unencrypted HTTP pages',
          responseHeadline: 'Plaintext transit blocked: passwords and card numbers kept off the wire.',
          responseBody: 'Without TLS encryption (HTTPS), credit card numbers and passwords are sent across the open internet in plaintext, easily readable by anyone on your local Wi-Fi.',
          saferHabit: 'Never enter sensitive credentials or billing info on sites lacking valid HTTPS encryption.'
        },
        {
          id: 'shop-4-b',
          text: 'Proceed to checkout since the store looks nicely designed',
          responseHeadline: 'Pretty interface, zero transport encryption.',
          responseBody: 'Visual design has nothing to do with transport layer security. Unencrypted HTTP pages allow network eavesdroppers to harvest your card details in real time.',
          saferHabit: 'Visual aesthetics mean nothing if your data transit is completely unencrypted.'
        },
        {
          id: 'shop-4-c',
          text: 'Pay using your credit card instead of debit card so you can dispute later',
          responseHeadline: 'Planning a credit card dispute before you even make the purchase.',
          responseBody: 'Disputes require weeks of paperwork and canceling your card. Preventing data leakage by checking for HTTPS takes two seconds.',
          saferHabit: 'Check for HTTPS as an absolute baseline requirement before shopping online.'
        }
      ]
    },
    {
      id: 'shop-5',
      category: 'Shopping & Scams',
      scenario: 'You receive an email: "Your Amazon order #402-91823 for iPhone 15 Pro Max (₹1,34,900) is confirmed. If you did not place this, call our helpline immediately."',
      prompt: 'What would you do?',
      options: [
        {
          id: 'shop-5-a',
          text: 'Log into your official Amazon account via app/browser and inspect "Your Orders"',
          responseHeadline: 'Phantom invoice unmasked: checked real orders, zero panic needed.',
          responseBody: 'Fake invoice scams create fabricated charges so alarmed recipients dial fraudulent call center numbers printed in the message.',
          saferHabit: 'If an order does not appear in your authentic account purchase history, the email is completely fake.'
        },
        {
          id: 'shop-5-b',
          text: 'Call the helpline number printed in the email to cancel the charge',
          responseHeadline: 'Calling the boiler room helpline to "cancel" an imaginary charge.',
          responseBody: 'The fake support agent will ask you to install remote desktop utilities or read out banking OTPs under the pretext of processing a refund.',
          saferHabit: 'Never dial phone numbers printed inside unexpected invoice receipts.'
        },
        {
          id: 'shop-5-c',
          text: 'Click the "Cancel Order" button in the email footer',
          responseHeadline: 'Clicked "Cancel Order". Landed on a credential harvesting trap.',
          responseBody: 'The cancellation link opens a cloned login portal designed to capture your Amazon username and password so the attacker can hijack your account.',
          saferHabit: 'Manage all order cancellations directly from official account menus.'
        }
      ]
    }
  ]
};

// Flattened list of all questions for easy random picking
export const allCyberSenseQuestions: CyberSenseQuestion[] = Object.values(cyberSenseQuestions).flat();
