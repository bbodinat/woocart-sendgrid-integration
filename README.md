
# SendGrid Integration for WooCart

This is special integration for SendGrid on WooCart which fixes some performance problems.


## Global settings

SendGrid settings can optionally be defined as global variables (wp-config.php):

1. Set the API key. You need to make sure you set the Mail Send permissions to FULL ACCESS, Stats to READ ACCESS and Template Engine to READ or FULL ACCESS when you created the api key on SendGrid side, so you can send emails and see statistics on wordpress):
    * API key:  define('SENDGRID_API_KEY', 'sendgrid_api_key');

2. Set email related settings:
    * Send method ('api' or 'smtp'): define('SENDGRID_SEND_METHOD', 'api');
    * From name: define('SENDGRID_FROM_NAME', 'Example Name');
    * From email: define('SENDGRID_FROM_EMAIL', 'from_email@example.com');
    * Reply to email: define('SENDGRID_REPLY_TO', 'reply_to@example.com');
    * Categories: define('SENDGRID_CATEGORIES', 'category_1,category_2');
    * Template: define('SENDGRID_TEMPLATE', 'templateID');
    * Content-type: define('SENDGRID_CONTENT_TYPE', 'html');
    * Unsubscribe Group: define('SENDGRID_UNSUBSCRIBE_GROUP', 'unsubscribeGroupId');

3. Set widget related settings:
    * Marketing Campaigns API key: define('SENDGRID_MC_API_KEY', 'sendgrid_mc_api_key');
    * Use the same authentication as for sending emails ('true' or 'false'): define('SENDGRID_MC_OPT_USE_TRANSACTIONAL', 'false');
    * The contact list ID: define('SENDGRID_MC_LIST_ID', 'listID');
    * Display the first and last name fields ('true' or 'false'): define('SENDGRID_MC_OPT_INCL_FNAME_LNAME', 'true');
    * First and last name fields are required ('true' or 'false'): define('SENDGRID_MC_OPT_REQ_FNAME_LNAME', 'true');
    * Signup confirmation email subject: define('SENDGRID_MC_SIGNUP_EMAIL_SUBJECT', 'Confirm subscription');
    * Signup confirmation email content: define('SENDGRID_MC_SIGNUP_EMAIL_CONTENT', '&lt;a href="%confirmation_link%"&gt;click here&lt;/a&gt;');
    * Signup confirmation page ID: define('SENDGRID_MC_SIGNUP_CONFIRMATION_PAGE', 'page_id');

4. Other configuration options:
    * Set a custom timeout for API requests to SendGrid in seconds: define('SENDGRID_REQUEST_TIMEOUT', 10);

### Filters

Use HTML content type for a single email:

```
add_filter('wp_mail_content_type', 'set_html_content_type');

// Send the email 

remove_filter('wp_mail_content_type', 'set_html_content_type');
```

Change the email contents for all emails before they are sent:

```
function change_content( $message, $content_type ) {   
    if ( 'text/plain' == $content_type ) {
      $message = $message . ' will be sent as text ' ;
    } else {
      $message = $message . ' will be sent as text and HTML ';
    }

    return $message;
}

add_filter( 'sendgrid_override_template', 'change_content' );
```

Changing the text content of all emails before they are sent:

```
function change_sendgrid_text_email( $message ) {
    return $message . ' changed by way of text filter ';
}

add_filter( 'sendgrid_mail_text', 'change_sendgrid_text_email' );
```

Changing the HTML content of all emails before they are sent:

```
function change_sendgrid_html_email( $message ) {
    return $message . ' changed by way of html filter ';
}

add_filter( 'sendgrid_mail_html', 'change_sendgrid_html_email' );
```

Note that all HTML emails sent through our plugin also contain the HTML body in the text part and that content will pass through the "sendgrid_mail_text" filter as well.

## Frequently asked questions

### Does SendGrid have an Agency program?

Yes. If you are sending email on behalf of clients you can find more information on <a href="https://www.sendgrid.com/partners/agencies/">SendGrid's Agency page </a>

### Is there any official documentation for this plugin ?

Yes. <a href="https://sendgrid.com/docs/Integrate/Tutorials/WordPress/index.html">You can find it here </a>

### What PHP versions are supported ?

Plugin versions 1.11.x were tested and confirmed to work on PHP 5.4, 5.5, 5.6, 7.0, 7.1. It DOES NOT work on PHP 5.3 and earlier.

Plugin versions 1.10.x were tested and confirmed to work on PHP 5.3, 5.4, 5.5 and 5.6. It DOES NOT work on PHP 7.0 and later.

### What credentials do I need to add on settings page ?

Create a SendGrid account at <a href="http://sendgrid.com/partner/wordpress" target="_blank">https://sendgrid.com/partner/wordpress</a> and generate a new API key on <https://app.sendgrid.com/settings/api_keys>.

### How can I define a plugin setting to be used for all sites ?

Add it into your wp-config.php file. Example: `define('SENDGRID_API_KEY', 'your_api_key');`.

### How to use SendGrid with WP Better Emails plugin ?

If you have WP Better Emails plugin installed and you want to use the template defined here instead of the SendGrid template you can add the following code in your functions.php file from your theme:

```php
function use_wpbe_template( $message, $content_type ) {
    global $wp_better_emails;
    if ( 'text/plain' == $content_type ) {
      $message = $wp_better_emails->process_email_text( $message );
    } else {
      $message = $wp_better_emails->process_email_html( $message );
    }

    return $message;
}
add_filter( 'sendgrid_override_template', 'use_wpbe_template', 10, 2 );
```

Using the default templates from WP Better Emails will cause all emails to be sent as HTML (i.e. text/html content-type). In order to send emails as plain text (i.e. text/plain content-type) you should remove the HTML Template from WP Better Emails settings page. This is can be done by removing the '%content%' tag from the HTML template.

### Why are my emails sent as HTML instead of plain text ?

For a detailed explanation see this page: https://sendgrid.com/docs/Classroom/Build/Format_Content/plain_text_emails_converted_to_html.html

### Will contacts from the widget be uploaded to Marketing Campaigns or Legacy Newsletter ?

The contacts will only be uploaded to Marketing Campaigns.

### What permissions should my API keys have ?

For the API Key used for sending emails (the General tab):
 - Full Access to Mail Send.
 - Read Access to Stats.
 - Read Access to Supressions > Unsubscribe Groups.
 - Read Access to Template Engine.
For the API Key used for contact upload (the Subscription Widget tab):
 - Full Access to Marketing Campaigns.


### Can I disable the opt-in email?

No. SendGrid’s Email Policy requires all email addressing being sent to by SendGrid customers be confirmed opt-in addresses.

### Can I use this plugin with BuddyPress ?

Yes. Our plugin required special integration with BuddyPress and it's regularly tested to ensure it behaves as expected. If you have noticed issues caused by installing this plugin along with BuddyPress, you can add the following line to your wp-config.php to disable it :

`define('SENDGRID_DISABLE_BUDDYPRESS', '1');`

If you're trying to send plaintext emails using BuddyPress, keep in mind that by default the whitespace content of those emails is normalized.

That means that some newlines might be missing if you expect them to be there.

To disable this functionality, you need to add the following line in your wp-config.php file:

`define('SENDGRID_DISABLE_BP_NORMALIZE_WHITESPACE', '1');`

### Can I use shortcodes to customize the subscription confirmation page ?

Yes. You need to create custom page and select it from the settings page. You can place any of these shortcodes in the body of that page. Here's an example :

```
Hi [sendgridSubscriptionFirstName] [sendgridSubscriptionLastName],
Your email address : [sendgridSubscriptionEmail] has been successfully added.
You'll hear from us soon!
```

You need to enable the use of the First Name and Last Name fields from the settings page in order to use the shortcodes for them.

### Does this plugin support Multisite?

Yes. This plugin has basic Multisite support. You need to Network Activate this plugin.

The settings for all sites in the network can be configured only by the Network Admin in the Network Admin Dashboard.

Since 1.10.5 the Network Admin can delegate the configuration for each subsite to their respective owners. This will allow any subsite to use it's own SendGrid Plugin configuration.

### How can I further customize my emails?

When calling the wp_mail() function you can send a SendGrid PHP email object in the headers argument.

Here is an example:

```
$email = new SendGrid\Email();
$email
    ->setFrom('me@bar.com')
    ->setHtml('<strong>Hello World!</strong>')
    ->addCategory('customCategory')
;

wp_mail('foo@bar.com', 'Subject goes here', 'Message goes here', $email);
```

You can find more examples here: https://github.com/sendgrid/sendgrid-php/blob/v4.0.2/README.md
