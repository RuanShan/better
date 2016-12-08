var Utils = {

    requestPermission: function(requestType, $buttonElement, $responseMessageElement) {
        $buttonElement.attr('onclick','').unbind('click').css('cursor', 'default');
        $buttonElement.hide();
        $responseMessageElement.show();
        setTimeout(function() {
            $responseMessageElement.fadeOut();
        }, 4000);


        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/user-request',
            scope: this,
            params: {requestType: requestType},
            success: function(response) {},
            failure: function(response) {}
        });
    },

    message: function(type, title, body, messageIconClass) {
        if (messageIconClass === undefined) {
            messageIconClass = 'message-icon';
        }

        var message = Ext.get('message-container');
        var html = '<div class="' + messageIconClass + ' ' + type + '"></div><div class="message-title">' + title + '</div>';

        if (body) {
            html = html + '<div class="message-body">' + body + '</div>';
        }

        //message.removeCls('error');
        //message.removeCls('alert');
        //message.removeCls('info');
        message.removeCls('x-hidden');
        //message.addCls(type);

        message.dom.innerHTML = html;

        Utils.scroll('top');
    },

    clearMessage: function() {
        var message = Ext.get('message-container');

        message.removeCls('error');
        message.removeCls('alert');
        message.removeCls('info');
        message.addCls('x-hidden');

        Ext.getDom('message-container').innerHTML = '';
    },

    initForms: function() {
        var forms = document.forms;
        var form;
        var elements;
        var element;
        var el;
        var i;
        var j;

        for (i = 0; i < forms.length; i++) {
            form = forms[i];
            elements = form.elements;

            for (j = 0; j < elements.length; j++) {
                element = elements[j];

                if ((element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA') && !element.readOnly) {
                    el = Ext.get(element);

                    el.on('focus', function(event, el) {Ext.fly(el).removeCls('error'); Ext.fly(el).addCls('active')});
                    el.on('blur', function(event, el) {Ext.fly(el).removeCls('active')});
                    el.on('keypress', function(event, el) {Ext.fly(el).removeCls('error'); if (event.keyCode == 13) {Utils.submit(el)}});
                }
            }
        }
    },

    initLinks: function() {
        var buttons = Ext.query('a');

        Ext.each(buttons, function(item, index) {
            if (item.getAttribute('href') == '#') {
                item.setAttribute('onclick', 'return false;');
            }
        });
    },

    initButtons: function() {
return;
        var buttons = Ext.query('.direction-button');
        var payout;
        var receipt;
        var instrumentID;
        var direction;
        var button;
        var i;
        var anim =  {
            duration: 1000,
            useDisplay: true,
            easing: 'ease'
        };
        var tpl;
console.log(buttons);
        for (i = 0; i < buttons.length; i++) {
            button = Ext.get(buttons[i]);

            button.on('click', function(event, el) {

                tpl = new Ext.XTemplate(
                    //'<div class="cf"><a class="close"></a></div>',
                    '<table width="100%">',
                        '<tr><td>Expires:</td><td class="receipt-value">14.03.12 13:30</td></tr>',
                        '<tr><td>To Close:</td><td class="receipt-value">Above 32.21</td></tr>',
                        '<tr><td>Payout:</td><td class="receipt-value">60%</td></tr>',
                        '<tr><td>Security:</td><td class="receipt-value">10%</td></tr>',
                        '<tr><td style="padding-top: 0px">Investment:</td><td  style="padding-top: 0px" class="receipt-value">$&nbsp;<input type="text" class="investment" /></td></tr>',
                    '</table>'
                );

                instrumentID = this.getAttribute('instrument');
                direction = this.getAttribute('direction');

                payout = Ext.get('payout-' + instrumentID);
                receipt = Ext.get('receipt-' + instrumentID);

                payout.addCls('hidden');
                receipt.setVisibilityMode(Ext.Element.DISPLAY);

                Ext.getDom('direction-' + instrumentID).innerHTML = tpl.apply({name: 'd'});

                //if (!receipt.hasCls('shown')) {
                    receipt.show(anim);
                    //receipt.addCls('shown');
                //}
            });
        }
    },

    submit: function(el) {
        switch (el.form.id) {
            case 'quick-login-form':
                User.login(true);

                break;
            case 'login-form':
                User.login();

                break;
            case 'reset-password-form':
                User.resetPassword();

                break;
            case 'registration-form':
                User.register();

                break;
            case 'search-form':
                Trading.app.getController('Filter').search();

                break;
            case 'account-info-form':
                User.saveBasicInfo();

                break;
            case 'account-change-password-form':
                User.changePassword();

                break;
            case 'quick-registration-form':
                User.register(true);

                break;
            case 'questionary-form':
                User.saveQuestionary();

                break;
            default:
                Ext.getDom(el.form.id).submit();

                break;
        }
    },

    scroll: function(direction, callback) {
        Ext.TaskManager.start({
            run: function() {
                var scroll;
                var oldPosition;
                var newPosition;
                var scrollTo;

                scroll = Ext.getBody().getScroll();
                oldPosition = scroll.top;

                scrollTo = (direction == 'top') ? oldPosition - 30 : oldPosition + 30;
                window.scroll(0, scrollTo);

                scroll = Ext.getBody().getScroll();
                newPosition = scroll.top;

                if (newPosition == oldPosition) {
                    if (callback) {
                        callback();
                    }

                    return false; // Stopping task

                    //Ext.TaskManager.stop(this);
                }

                return true;
            },
            interval: 10
        });
    },

    showQuickLogin: function() {
        Ext.fly('login-caption').addCls('visible-caption');
        Ext.fly('quick-login-form').addCls('dropdown-visible');
        if (Ext.fly('sign-up')) {
            Ext.fly('sign-up').addCls('transparent');
        }
        Ext.fly('user-menu-login').addCls('active');

        Ext.getBody().on('click', function(event, object) {
            if (!Ext.Array.contains(['quick-login-form', 'email', 'password', 'quick-email' ,'quick-password'], object.id)) {
                Utils.hideQuickLogin();
            }
        });
    },

    hideQuickLogin: function() {
        Ext.fly('login-caption').removeCls('visible-caption');
        Ext.fly('quick-login-form').removeCls('dropdown-visible');
        if (Ext.fly('sign-up')) {
            Ext.fly('sign-up').removeCls('transparent');
        }
        Ext.fly('user-menu-login').removeCls('active');
    },

    fieldTip: function(field, tip, el) {
        if (!el) {
            el = field;
        }

        el = el + '-tip';

        Ext.getDom(el).innerHTML = tip;

        if (tip.length > 0) {
            Ext.fly(field).addCls('error');
        }
        else {
            Ext.fly(field).removeCls('error');
        }
    },

    toggleSideBar: function(event, el) {
        el = Ext.get(el);

        if (el.hasCls('collapsed')) {
            el.removeCls('collapsed');
            el.setHeight(window.innerHeight - 25);
        }
        else {
            el.addCls('collapsed');
            el.setHeight(25);
        }
    },

    log: function(msg) {
        if (Utils.isDev() && console.log) {
            console.log(msg);
        }
    },

    isDev: function() {
        return (Registry.env == 'development');
    },

    validateStake: function(e, el) {
        var value = el.value;

        if (!Ext.isNumeric(value)) {
            el.value = '';
        }
        else {
            if (value.indexOf('.') > -1) {
                var valueExploded = value.split('.');

                el.value = valueExploded[0];
            }

            // Allow only 6 digits
            if (value.length > 6) {
                el.value = value.substr(0, 6);
            }
        }
    },

    phoneNumberLengthLimit: 18,

    validateNumeric: function(e, el) {
        var value = el.value;

        if (value && (!Ext.isNumeric(value) || (value.indexOf('.') > -1))) {
            value = el.value.substr(0, el.value.length - 1);

            if (value && (!Ext.isNumeric(value) || (value.indexOf('.') > -1))) {
                value = '';
            }

            el.value = value;
        }
    },

    testTotalPhoneNumberLength: function() {
        var isAreaCodeActive = User.isAreaCodeActive();

        var dialCode = Registry.dialCodes[$('#country').val()];
        if (dialCode) {
            dialCode = '+' + dialCode + ' ';
        }
        else {
            dialCode = '';
        }
        var areaCode = (isAreaCodeActive && $('#area-code').val().length) ? ('(' + $('#area-code').val() + ') ') : '';
        var phone = $('#phone').val();

        var lengthLimit = this.phoneNumberLengthLimit;

        if ((dialCode + areaCode + phone).length > lengthLimit) {
            return false;
//            phone = (phone.substr(0, lengthLimit - dialCode.length - areaCode.length));
//            $('#phone').val(phone);
//
//            if (isAreaCodeActive && (dialCode + areaCode + phone).length > lengthLimit) {
//                areaCode = ($('#area-code').val().substr(0, lengthLimit - dialCode.length - 3));
//                $('#area-code').val(areaCode);
//            }
        }
        else {
            return true;
        }
    },

    countryChanged: function(country) {
        country = country.toUpperCase();

        Ext.fly('state-wrapper').addCls('x-hidden');

        if (Ext.Array.indexOf(['US', 'CA', 'IN'], country) > -1) {
            var states = Registry.states[country];
            var key;
            var option;

            Ext.fly('state').dom.options.length = 1;

            for (key in states) {
                option = new Option(states[key], key);

                if(key == Registry.selectedState) {
                    option.selected = true;
                }

                Ext.fly('state').dom.options.add(option);
            }

            Ext.fly('state-wrapper').removeCls('x-hidden');
        }
    },

    renderPagination: function(numOfPages, selected, callback) {
        var html = '<li>&nbsp;</li>';
        var items = [];
        var pressed;
        var last;
        var skip;
        var basicPadding = 3;
        var paddingLeft;
        var paddingRight;
        var i;
        var gap = '<li><span class="pagination-gap">...</span></li>';

        if (numOfPages > 1) {
            if (selected < basicPadding + 1) {
                paddingRight = basicPadding + 1 - (selected - basicPadding);
            }
            else {
                paddingRight = basicPadding;
            }

            if (selected > numOfPages - basicPadding) {
                paddingLeft = basicPadding + selected + basicPadding - numOfPages;
            }
            else {
                paddingLeft = basicPadding;
            }

            if (selected != 1) {
                items.push('<li><a href="#" onclick="' + callback + '(' + (selected * 1 - 1) + ', ' + numOfPages + '); return false;" class="button">&lt;</a></li>');
            }

            for (i = 1; i <= numOfPages; i++) {
                skip = false;
                pressed = (i == selected) ? 'pressed' : '';
                last = ((i == selected) && (selected == numOfPages)) ? 'last' : '';

                if (i > 1 && i < numOfPages) {
                    if (i < (selected - paddingLeft - 1)) {
                        skip = true;
                    }

                    if (i == (selected - paddingLeft - 1)) {
                        skip = true;
                        items.push(gap);
                    }

                    if (i == (selected + paddingRight + 1)) {
                        skip = true;
                        items.push(gap);
                    }

                    if (i > (selected + paddingRight + 1)) {
                        skip = true;
                    }
                }

                if (!skip) {
                    items.push('<li><a href="#" onclick="' + callback + '(' + i + ', ' + numOfPages + '); return false;" class="button ' + pressed + ' ' + last + '">' + i + '</a></li>');
                }
            }

            if (selected != numOfPages) {
                items.push('<li><a href="#" onclick="' + callback + '(' + (selected * 1 + 1) + ', ' + numOfPages + '); return false;" class="button last">&gt;</a></li>');
            }

            html = items.join('');
        }

        Ext.fly('pagination').dom.innerHTML = html;
    },

    // Make the screen dark/disabled and display a custom content at the center
    mask: function(elID, tag, attributes, text, width, height, hideXIcon) {
        var maskItem;
        var el;

        Ext.getDom('mask-item').innerHTML = '';
        el = Ext.getDom(elID);

        if (!Ext.isElement(el)) {
            maskItem = document.createElement(tag);

            maskItem.id = elID;

            if(text) {
                maskItem.innerHTML = text;
            }

            for (var key in attributes) {
                maskItem.setAttribute(key, attributes[key]);
            }
        }
        else {
            maskItem = Ext.clone(el);
        }

        Ext.fly('mask-item').appendChild(maskItem);

        width = width ? width : Ext.fly('mask-item-container').dom.offsetWidth;
        height = height ? height : Ext.fly('mask-item-container').dom.offsetHeight;

        Ext.fly('mask-item-container').setStyle('marginLeft', (0 - width / 2) + 'px');
        if (!Registry.iframe) {
        	Ext.fly('mask-item-container').setStyle('marginTop', (0 - height / 2) + 'px');
        }
        Ext.fly('mask-container').addCls('active');
        Ext.fly('mask-container').removeCls('x-hidden');

        if (hideXIcon) {
            Ext.fly('mask-item-x-icon').addCls('x-hidden');
        } else {
            Ext.fly('mask-item-x-icon').removeCls('x-hidden');
        }
    },

    showVideo: function(videoIndex) {
        if (!Registry.videos) {
            return;
        }

        var videoElementID = 'masked-video';

        var attributes = {
            style: 'border: none;',
            id: videoElementID
        };

        var videoWidth = 960;
        var videoHeight = 540;

        Utils.mask('video', 'object', attributes, null, videoWidth, videoHeight);

        jwplayer.key = "ub6rI+BePVpo/oWHwrYoWlUv3juw7RYeXabBcF05PeY=";

        jwplayer(videoElementID).setup({
            playlist: Registry.videos,
            autostart: true,
            listbar: {position: 'right',
                      size: 300},
            width: videoWidth,
            height: videoHeight
        }).playlistItem(videoIndex);
    },

    setCookie: function(key, value, expireDays, subDomainAccess) {
        expireDays = (expireDays) ? expireDays : 365;

        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + expireDays);

        var cookie = key + '=' + escape(value) + ((subDomainAccess) ? ';Path=/;domain=' + Registry.domain : '') + ((expireDays > 0) ? ';expires=' + expireDate.toUTCString() : ';expires=Thu, 01 Jan 1970 00:00:01 GMT');
        document.cookie = cookie;
    },

    getCookie: function(c_name) {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");

        if (c_start == -1)
        {
            c_start = c_value.indexOf(c_name + "=");
        }

        if (c_start == -1)
        {
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);

            if (c_end == -1)
            {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start,c_end));
        }

        return c_value;
    },

    isNumeric: function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    isOldIE: function(minVersion) {
        minVersion = (this.isNumeric(minVersion)) ? minVersion : 9.0;

        var version = -1;

        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

            if (re.exec(ua) != null) {
                version = parseFloat(RegExp.$1);
            }

            return (version < minVersion);
        }
        else {
            return false;
        }
    },

    adjustOldIE: function() {

        if (!Array.prototype.indexOf)
        {
            Array.prototype.indexOf = function(elt /*, from*/)
            {
                var len = this.length >>> 0;

                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);
                if (from < 0)
                    from += len;

                for (; from < len; from++)
                {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        }

        if (typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function() {
                return this.replace(/^\s+|\s+$/g, '');
            }
        }
    },

    calculateTimer: function(currentTime, expiryDate) {
        expiryDate = Ext.Date.parse(expiryDate, 'Y-m-d H:i:s');
        var secondsRemaining = (expiryDate - currentTime) / 1000 - expiryDate.getTimezoneOffset() * 60;
        var minutesRemaining = 0;
        var hoursRemaining = 0;
        var daysRemaining = 0;
        if (secondsRemaining > 0) {
            minutesRemaining = Math.floor(secondsRemaining / 60);
            if (minutesRemaining) {
                secondsRemaining -= minutesRemaining * 60;

                hoursRemaining = Math.floor(minutesRemaining / 60);
                if (hoursRemaining) {
                    minutesRemaining -= hoursRemaining * 60;

                    daysRemaining = Math.floor(hoursRemaining / 24);
                    if (hoursRemaining) {
                        hoursRemaining -= daysRemaining * 24;
                    }
                }
            }
        }
        else {
            secondsRemaining = 0;
        }

        if (secondsRemaining < 10) {
            secondsRemaining = '0' + secondsRemaining;
        }
        if (minutesRemaining < 10) {
            minutesRemaining = '0' + minutesRemaining;
        }
        if (hoursRemaining < 10) {
            hoursRemaining = '0' + hoursRemaining;
        }

        return {
            'daysRemaining' : daysRemaining,
            'hoursRemaining' : hoursRemaining,
            'minutesRemaining' : minutesRemaining,
            'secondsRemaining' : secondsRemaining
        }
    },

    gmtToLocal: function(value) {
        //TimezoneOffset in minutes
        var tzOffset = new Date().getTimezoneOffset();

        var date = Ext.Date.parse(value, 'Y-m-d H:i:s');
        date = Ext.Date.add(date, Ext.Date.MINUTE, tzOffset * -1);

        //return date object in local time
        return date;
    },

    htmlEscape: function(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    htmlUnescape: function(value){
        return String(value)
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    },

    cancelTradeCountdownProgress: function(timerElement, sec) {
        if (!timerElement) {
            return;
        }

        if (sec == 0) {
            timerElement.dom.innerHTML = '';
        } else {
            timerElement.dom.innerHTML = sec.toString();
        }
    },

    countdown: function(options) {
        var timer,
        instance = this,
        seconds = --options.seconds || 10,
        updateStatus = options.onUpdateStatus || function () {},
        counterEnd = options.onCounterEnd || function () {};

        function decrementCounter() {
            updateStatus(seconds);
                    if (seconds == 0) {
            counterEnd();
                    instance.stop();
            }
            seconds--;
        }

        this.start = function () {
            clearInterval(timer);
            timer = 0;
            timer = setInterval(decrementCounter, 1000);
        };

        this.stop = function () {
            clearInterval(timer);
        };
    }
}

var Test = {
    cancel: function(a, b) {
        console.log(a)
        console.log(b)
    }
}

var User = {
    login: function(quick) {
        var prefix = (quick) ? 'quick-' : '';
        var email = Ext.getDom(prefix + 'email');
        var password = Ext.getDom(prefix + 'password');
        var formName = prefix + 'login-form';
        var form = Ext.getDom(formName);
        var errors = false;

        if (!quick) {
            Utils.fieldTip('email', '');
            Utils.fieldTip('password', '');

            if (!Ext.data.validations.email({}, email.value)) {
                errors = true;

                Utils.fieldTip('email', Registry._['invalid-email']);
            }

            if (password.value.length < 6) {
                errors = true;

                Utils.fieldTip('password', Registry._['invalid-password']);
            }

            if (errors) {
                Utils.message('error', Registry._['login-form-errors-title'], Registry._['login-form-errors-body']);
            }
        }

        if (!errors) {
            password.value = MD5(password.value);

            form.submit();
        }
    },

    resendConfirmationEmail: function() {
        Ext.fly('loader-resend-confirmation-email').addCls('loading');

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/resend-confirmation-email',
            success: function(response, options) {
                response = Ext.decode(response.responseText);

                Ext.fly('loader-resend-confirmation-email').removeCls('loading');

                Utils.message(response.type, response.title, response.body);
                Utils.scroll('top');
            },
            failure: function(response, options) {
                // Used when session expires
                eval(response.responseText);
            }
        });
    },

    resetPassword: function() {
        var email = Ext.getDom('email');

        Utils.fieldTip('email', '');

        if (!Ext.data.validations.email({}, email.value)) {
            Utils.fieldTip('email', Registry._['invalid-email']);
            Utils.message('error', Registry._['form-errors-title'], Registry._['form-errors-body']);
        }
        else {
            Ext.fly('reset-password-loader').addCls('loading');

            Ext.Ajax.request({
                url: Registry.uriBase + '/ajax/index/reset-password',
                params: {
                    email: email.value
                },
                success: function(response) {
                    response = Ext.decode(response.responseText);

                    Ext.fly('reset-password-loader').removeCls('loading');

                    Utils.message(response.type, response.title, response.body);
                    Utils.scroll('top');
                }
            });
        }
    },

    register: function(quick) {
        var firstName = Ext.getDom('first-name');
        var lastName = Ext.getDom('last-name');
        var email = Ext.getDom('email');
        var password = Ext.getDom('password');
        var passwordConfirmation = Ext.getDom('password-confirmation');
        var country = Ext.getDom('country');
        var countryCode = Ext.getDom('country-dial-code');
        var areaCode = Ext.getDom('area-code');
        var phone = Ext.getDom('phone');
        var qq = Ext.getDom('qq');
        var disclaimerCheckbox = Ext.getDom('registration-disclaimer-checkbox');
        var formName = (quick) ? 'quick-registration-form' : 'registration-form';
        var form = Ext.getDom(formName);
        var errors = false;

        Utils.fieldTip('first-name', '');
        Utils.fieldTip('last-name', '');
        Utils.fieldTip('email', '');
        if (password) {
            Utils.fieldTip('password', '');
            Utils.fieldTip('password-confirmation', '');
        }
        Utils.fieldTip('country', '');
        Utils.fieldTip('phone', '', 'phone');
        Utils.fieldTip('area-code', '', 'phone');
        if (qq) Utils.fieldTip('qq', '');
        if (disclaimerCheckbox) Utils.fieldTip('registration-disclaimer-checkbox', '');

        if (!firstName.value.length) {
            errors = true;

            Utils.fieldTip('first-name', Registry._['mandatory-field']);
        }

        if (!lastName.value.length) {
            errors = true;

            Utils.fieldTip('last-name', Registry._['mandatory-field']);
        }

        if (!Ext.data.validations.email({}, email.value)) {
            errors = true;

            Utils.fieldTip('email', Registry._['invalid-email']);
        }

        if (password) {
            if (password.value.length < 6) {
                errors = true;

                Utils.fieldTip('password', Registry._['invalid-password']);
            }

            if (passwordConfirmation.value != password.value) {
                errors = true;

                Utils.fieldTip('password-confirmation', Registry._['passwords-dont-match']);
            }
        }

        if (!country.value.length) {
            errors = true;

            Utils.fieldTip('country', Registry._['mandatory-field']);
        }

        if (!areaCode.value.length && User.isAreaCodeActive()) {
            errors = true;

            Utils.fieldTip('area-code', Registry._['mandatory-field'], 'phone');
        }

        if (!Ext.fly('phone-row').hasCls('x-hidden')) {
            if (!phone.value.length) {
                errors = true;

                Utils.fieldTip('phone', Registry._['mandatory-field'], 'phone');
            }
            else if (!Utils.testTotalPhoneNumberLength()) {
                errors = true;

                Utils.fieldTip('phone', Registry._['invalid-phone'], 'phone');
            }
        }

        if (!Ext.fly('qq-row').hasCls('x-hidden')) {
            if (qq && !qq.value.length) {
                errors = true;

                Utils.fieldTip('qq', Registry._['mandatory-field']);
            }
        }

        if (disclaimerCheckbox && !Ext.getDom('registration-disclaimer-checkbox').checked) {
            errors = true;

            Utils.fieldTip('registration-disclaimer-checkbox', Registry._['error-disclaimer-checkbox']);
        }

        if (errors && !quick) {
            Utils.message('error', Registry._['form-errors-title'], Registry._['form-errors-body']);
        }

        if (!errors) {
            if (password) {
                password.value = MD5(password.value);
                passwordConfirmation.value = MD5(passwordConfirmation.value);
            }

            if (!User.isAreaCodeActive()) Ext.getDom('area-code').hidden = true;

            if (Ext.fly('phone-row').hasCls('x-hidden')) {
                Ext.fly('phone-row').remove();
            }

            if (Ext.fly('qq-row').hasCls('x-hidden')) {
                Ext.fly('qq-row').remove();
            }

            form.submit();
        }
    },

    updateRegistrationPhoneFields: function() {
        var areaCode = Ext.get('area-code');
        areaCode.setVisibilityMode(Ext.Element.DISPLAY);
        var phone = Ext.get('phone');

        if (!User.isAreaCodeActive()) {
            areaCode.hide();
            areaCode.dom.value = '';
            phone.addCls('long-field');
        }
        else {
            areaCode.show();
            phone.removeCls('long-field');
        }
    },

    isAreaCodeActive: function() {
        return (Registry.registrationPhoneFieldFormat == 2 || Ext.get('country').dom.value == 'ca');
    },

    saveBasicInfo: function(redirect) {
        var firstName = Ext.getDom('first-name');
        var lastName = Ext.getDom('last-name');
        var email = Ext.getDom('email');
        var nationalID = Ext.getDom('national-id');
        var dobYear = Ext.getDom('dob-year');
        var dobMonth = Ext.getDom('dob-month');
        var dobDay = Ext.getDom('dob-day');
        var address = Ext.getDom('address');
        var city = Ext.getDom('city');
        var state = Ext.getDom('state');
        var zip = Ext.getDom('zip');
        var country = Ext.getDom('country');
        var phone = Ext.getDom('phone');
        var qq = Ext.getDom('qq');

        var errors = false;

        Utils.fieldTip('first-name', '');
        Utils.fieldTip('last-name', '');
        Utils.fieldTip('email', '');
        Utils.fieldTip('national-id', '');
        Utils.fieldTip('dob-year', '', 'dob');
        Utils.fieldTip('dob-month', '', 'dob');
        Utils.fieldTip('dob-day', '', 'dob');
        Utils.fieldTip('address', '');
        Utils.fieldTip('city', '');
        Utils.fieldTip('state', '');
        Utils.fieldTip('zip', '');
        Utils.fieldTip('country', '');
        Utils.fieldTip('phone', '');
        if (qq) Utils.fieldTip('qq', '');

        if (!firstName.value.length) {
            errors = true;

            Utils.fieldTip('first-name', Registry._['mandatory-field']);
        }

        if (!lastName.value.length) {
            errors = true;

            Utils.fieldTip('last-name', Registry._['mandatory-field']);
        }

        if (!Ext.data.validations.email({}, email.value)) {
            errors = true;

            Utils.fieldTip('email', Registry._['invalid-email']);
        }

        if (country.value == 'cn' && !nationalID.value.length) {
            errors = true;

            Utils.fieldTip('national-id', Registry._['mandatory-field']);
        }

        if (!dobYear.value.length) {
            errors = true;

            Utils.fieldTip('dob-year', Registry._['mandatory-field'], 'dob');
        }

        if (!dobMonth.value.length) {
            errors = true;

            Utils.fieldTip('dob-month', Registry._['mandatory-field'], 'dob');
        }

        if (!dobDay.value.length) {
            errors = true;

            Utils.fieldTip('dob-day', Registry._['mandatory-field'], 'dob');
        }

        if (!address.value.length) {
            errors = true;

            Utils.fieldTip('address', Registry._['mandatory-field']);
        }

        if (!city.value.length) {
            errors = true;

            Utils.fieldTip('city', Registry._['mandatory-field']);
        }

        if ((Ext.Array.indexOf(['us', 'ca', 'in'], country.value) > -1) && !state.value.length) {
            errors = true;

            Utils.fieldTip('state', Registry._['mandatory-field']);
        }

        if (!zip.value.length) {
            errors = true;

            Utils.fieldTip('zip', Registry._['mandatory-field']);
        }

        if (!country.value.length) {
            errors = true;

            Utils.fieldTip('country', Registry._['mandatory-field']);
        }

        if (!phone.value.length) {
            errors = true;

            Utils.fieldTip('phone', Registry._['mandatory-field']);
        }

        if (qq && !qq.value.length) {
            errors = true;

            Utils.fieldTip('qq', Registry._['mandatory-field']);
        }

        if (errors) {
            Utils.message('error', Registry._['form-errors-title'], Registry._['form-errors-body']);
        }

        if (!errors) {
            Ext.fly('account-info-loader').addCls('loading');

            var data = {firstName: firstName.value,
                        lastName: lastName.value,
                        email: email.value,
                        nationalID: nationalID.value,
                        dob: dobYear.value + '-' + dobMonth.value + '-' + dobDay.value,
                        address1: address.value,
                        city: city.value,
                        state: state.value,
                        zip: zip.value,
                        country: country.value,
                        phone: phone.value};
            if (qq) {
                data['qq'] = qq.value;
            }

            Ext.Ajax.request({
                url: Registry.uriBase + '/ajax/user/set-basic-info',
                params: data,
                success: function(response) {
                    response = Ext.decode(response.responseText);

                    Ext.fly('account-info-loader').removeCls('loading');

                    Utils.message(response.type, response.title, response.body);
                    Utils.scroll('top');

                    if (redirect) {
                        new Ext.util.DelayedTask(function() {
                            if (!Registry.defaultPlatformRedirectUrl) {
                                document.location.href = Registry.urlBaseNonSecure;
                            }
                            else {
                                window.top.location.href = Registry.defaultPlatformRedirectUrl;
                            }
                        }).delay(3000);
                    }

                    if (Registry.paymentsRedirect) {
                            if (!Registry.defaultPaymentsRedirectUrl) {
                                document.location.href = Registry.urlPaymentsSecure;
                            }
                            else {
                                window.top.location.href = Registry.defaultPaymentsRedirectUrl;
                            }
                    }
                },
                failure: function(response, options) {
                    // Used when session expires
                    eval(response.responseText);
                }
            });
        }
    },

    changePassword: function() {
        var newPassword = Ext.getDom('new-password');
        var passwordConfirmation = Ext.getDom('password-confirmation');
        var errors = false;

        if (!Registry.resetPassword) {
            var oldPassword = Ext.getDom('old-password');

            Utils.fieldTip('old-password', '');
        }

        Utils.fieldTip('new-password', '');
        Utils.fieldTip('password-confirmation', '');

        if (newPassword.value.length < 6) {
            errors = true;

            Utils.fieldTip('new-password', Registry._['invalid-password']);
        }

        if (passwordConfirmation.value != newPassword.value) {
            errors = true;

            Utils.fieldTip('password-confirmation', Registry._['passwords-dont-match']);
        }

        if (!errors) {
            if (!Registry.resetPassword) {
                oldPassword.value = MD5(oldPassword.value);
            }

            newPassword.value = MD5(newPassword.value);
            passwordConfirmation.value = MD5(passwordConfirmation.value);

            Ext.fly('account-change-password-loader').addCls('loading');

            var params = {newPassword: newPassword.value};

            if (!Registry.resetPassword) {
                params.oldPassword = oldPassword.value;
            }

            Ext.Ajax.request({
                url: Registry.uriBase + '/ajax/user/change-password',
                params: params,
                success: function(response) {
                    response = Ext.decode(response.responseText);

                    Ext.fly('account-change-password-loader').removeCls('loading');

                    if (!Registry.resetPassword) {
                        oldPassword.value = '';
                    }

                    newPassword.value = '';
                    passwordConfirmation.value = '';

                    if (response.success && Registry.resetPassword) {
                        if (!Registry.defaultPlatformRedirectUrl) {
                            document.location.href = Registry.urlBaseNonSecure;
                        }
                        else {
                            window.top.location.href = Registry.defaultPlatformRedirectUrl;
                        }
                    }
                    else {
                        Utils.message(response.type, response.title, response.body);
                        Utils.scroll('top');
                    }
                },
                failure: function(response, options) {
                    // Used when session expires
                    eval(response.responseText);
                }
            });
        }
    },

    star: function(instrumentID, unstar) {
        var params = {
            instrumentID: instrumentID
        };

        if (unstar) {
            params.unstar = true;
        }

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/star',
            params: params,
            success: function(response) {
                response = Ext.decode(response.responseText);
            },
            failure: function(response) {
                // Used when session expires
                eval(response.responseText);
            }
        });
    },

    selectCountry: function(country) {
        var dialCode = '&nbsp;';

        if (Registry.dialCodes[country]) {
            dialCode = '+' + Registry.dialCodes[country];
        }

        Ext.fly('read-only-country-flag').dom.className = 'flag';
        Ext.fly('read-only-country-flag').addCls('flag-' + country);
        Ext.fly('read-only-dial-code').dom.innerHTML = dialCode;
        Ext.fly('country-dial-code').dom.value = dialCode;

        User.updateRegistrationPhoneFields();

        if (Registry.qq && country == 'cn') {
            Ext.fly('qq-row').removeCls('x-hidden');
        }
        else {
            Ext.fly('qq-row').addCls('x-hidden');
        }
    },

    validatePublicName: function() {

        var publicName = Ext.getDom('public-name').value;
        var i;

        Ext.fly('public-name-tip').removeCls('alert');
        Ext.fly('public-name-tip').removeCls('accept');
        Ext.fly('public-name-tip').addCls('loading');

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/suggest-public-name',
            params: {publicName: publicName},
            success: function(response) {
                response = Ext.decode(response.responseText);

                Ext.fly('public-name-tip').removeCls('loading');

                if (response.success) {
                    Ext.fly('public-name-tip').removeCls('alert');
                    Ext.fly('public-name-tip').addCls('accept');
                    Ext.fly('public-names-suggestions').addCls('x-hidden');
                }
                else {
                    Ext.fly('public-name-tip').removeCls('accept');
                    Ext.fly('public-name-tip').addCls('alert');

                    Ext.fly('public-names-suggestions').removeCls('x-hidden');
                    Ext.fly('account-social-loader').removeCls('loading');

                    for(i in response.suggestions) {
                        if (!Ext.isEmpty(Ext.getDom('suggestion-' + ((i*1+1))))) {
                            Ext.getDom('suggestion-' + ((i*1+1)) + '-label').innerHTML = response.suggestions[i];
                            Ext.getDom('suggestion-' + ((i*1+1))).value = response.suggestions[i];
                        }
                    }
                }
            },
            failure: function(response) {
                // Used when session expires
                eval(response.responseText);
            }
        });

    },

    changePublicImage: function(event, el) {

        // clear error / success message
        Utils.clearMessage();

        if (Ext.fly('tmp-social-image-form')) {
            Ext.fly('tmp-social-image-form').remove();
        }

        var imageForm = document.createElement('form');
        imageForm.setAttribute('id', 'tmp-social-image-form');
        imageForm.setAttribute('class', 'x-hidden');
        imageForm.setAttribute('enctype', 'multipart/form-data');
        imageForm.setAttribute('method', 'post');
        imageForm.setAttribute('action', Registry.urlBaseSecure + '/ajax/user/change-public-image');
        imageForm.setAttribute('target', 'public-image-hidden-iframe');

        var domainInput = document.createElement('input');
        domainInput.setAttribute('name', 'domain');
        domainInput.setAttribute('value', document.domain);

        imageForm.appendChild(el);
        imageForm.appendChild(domainInput);

        document.body.appendChild(imageForm);
        //console.log(imageForm);

        imageForm.submit();

        Ext.getDom('public-image').appendChild(el);

        Ext.each(Ext.query('.public-image-gallery-item.active'), function(activeImg) {
            Ext.fly(activeImg.id).removeCls('active');
        });
    },

    saveSocialInfo: function() {
        var enableSocial = Ext.getDom('enable-social').value;
        if (parseInt(enableSocial) == 0) {
            Ext.fly('public-name-tip').removeCls('loading');
            Ext.fly('account-social-loader').removeCls('loading');
        }

        var publicName = Ext.getDom('public-name').value;
        var i;

        Ext.fly('account-social-loader').addCls('loading');
        Ext.fly('public-name-tip').removeCls('alert');
        Ext.fly('public-name-tip').removeCls('accept');
        Ext.fly('public-name-tip').addCls('loading');

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/suggest-public-name',
            params: {publicName: publicName},
            success: function(response) {
                response = Ext.decode(response.responseText);

                Ext.fly('public-name-tip').removeCls('loading');

                if (response.success) {
                    Ext.fly('public-name-tip').removeCls('alert');
                    Ext.fly('public-name-tip').addCls('accept');
                    Ext.fly('public-names-suggestions').addCls('x-hidden');

                    Ext.getDom('account-social-form').submit();
                    Ext.fly('account-social-loader').removeCls('loading');

                    /* prepare for proper submit
                    var formData = new FormData($('form')[0]); //doesn't work for IE8 or lower

                    Ext.Ajax.request({
                        url: Registry.uriBase + '/ajax/user/set-social-info',
                        params: formData,
                        success: function(response){
                            response = Ext.decode(response.responseText);
                            Ext.fly('account-social-loader').removeCls('loading');
                        },
                        failure: function(response) {
                            // Used when session expires
                            eval(response.responseText);
                        }
                    })
                    */
                }
                else {
                    Ext.fly('public-name-tip').removeCls('accept');
                    Ext.fly('public-name-tip').addCls('alert');

                    Ext.fly('public-names-suggestions').removeCls('x-hidden');
                    Ext.fly('account-social-loader').removeCls('loading');

                    for(i in response.suggestions) {
                        if (!Ext.isEmpty(Ext.getDom('suggestion-' + ((i*1+1))))) {
                            Ext.getDom('suggestion-' + ((i*1+1)) + '-label').innerHTML = response.suggestions[i];
                            Ext.getDom('suggestion-' + ((i*1+1))).value = response.suggestions[i];
                        }
                    }
                }
            },
            failure: function(response) {
                // Used when session expires
                eval(response.responseText);
            }
        });

    },

    cancelWithdrawal: function(e, el){
        var loader = Ext.fly('loader');

        loader.addCls('loading');
        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/cancel-withdrawal',
            params: {
                id: el.id.replace("rec_", "")
            },
            success: function(response) {
                response = Ext.decode(response.responseText);
                if(response.success) {
                    $(el).parents('tr').remove();
                }

                Utils.message(response.success ? 'success' : 'error', response.message['title'], response.message['body']);

                loader.removeCls('loading');
            },
            failure: function(response) {
                // Used when session expires
                loader.removeCls('loading');
                eval(response.responseText);
            }
        });
    },

    saveQuestionary: function() {
        Ext.fly('questionary-loader').addCls('loading');

        var data = {};
        var elements = Ext.get('questionary-form').dom.elements;

        var errors = false;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].offsetParent == null) {
                continue;
            }

            if (elements[i].type == 'select' || elements[i].type == 'select-one' || elements[i].type == 'text') {
                if (!elements[i].value) {
                    Utils.fieldTip(elements[i].id, Registry._['mandatory-field']);
                    errors = true;
                }
                else {
                    Utils.fieldTip(elements[i].id, '');
                    data[elements[i].name] = elements[i].value;
                }
            }

            if (elements[i].type == 'checkbox') {
                if(typeof data[elements[i].name] === 'undefined') {
                    data[elements[i].name] = [];
                }
                if (elements[i].checked){
                    data[elements[i].name].push(elements[i].value);
                }
            }
        }

        for (var element in data) {
            if (data.hasOwnProperty(element)) {

                if (typeof data[element] === 'object' && Object.keys(data[element]).length === 0) {
                    console.log(element.replace('[]',''));
                    Utils.fieldTip(element.replace('[]',''), Registry._['mandatory-field']);
                    errors = true;
                } else {
                    Utils.fieldTip(element.replace('[]',''), '');
                }

            }
        }

        if (errors) {
            Ext.fly('questionary-loader').removeCls('loading');
            return;
        }

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/set-questionary',
            params: data,
            success: function(response) {
                response = Ext.decode(response.responseText);

                Ext.fly('questionary-loader').removeCls('loading');

                Utils.message(response.type, response.title, response.body);

                if (window.self !== window.top) {
                    window.parent.postMessage('scrollToTop', '*');
                }

                Utils.scroll('top');

                if (response.redirect) {
                    setTimeout(function(){ window.top.location.href = response.redirect; }, 3000);
                }
            },
            failure: function(response, options) {
                // Used when session expires
                eval(response.responseText);
            }
        });
    },

    getResultAnd: function(resultAnd, answer, dependencyAnswerID) {
        if (typeof answer === 'object') {
            var innerLoopResult = false;
            Ext.each(answer, function(answerID) {
                 innerLoopResult = innerLoopResult || (answerID == dependencyAnswerID);
            });
            return resultAnd && innerLoopResult;
        } else {
            return resultAnd && (answer == dependencyAnswerID);
        }
    },


    getQuestionaryForm: function(){
        var data = {};
        var elements = Ext.get('questionary-form').dom.elements;

        for (var i = 0; i < elements.length; i++) {

            if (elements[i].type == 'select' || elements[i].type == 'select-one' || elements[i].type == 'text') {
                data[elements[i].name] = elements[i].value;
            }

            if (elements[i].type == 'checkbox') {
                if(typeof data[elements[i].name] === 'undefined') {
                    data[elements[i].name] = [];
                }
                if (elements[i].checked){
                    data[elements[i].name].push(elements[i].value);
                }
            }
        }

        return data;
    },

    showHideQuestionsSelect: function(questionID, answer, questionaryDependencies){
        var output = {
            show: [],
            hide: []
        };

        if (questionaryDependencies.index[questionID]) {
            var conditionQuestions = questionaryDependencies.index[questionID];

            Ext.each(conditionQuestions, function(conditionQuestionID) {
                var toShow = User.validateCondition(questionID, answer, questionaryDependencies.conditions[conditionQuestionID]);

                var showHide = toShow ? 'show' : 'hide'; // If true, show another question
                output[showHide] = output[showHide].concat(conditionQuestionID);
            });
        }

        return output;
    },

    validateCondition: function(questionID, answer, dependencies) {
        var resultOr = false;

        for (var i = 0; i < dependencies.length; i++) {
            var resultAnd = true;
            var dependencyOr = dependencies[i];

            for (var j = 0; j < dependencyOr.length; j++) {
                var dependencyAnd = dependencyOr[j];

                if (questionID == dependencyAnd.qid) {
                    resultAnd = User.getResultAnd(resultAnd, answer, dependencyAnd.aid);
                } else {
                    //get answer for this question
                    var questionaryForm = User.getQuestionaryForm();
                    var found = false;
                    Ext.iterate(questionaryForm, function(question, formAnswer) {
                        if (question.replace(/answer-|\[\]/g, '') === dependencyAnd.qid.toString()) {
                            resultAnd = User.getResultAnd(resultAnd, formAnswer, dependencyAnd.aid);
                            found = true;
                        }
                    });

                    if (!found) {
                        resultAnd = false;
                    }
                }
            };

            if (resultAnd) {
                resultOr = true;
                break;
            }
        };

        return resultOr;
    },

    toggleAccountType: function(button) {
        button.setAttribute("disabled", "true");

        setTimeout(
            function() {
                Ext.Ajax.request({
                    url: Registry.uriBase + '/ajax/user/practice-mode',
                    method: 'GET',
                    params: {activate: !Registry.practiceMode},
                    success: function (response) {
                        response = Ext.decode(response.responseText);

                        if (response.success) {
                            window.parent.location.href = Registry.defaultPlatformRedirectUrl != '' ? Registry.defaultPlatformRedirectUrl : '/';
                        } else {
                            Utils.message('error', response.message);
                            button.removeAttribute("disabled");
                        }
                    },
                    failure: function () {
                        Utils.message('error', Registry._['Practice technical error']);
                        button.removeAttribute("disabled");
                    }
                });
            }
            , 2000);

    },

    practicePopUpMessage: function(status) {
        if (status === 'expired' && User.practiceExpired) {
            return;
        }

        var message = '';
        var hideXIcon = false;

        switch (status) {
            case 'expired':
                message = Registry._['Your practice account expired'];
                hideXIcon = true;
                User.practiceExpired = true;
                break;
            case 'reset':
                message = Registry._['Your account was restarted back to the initial amount'];
                hideXIcon = true;
                break;
        }

        var popupContent =  '<div id="practice-popup-message">'
                                + message +
                                '<div id = "wallet-mode-change-wrapper"> ' +
                                    '<button id = "to-real-mode-change-button" class = "button button-medium practice-button" href = "#" onClick="User.toggleAccountType(this)">'+ Registry._['Switch to real account'] +'</button>';
        if (status === 'reset') {
            popupContent +=         '<button id = "continue-practice-button" class = "button button-medium" href = "#" onClick=\'this.setAttribute("disabled", "true"); location.reload();\'>'+ Registry._['Continue practicing'] +'</button>';
        }

        popupContent +=         '</div>' +
                            '</div>';

        Utils.mask('practice-popup', 'div', {}, popupContent, null, null, hideXIcon);

    },
    practiceExpired: false,

    togglePromoCodeField: function() {
        var field = Ext.get('registration-promo-code-field');
        field.setVisibilityMode(Ext.Element.DISPLAY);
        var anim = {
            duration: 200,
            useDisplay: true,
            easing: 'ease'
        };

        if (field.hasCls('expanded')) {
            field.removeCls('expanded');
            field.slideOut('t', anim);
        } else {
            field.addCls('expanded');
            field.slideIn('t', anim);
//            Ext.fly('promo-code').focus(300);
        }
    }

};

var Reports = {
    filterAssetIndex: function(type) {
        Ext.fly('asset-index-filter-forex').removeCls('active');
        Ext.fly('asset-index-filter-stocks').removeCls('active');
        Ext.fly('asset-index-filter-commodities').removeCls('active');
        Ext.fly('asset-index-filter-indices').removeCls('active');
        Ext.fly('asset-index-filter-pairs').removeCls('active');

        Ext.fly('asset-index-filter-' + type).addCls('active');

        Registry.instruments.clearFilter();
        Registry.instruments.filter([{property: 'type', value: Registry.types[type]}]);

        Reports.renderAssetIndex();
    },

    renderAssetIndex: function() {
        var i;

        var tplInstrument = new Ext.XTemplate(
            '<div class="instrument" id="instrument-{instrumentID}">',
                '<div class="cf instrument-row">',
                    '<a class="instrument-name {[(values.starred) ? "starred" : ""]}" id="instrument-name-{instrumentID}" href="#" onclick="Reports.star(\'{instrumentID}\'); return false;">{name}</a>',
                    '<span class="instrument-attribute-value instrument-description">{description}</span>',
                '</div>',
                '<div class="cf instrument-row">',
                    '<span class="instrument-attribute-label">' + Registry._['asset-index-trading-hours'] + ':</span>',
                    '<span class="instrument-attribute-value">{hours}</span>',
                '</div>',
                '<div class="cf instrument-row">',
                    '<span class="instrument-attribute-label">' + Registry._['asset-index-expiry-formula'] + ':</span>',
                    '<span class="instrument-attribute-value">{expiry}</span>',
                '</div>',
            '</div>');

        var tplInstruments = new Ext.XTemplate(
            '<div id="instruments">',
            '<tpl for=".">',
                '<div class="{[(xindex == 1) ? "first" : ""]} {[(xcount == xindex) ? "last" : ""]}" id="instrument-container-{[values.data.instrumentID]}">{[this.renderInstrument(values)]}</div>',
            '</tpl>',
            '</div>',
            {
                renderInstrument: function(values) {
                    return tplInstrument.apply(values.data);
                }
            });

        for (i = 0; i < Registry.instruments.data.items.length; i++) {
            Registry.instruments.data.items[i].data.starred = Ext.Array.contains(Registry.starred, Registry.instruments.data.items[i].data.instrumentID);
        }

        tplInstruments.overwrite('asset-index-wrapper', Registry.instruments.data.items);
    },

    star: function(instrumentID) {
        var action = (Ext.Array.contains(Registry.starred, instrumentID)) ? 'unstar' : 'star';
        var instrument = Registry.instruments.getById(instrumentID);

        // Modify the registry array
        if (action == 'star') {
            Registry.starred.push(instrumentID);
            Ext.fly('instrument-name-' + instrumentID).addCls('starred');
        }
        else {
            Ext.Array.remove(Registry.starred, instrumentID);
            Ext.fly('instrument-name-' + instrumentID).removeCls('starred');
        }

        // Modify the store entry
        instrument.data.starred = (action == 'star');

        // Update server
        User.star(instrumentID, (action == 'unstar'));
    },

    renderTransactions: function(page, numOfPages) {
        var tplRow = new Ext.XTemplate(
            '<td>{recordID}</td>',
            '<td>{date}</td>',
            '<td>{description}</td>',
            '<td>{tradeID}</td>',
            '<td>{credit}</td>',
            '<td>{debit}</td>',
            '<td>{reserved}</td>',
            '<td>{walletBalance}</td>'
        );

        var tplReport = new Ext.XTemplate(
            '<table width="100%" class="report-body">',
                '<tr><th width="12.5%">' + Registry._['report-balance-history-invoice'] + ' #</th><th width="12.5%">' + Registry._['report-balance-history-date'] + ' <span style="font-weight: normal">(GMT)</span></th><th width="12.5%">' + Registry._['report-balance-history-description'] + '</th><th width="12.5%">' + Registry._['trade-info-trade-number'] + ' #</th><th width="12.5%">' + Registry._['report-balance-history-credit'] + '</th><th width="12.5%">' + Registry._['report-balance-history-debit'] + '</th><th width="12.5%">' + Registry._['report-balance-history-invested'] + '</th><th width="12.5%">' + Registry._['wallet-balance'] + '</th></tr>',
                '<tpl for=".">',
                    '<tr class="{[(xcount == xindex) ? "last" : ""]} {[(xindex % 2) ? "odd" : "even"]}">{[this.renderRow(values)]}</tr>',
                '</tpl>',
            '</table>',
            {
                renderRow: function(values) {
                    return tplRow.apply(values);
                }
            });

        var tplRowWithdrawals = new Ext.XTemplate(
            '<td>{date}</td>',
            '<td>{amount}</td>',
            '<td>{[this.renderRowMethod(values)]}</td>',
            '<td>{[this.renderRowStatus(values)]}</td>',
            '<td style="color:#ED1927">{[this.renderRowGiveUp(values)]}</td>',
            '<td><a id="rec_{recordID}" class="cancel button withdrawal-cancel-button" href="">' + Registry._['report-balance-history-cancel-withdrawal'] + '</a></td>',
            {
                renderRowStatus: function(values) {
                    var status = {
                        pending: Registry._['report-balance-history-status-pending'],
                        processing: Registry._['report-balance-history-status-processing']
                    };

                    if (values.status != "0") {
                        return status.processing;
                    }

                    return status.pending;
                },
                renderRowMethod: function(values) {
                   return Registry._['payment-option-' + values.method];
                },
                renderRowGiveUp: function(values) {
                    if (!values.giveUp) return '';

                    var bonus = values.giveUp.bonus;
                    var pnl = values.giveUp.pnl;

                    bonus += ' ' + Registry._['report-balance-history-bonus'];
                    pnl += ' ' + Registry._['report-balance-history-profit'];

                    return bonus + ', ' + pnl;
                }
            }
        );

        var tplReportWithdrawals = new Ext.XTemplate(
            '<tpl for=".">',
                '<tr class="{[(xcount == xindex) ? "last" : ""]} {[(xindex % 2) ? "odd" : "even"]}">{[this.renderRow(values)]}</tr>',
            '</tpl>',
            {
                renderRow: function(values) {
                    return tplRowWithdrawals.apply(values);
                }
            });

        if (numOfPages) {
            Utils.renderPagination(numOfPages, page, 'Reports.renderTransactions');
        }

        Ext.fly('loader').addCls('loading');

        Ext.getBody().on('click', function(event, target){
                event.preventDefault();
                User.cancelWithdrawal(event, target);
                return false;
            }, null, {
                delegate: '.withdrawal-cancel-button'
        });

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/transactions',
            params: {
                year: Registry.filter.year,
                month: Registry.filter.month,
                page: page
            },
            success: function(response) {
                response = Ext.decode(response.responseText);

                Ext.fly('loader').removeCls('loading');

                // Render summary
                var summary = response.summary;
                if (response.summary){
                    Ext.fly('summary-deposits').dom.innerHTML = summary.deposits;
                    Ext.fly('summary-profit').dom.innerHTML = summary.profit;
                    Ext.fly('summary-bonuses').dom.innerHTML = summary.bonuses;
                    Ext.fly('summary-withdrawals').dom.innerHTML = summary.withdrawals;
                }

                // Render reports
                tplReport.overwrite('transactions-report', response.rows);

                if (Registry.withdrawalEnabled) {
                    tplReportWithdrawals.overwrite('withdrawals-report-body', response.withdrawals);
                }

                // Render pagination
                if (!numOfPages) {
                    Utils.renderPagination(response.pages, page, 'Reports.renderTransactions');
                }

                Utils.scroll('top');
            },
            failure: function(response) {
                // Used when session expires
                eval(response.responseText);
            }
        });
    },

    renderTrades: function(page, numOfPages) {
        var tplRow = new Ext.XTemplate(
            '<td>{tradeID}</td>',
            '<td>{created}</td>',
            '<td>{asset}</td>',
            '<td>{[this.renderDirection(values.direction, values.type)]}&nbsp;{[this.renderStrike(values.strike, values.distance, values.direction, values.type)]}</td>',
            '<td>{[this.renderAmount(values.amount, values.userCurrency, values.userCurrencyStake, values.currency)]}</td>',
            '<td>{payout}</td>',
            '<td>{rebate}</td>',
            '<td>{expired}</td>',
            '<td>{expiry}</td>',
            '<td>{status:this.renderStatus(values.action)}</td>',
            '<td>{action}</td>',
            '<td>{[this.renderAmount(values.return, values.userCurrency, values.userCurrencyReturn, values.currency)]}</td>',
            {
                renderDirection: function(direction, type) {
                    var label;

                    if (type == 1 || type == 2 || type == 3 || type == 7) {
                        label = (direction == 1) ? Registry._['label-above'] : Registry._['label-below'];
                    }
                    else if (type == 4) {
                        label = (direction == 1) ? 'Range Up' : 'Range Down';
                    }
                    else if (type == 5) {
                        label = (direction == 1) ? 'Touch Up' : 'Touch Down';
                    }
                    else if (type == 6) {
                        label = (direction == 1) ? 'No Touch Up' : 'No Touch Down';
                    }

                    return label;
                },

                renderStrike: function(strike, distance, direction, type) {
                    var result;
                    var numberOfDigits;
                    strike = strike + '';
                    if (strike.split('.').length == 1) {
                        numberOfDigits = 0;
                    }
                    else {
                        numberOfDigits = strike.split('.')[1].length;
                    }
                    strike = strike * 1;
                    distance = distance * 1;

                    if (type == 1 || type == 2) {
                        result = strike;
                    }
                    else if (type == 3 || type == 5 || type == 6) {
                        result = (direction == 1) ? (strike + distance).toFixed(numberOfDigits) : (strike - distance).toFixed(numberOfDigits);
                    }
                    else if (type == 4) {
                        result = (direction == 1) ? (strike.toFixed(numberOfDigits) + ' - ' + (strike + distance).toFixed(numberOfDigits)) :
                                                    ((strike - distance).toFixed(numberOfDigits) + ' - ' + strike.toFixed(numberOfDigits));
                    }

                    return result;
                },

                renderStatus: function(status, action) {
                    var label;

                    if (action && action.indexOf('risk free') == -1) {
                        label = '-';
                    }
                    else {
                        switch (status) {
                            case '2': label = Registry._['at-the-money'];
                                break;
                            case '1': label = Registry._['in-the-money'];
                                break;
                            case '-1': label =  Registry._['out-the-money'];
                                break;
                            default : label = '';
                        }
                    }

                    return label;
                },

                renderAmount: function(amount, userCurrency, userCurrencyAmount, walletCurrency) {
                    if (userCurrency == walletCurrency) {
                        return Registry.baseCurrencySymbol + amount;
                    }
                    else {
                        return Registry.currenciesInfo[userCurrency].currencySymbol + userCurrencyAmount + '(' + Registry.baseCurrencySymbol + amount + ')';
                    }
                }
            });

        var tplReport = new Ext.XTemplate(
            '<table width="100%" class="report-body" style="table-layout: fixed">',
            '<tr><th width="9%">' + Registry._['trade-info-trade-number'] + ' #</th>' +
                '<th width="9%">' + Registry._['trade-info-created'] + '&nbsp;<span style="font-weight: normal">(GMT)</span></th>' +
                '<th width="9%">' + Registry._['trade-info-asset'] + '</th>' +
                '<th width="9%">' + Registry._['trade-info-strike'] + '</th>' +
                '<th width="9%">' + Registry._['trade-info-investment'] + '</th>' +
                '<th width="6%">' + Registry._['trade-info-payout'] + '</th>' +
                '<th width="6%">' + Registry._['trade-info-insurance'] + '</th>' +
                '<th width="10%">' + Registry._['trade-info-expired'] + '&nbsp;<span style="font-weight: normal">(GMT)</span></th>' +
                '<th width="9%">' + Registry._['trade-info-expiry-price'] + '</th>' +
                '<th width="60px">' + Registry._['account-settings-details-menu-status'] + '</th>' +
                '<th width="9%">' + Registry._['trade-info-action'] + '</th>',
                '<th width="11%">' + Registry._['trade-info-return'] + '</th>' +
                '</tr>',
            '<tpl for=".">',
            '<tr class="{[(xcount == xindex) ? "last" : ""]} {[(xindex % 2) ? "odd" : "even"]}">{[this.renderRow(values)]}</tr>',
            '</tpl>',
            '</table>',
            {
                renderRow: function(values) {
                    return tplRow.apply(values);
                }
            });


        if (numOfPages) {
            Utils.renderPagination(numOfPages, page, 'Reports.renderTrades');
        }

        Ext.fly('loader').addCls('loading');

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/trades',
            params: {
                year: Registry.filter.year,
                month: Registry.filter.month,
                day: Registry.filter.day,
                asset: Registry.filter.asset,
                page: page
            },
            success: function(response) {
                response = Ext.decode(response.responseText);

                Ext.fly('loader').removeCls('loading');

                // Render report
                tplReport.overwrite('trades-report', response.rows);

                if (!Ext.isEmpty(Ext.query('#trades-report tr.last'))) {
                    Ext.fly('download-report-button').removeCls('x-hidden');
                }

                // Render pagination
                if (!numOfPages) {
                    Utils.renderPagination(response.pages, page, 'Reports.renderTrades');
                }

                Utils.scroll('top');
            },
            failure: function(response) {
                // Used when session expires
                eval(response.responseText);
            }
        });
    },

    buildExpiryPricesFilter: function() {
        if (!Ext.getCmp('date-picker-widget').validate()) {
            return false;
        }

        if (!Ext.getCmp('time-picker-widget').validate()) {
            return false;
        }

        var date =  Ext.getCmp('date-picker-widget').getValue();
        var time = Ext.getCmp('time-picker-widget').getValue();
        var type = Ext.fly('expiry-prices-filter-type').getValue();
        var instrument = Ext.fly('expiry-prices-filter-instrument').getValue();

        if (type) {
            type = Registry.types[type];
        }

        if (!time) {
            time = '';
        }
        else {
            time = Ext.Date.format(time, 'H:i:00');
        }

        date = Ext.Date.format(date, 'Y-m-d');

        Registry.filter = {
            date: date,
            time: time,
            type: type,
            instrument: instrument
        }

        return true;
    },

    updateExpiryPricesFilter: function(type) {
        var i;
        var option;

        Registry.instruments.clearFilter();

        if (type) {
            Registry.instruments.filter([{property: 'type', value: Registry.types[type]}]);
        }

        Ext.fly('expiry-prices-filter-instrument').dom.options.length = 1;

        var hiddenInstruments = [57, 61, 62, 63];

        for (i = 0; i < Registry.instruments.data.items.length; i++) {
            if (hiddenInstruments.indexOf(Registry.instruments.data.items[i].data.instrumentID * 1) > -1) {
                continue;
            }

            option = new Option(Registry.instruments.data.items[i].data.name, Registry.instruments.data.items[i].data.instrumentID);

            Ext.fly('expiry-prices-filter-instrument').dom.options.add(option);
        }
    },

    renderExpiryPrices: function(page, numOfPages) {
        var tplExpiryInfo = new Ext.XTemplate(
            '<h4><b>{title}</b></h4>',
            '<p>{body}</p>'
             );

        var tplRow = new Ext.XTemplate(
            '<td>{instrumentID:this.renderInstrument}</td>',
            '<td>{expiryTime}</td>',
            '<td>{expiryPrice}</td>',
            '<td>{bid}</td>',
            '<td>{ask}</td>',
            {
                renderInstrument: function(instrumentID) {
                    return Registry.instruments.getById(instrumentID).data.name;
                }
            }
        );

        var tplReport = new Ext.XTemplate(
            '<table width="100%" class="report-body">',
                '<tr><th width="20%">' + Registry._['trade-info-asset'] + '</th><th width="20%">' + Registry._['title-expiry-time']+'<span style="font-weight: normal">(GMT)</span></th><th width="20%">'+Registry._['trade-info-expiry-price']+'<tpl if="this.displayGameInfo()"><span class="game-info-icon ask-bid-desc" tooltip-content="{[this.renderExpiryInfo(values)]}"></span></tpl></th><th width="20%">'+Registry._['trade-info-bid']+'</th><th width="20%">'+Registry._['trade-info-ask']+'</th></tr>',
                '<tpl for=".">',
                    '<tr class="{[(xcount == xindex) ? "last" : ""]} {[(xindex % 2) ? "odd" : "even"]}">{[this.renderRow(values)]}</tr>',
                '</tpl>',
            '</table>',
            {
                renderRow: function(values) {
                    return tplRow.apply(values);
                },

                renderExpiryInfo: function(values) {
                    var tooltipValues = {title: Registry._['expiry-price-title'], body : Utils.htmlEscape(Registry._['expiry-price-body'])};
                    return tplExpiryInfo.apply(tooltipValues);
                },

                displayGameInfo: function() {
                    return Registry.displayGameInfo;
                }
            });

        if (numOfPages) {
            Utils.renderPagination(numOfPages, page, 'Reports.renderExpiryPrices');
        }

        Ext.fly('loader').addCls('loading');

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/instrument/expiry-prices',
            params: {
                date: Registry.filter.date,
                time: Registry.filter.time,
                type: Registry.filter.type,
                instrumentID: Registry.filter.instrument,
                page: page
            },
            success: function(response) {
                response = Ext.decode(response.responseText);

                Ext.fly('loader').removeCls('loading');

                // Render report
                tplReport.overwrite('expiry-prices-report', response.rows);

                $('.ask-bid-desc').tooltip({
                    position: {my: "left-70 top+22", collision: "none"},
                    items: "[tooltip-content]",
                    tooltipClass: "game-tooltip report ask-bid-desc-tooltip"
                });
                // Render pagination
                if (!numOfPages) {
                    Utils.renderPagination(response.pages, page, 'Reports.renderExpiryPrices');
                }

                Utils.scroll('top');
            }
        });
    }
}

var MD5 = function(s,raw,hexcase,chrsz) {
    raw = raw || false;
    hexcase = hexcase || false;
    chrsz = chrsz || 8;

    function safe_add(x, y){
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function bit_rol(num, cnt){
        return (num << cnt) | (num >>> (32 - cnt));
    }
    function md5_cmn(q, a, b, x, s, t){
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
    }
    function md5_ff(a, b, c, d, x, s, t){
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t){
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t){
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t){
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function core_md5(x, len){
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a =  1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d =  271733878;
        for(var i = 0; i < x.length; i += 16){
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
            a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
            a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
            a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }
    function str2binl(str){
        var bin = [];
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
        }
        return bin;
    }
    function binl2str(bin){
        var str = "";
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < bin.length * 32; i += chrsz) {
            str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
        }
        return str;
    }

    function binl2hex(binarray){
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
        }
        return str;
    }
    return (raw ? binl2str(core_md5(str2binl(s), s.length * chrsz)) : binl2hex(core_md5(str2binl(s), s.length * chrsz))	);
};

var Facebook = {
    connect: function(urlBaseSecure) {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // User is connected to Facebook and has authorized the app already (in the past)
                // Now we only need to log him/her in
                var facebookAccessToken = response.authResponse.accessToken;

                window.location = urlBaseSecure + '/index/sign-in?facebookAccessToken=' + facebookAccessToken;
            }
            else if (response.status === 'not_authorized') {
                // not_authorized
                login();
            }
            else {
                // not_logged_in
                login();
            }
        });

        function login() {
            FB.login(function(response) {
                if (response.authResponse) {
                    // User is connected to Facebook and has just authorized the app
                    // Now we need to sign him/her up
                    var facebookAccessToken = response.authResponse.accessToken;

                    window.location = urlBaseSecure + '/index/sign-in?facebookAccessToken=' + facebookAccessToken;
                }
                else {
                    // cancelled
                }
            }, {scope: 'email, user_birthday'});
        }
    },

    connectRegister: function(urlBaseSecure, practiceRegistration) {
        var practiceMode = false;

        if (practiceRegistration) {
            practiceMode = $("input:radio[name=practiceMode]:checked").val() === 'true';
        }

        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // User is connected to Facebook and has authorized the app already (in the past)
                // Now we only need to log him/her in
                var facebookAccessToken = response.authResponse.accessToken;

                window.location = urlBaseSecure + '/index/sign-up?facebookAccessToken=' + facebookAccessToken + '&' + 'practiceMode=' + practiceMode;
            }
            else if (response.status === 'not_authorized') {
                // not_authorized
                login();
            }
            else {
                // not_logged_in
                login();
            }
        });

        function login() {
            FB.login(function(response) {
                if (response.authResponse) {
                    // User is connected to Facebook and has just authorized the app
                    // Now we need to sign him/her up
                    var facebookAccessToken = response.authResponse.accessToken;

                    window.location = urlBaseSecure + '/index/sign-up?facebookAccessToken=' + facebookAccessToken + '&' + 'practiceMode=' + practiceMode;
                }
                else {
                    // cancelled
                }
            }, {scope: 'email, user_birthday'});
        }
    },

    socialConnect: function(urlBaseSecure) {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // User is connected to Facebook and has authorized the app already (in the past)
                // Now we only need to log him/her in
                var facebookAccessToken = response.authResponse.accessToken;
                //var userID = (FB.getAuthResponse() || {}).userID;
                //console.log('x: ' + userID);

                setSocialDetails();
            }
            else {
                FB.login(function(response) {
                    if (response.authResponse) {
                        // User is connected to Facebook and has just authorized the app
                        // Now we need to sign him/her up
                        var facebookAccessToken = response.authResponse.accessToken;
                        //var userID = (FB.getAuthResponse() || {}).userID;
                        //console.log('y: ' + userID);

                        setSocialDetails();


                    }
                    else {

                    }
                }, {scope: 'email, user_birthday'});
            }
        });

        function setSocialDetails() {

            FB.api('/me?fields=name,id', function(response) { //username isn't supported since 2.0 API

                Ext.getDom('public-name').value = response.username;
                Ext.fly('public-name-tip').removeCls('alert');
                Ext.fly('public-name-tip').addCls('accept');
                User.validatePublicName();

                Ext.getDom('public-image-img').src = 'http://graph.facebook.com/' + response.id + '/picture';
                Ext.getDom('public-image-default-id').value = 'facebook';
                Ext.getDom('facebook-id').value = response.id;

                Ext.fly('connect-options-container').addCls('x-hidden');
                Ext.fly('public-image-gallery').addCls('x-hidden');
                Ext.fly('social-settings-container').removeCls('x-hidden');
                Ext.fly('account-social-save-button-row').removeCls('x-hidden');
            });

        }
    }
};

var VKFunctions = {
    connect: function(appID) {

        VK.Auth.login(function(response) {
            if (response.session) {
                window.open("https://oauth.vk.com/authorize?client_id=" + appID + "&scope=status&redirect_uri=" + Registry.urlBaseNonSecure + "/sign-in&response_type=code","_top","");
            }
        });
    },

    connectRegister: function(appID) {

        VK.Auth.login(function(response) {
            if (response.session) {
                window.open("https://oauth.vk.com/authorize?client_id=" + appID + "&scope=status&redirect_uri=" + Registry.urlBaseNonSecure + "/sign-up&response_type=code","_top","");
            }
        });
    },

    logout: function() {
        VK.Auth.logout(function(response) {
        });
    }
};

// StrategiX code (FinancialPanel was the initial name)
var FinancialPanel = { // Relevant Html is located in financial-panel.phtml
    instrumentID: null, // The current instrument id
    chart: null, // The Highcharts.StockChart object
    chartType: 'line', // Either area or line
    chartRange: 1, // Either 1, 2, 4 or 8 (The period of chart data to show in hours, changable from the client)
    gameType: null, // Either above_below, range, touch or no_touch
    direction: null, // (1 or -1)
    clicked: false, // true if the user clicked a game-type/direction button
    tempGameType: null, // temporary value for game type to be used if the user click a game-type/direction button
    tempDirection: null, // temporary value for direction to be used if the user click a game-type/direction button
    distances: null, // Distance per expiry per chance: Structure: FinancialPanel.distances[expiry][chance] = distance
    distance: null, // The current distance based on the expiry and chance
    distanceSlider: null, // The Ext JS distance slider
    gameTypes: { // Mapping between game type name and id
        above_below: 3,
        range: 4,
        touch: 5,
        no_touch: 6
    },
    gameTypeNames: { // Mapping between game type id and name
        3: 'above_below',
        4: 'range',
        5: 'touch',
        6: 'no_touch'
    },
    trades: {}, // User's trades information. The key is the trade id
    payout: null, // The current payout for the selected game
    activeGames: null, // Information of active games (updated by Feed.js). Structure: FinancialPanel.activeGames[instrumentID][gameType] = true
                       // Not all instrument id's or game types must be in this object. If any is missing, the specific game is not active.
    gameTypeStatuses: {}, // Information of which game type is open (based on trading hours). Structure: FinancialPanel.gameTypeStatuses[gameType] = true/false
    fixedMargin: 80, // A constant to make sure the chart background is aligned to the chart

    init: function(instrumentID) {
        // Hide everything before we have the chart data/history
        $('#fp-chart-bottom-bg').hide();
        $('#fp-chart-top-bg').hide();
        $('.control-con-item').removeClass('i-selected');
        $('#fp-upper-level').html('');
        $('#fp-market-price').html('');
        $('#fp-lower-level').html('');
        $('#fp-upper-level').hide();
        $('#fp-market-price').hide();
        $('#fp-lower-level').hide();
        $('#fp-invoice').hide();

        this.gameType = null;
        this.direction = null;
        this.clicked = false;
        this.distances = null;
        this.distance = null;
        // Disable the "Trade" button:
        $('#fp-apply').addClass('disabled');
        // No game/direction is selected, so no need to show any question:
        $('#fp-question').html('&nbsp;');
        // Initialize the distance/chance slider:
        $('#distance-slider').html('');
        this.distanceSlider = Ext.create('Ext.slider.Single', {
            renderTo: 'distance-slider',
            width: 200,
            value: 15,
            increment: 5,
            minValue: 15,
            maxValue: 35,
            useTips: false,

            listeners: {
                change: function() {
                    FinancialPanel.updatePayouts();
                    FinancialPanel.updateDistance();
                }
            }
        });

        var instrumentController = Trading.app.getController('Instrument');
        var gameController = Trading.app.getController('Game');

        // Init financial panel instrument select:
        var instrumentSelect = $('#fp-instrument-select');
        instrumentSelect.find('option').remove();

        instrumentController.instruments.each(function(instrument) {
            if (gameController.hasAdvancedGames(instrument.data.instrumentID)) {
                instrumentSelect.append($('<option>', {value: instrument.data.instrumentID, text: instrument.data.name}));
                if (instrument.data.instrumentID == instrumentID) {
                    this.addInfoTooltips(instrument.data);
                }
            }
        }, this);
        // Sort the instrument list by name:
        $('#fp-instrument-select option').sort(function(a, b){return (a.innerHTML > b.innerHTML) ? 1 : -1;}).appendTo('#fp-instrument-select');

        instrumentSelect.val(instrumentID);

        this.instrumentID = instrumentID;
        this.initLightstreamerDistancesFeed(this.instrumentID);

        this.updateExpirySelect();
        this.initChart();
        this.updatePayouts();

        var investmentOptions = [];
        var investmentOption;
        var minStake = Registry.investmentLimits.minStakeStrategic * 1;
        var maxStake = Registry.investmentLimits.maxStakeStrategic * 1;
        var i;
        var investmentOptionInUSD;
        for (i = 0; i < Registry.investmentOptions.length; i++) {
            investmentOption = Registry.investmentOptions[i] * 1;
            investmentOptionInUSD = investmentOption * gameController.getUserCurrencyInfo().conversionRate;
            if (investmentOptionInUSD >= minStake &&
                investmentOptionInUSD <= maxStake) {
                investmentOptions.push(investmentOption + '');
            }
        }

        $.combobox.instances['fp-investment-amount'].setSelectOptions(investmentOptions);

        var defaultInvestmentAmount = Registry.investmentDefaults.financialPanel;
        if (defaultInvestmentAmount * gameController.getUserCurrencyInfo().conversionRate < minStake) {
            defaultInvestmentAmount = investmentOptions[0];
        }

        $('#fp-investment-amount').val(defaultInvestmentAmount);
    },

    // Used by Game.js setGameType() to show a disabled message popup when the selected instrument is not enabled for StrategiX
    showDisabledMessage: function(instrumentID) {
        var instrumentController = Trading.app.getController('Instrument');
        var instrument = instrumentController.instruments.getById(instrumentID);
        var time = instrumentController.time;
        var opensAt = -1;

        instrument.tradingHours().each(function(gameTradingHours) {
            if (gameTradingHours.data.gameType < 3 || gameTradingHours.data.gameType > 6) {
                return;
            }
            if (FinancialPanel.isOpenInConfig(gameTradingHours.data.gameType, instrumentID)) {
                gameTradingHours.tradingHourRanges().each(function(period) {
                    if (period.data.from > time && (opensAt == -1 || period.data.from < opensAt)) {
                        opensAt = period.data.from;
                    }
                });
            }
        });

        if (opensAt == -1) {
            return;
        }

        var gameController = Trading.app.getController('Game');
        var opensAtMessage = gameController.formatOpensAt(opensAt);

        var disabledPopupContent = '<div id="fp-disabled-message">' + opensAtMessage + '</div>';

        Utils.mask('fp-disabled-popup', 'div', {}, disabledPopupContent);
    },

    // Listen only to the selected instrument distance updates:
    initLightstreamerDistancesFeed: function(instrumentID) {
        var feedController = Trading.app.getController('Feed');

        var distancesSubscription = feedController.getDistancesSubscription([instrumentID]);
        if (distancesSubscription.isSubscribed()){
            feedController.lsClient.unsubscribe(feedController.getDistancesSubscription([instrumentID]));
        }
        this.distance = null;
        $('#fp-apply').addClass('disabled');
        feedController.lsClient.subscribe(feedController.getDistancesSubscription([instrumentID]));
    },

    // Called by financial-panel.phtml $('#trade-box-adv-close-button').click when the user closes the StrategiX window:
    stopLightstreamerDistancesFeed: function() {
        var feedController = Trading.app.getController('Feed');

        var distancesSubscription = feedController.getDistancesSubscription([]);
        if (distancesSubscription.isSubscribed()){
            feedController.lsClient.unsubscribe(feedController.getDistancesSubscription([]));
        }
    },

    // Called by Feed.js handleDistances() when new distances updates received:
    updateDistances: function(itemName, distances) {
        if (itemName != 'distance_' + this.instrumentID) {
            return;
        }

        distances = JSON.parse(distances);
        var fixedDistances = {};

        Object.keys(distances).forEach(function(expiry){
            var fixedExpiry = Math.floor(expiry / 1000) * 1000;
            fixedDistances[fixedExpiry] = distances[expiry];
        });

        this.distances = fixedDistances;

        this.updateDistance();
    },

    // Update the distance on chart (this.colorBackground();) and enable/diabled game-types baed on the distance (whether it's valid or not)
    updateDistance: function() {
        if (this.distances == null) {
            return;
        }

        var expirySelect = $('#fp-expiry-select');
        var expiry = expirySelect.val();
        if (expiry == null) {
            return;
        }

        var chance = this.getChance();

        if (typeof(this.distances[expiry]) == 'undefined' || typeof(this.distances[expiry][chance]) == 'undefined') {
            return;
        }

        this.distance = this.distances[expiry][chance];
        $('#fp-apply').removeClass('disabled');

        this.colorBackground();
        this.updateInvoice();

        var distanceLimit;
        var marketPrice = $('#fp-market-price').html();
        if (!marketPrice) {
            return;
        }
        var isValidDistance;
        var gameControl;
        Object.keys(Registry.financialPanelDistanceLimits).forEach(function(gameType){
            if (!FinancialPanel.gameTypeStatuses[gameType]) {
                return;
            }

            distanceLimit = Registry.financialPanelDistanceLimits[gameType];
            isValidDistance = true;
            if ('min' in distanceLimit) {
                //console.log(gameType + ' min:' + FinancialPanel.distance + ' > ' + distanceLimit.min * marketPrice);
                if (FinancialPanel.distance <= distanceLimit.min * marketPrice) {
                    isValidDistance = false;
                }
            }
            if ('max' in distanceLimit) {
                //console.log(gameType + ' max:' + FinancialPanel.distance + ' < ' + distanceLimit.max * marketPrice);
                if (FinancialPanel.distance >= distanceLimit.max * marketPrice) {
                    isValidDistance = false;
                }
            }

            gameControl = $('#control-con-item-' + gameType);

            if (isValidDistance) {
                gameControl.removeClass('disabled');
            }
            else {
                gameControl.addClass('disabled');
                if (FinancialPanel.gameTypes[FinancialPanel.gameType] == gameType) {
                    FinancialPanel.closeTradeInvoice();
                }
            }
        });

        this.updateTouchOptionStatus();
    },

    getChance: function() {
        // We use the reverse value, from 35 (leftmost option on slider) to 15 (rightmost option on slider):
        var chance = 50 - this.distanceSlider.getValue();

        return chance;
    },

    // Update the payout for each game type based on the chance/distance:
    updatePayouts: function() {
        var chance = this.getChance();

        var instrumentController = Trading.app.getController('Instrument');
        var instrument = instrumentController.instruments.getById(this.instrumentID);

        var gameTypeID;
        var payoutElement;

        instrument.payouts().each(function (gamePayouts) {
            gameTypeID = gamePayouts.data.gameType;
            if (gameTypeID < 3 || gameTypeID > 6) {
                return;
            }

            payoutElement = $('#control-con-item-' + gameTypeID + ' .c-val');

            gamePayouts.payoutRanges().each(function(payoutRange) {
                if (payoutRange.data.chance == chance) {
                    payoutElement.html(payoutRange.data.payout + '%');
                }
            });
        });
    },

    // Update the invoice based on the game type, direction, payout, market price and upper/lower levels:
    updateInvoice: function() {
        $('#fp-invoice-expiry').html($('#fp-expiry-select option:selected').text());
        var action = '';

        var marketPrice = $('#fp-market-price').html();
        var upperLevel = $('#fp-upper-level').html();
        var lowerLevel = $('#fp-lower-level').html();

        if (this.distance != null && this.direction != null && marketPrice && upperLevel && lowerLevel) {

            if (this.gameType == 'above_below') {
                if (this.direction == 1) {
                    action = Registry._['financial-panel-button-above'] + ' ' + upperLevel;
                }
                else {
                    action = Registry._['financial-panel-button-below'] + ' ' + lowerLevel;
                }
            }
            else if (this.gameType == 'range') {
                if (this.direction == 1) {
                    action = Registry._['financial-panel-button-range-up'] + ' ' + marketPrice + ' - ' + upperLevel;
                }
                else {
                    action = Registry._['financial-panel-button-range-down'] + ' ' + lowerLevel + ' - ' + marketPrice;
                }
            }
            else if (this.gameType == 'touch') {
                if (this.direction == 1) {
                    action = Registry._['financial-panel-button-touch-up'] + ' ' + upperLevel;
                }
                else {
                    action = Registry._['financial-panel-button-touch-down'] + ' ' + lowerLevel;
                }
            }
            else if (this.gameType == 'no_touch') {
                if (this.direction == 1) {
                    action = Registry._['financial-panel-button-no-touch-up'] + ' ' + upperLevel;
                }
                else {
                    action = Registry._['financial-panel-button-no-touch-down'] + ' ' + lowerLevel;
                }
            }
        }

        $('#fp-invoice-action').html(action);

        if (this.gameType) this.payout = $('#control-con-item-' + this.gameTypes[this.gameType] + ' .c-val').html().replace('%', '') * 1;
        $('#fp-invoice-payout').html(this.payout + '%');
    },

    // Called by financial-panel.phtml fp-instrument-select when the users select an instrument from the dropdown list
    selectInstrument: function() {
        var instrumentSelect = $('#fp-instrument-select');
        this.instrumentID = instrumentSelect.val();
        this.initLightstreamerDistancesFeed(this.instrumentID);
        this.updateExpirySelect();

        $('#fp-chart-bottom-bg').hide();
        $('#fp-chart-top-bg').hide();
        $('.control-con-item').removeClass('i-selected');
        $('#fp-upper-level').html('');
        $('#fp-market-price').html('');
        $('#fp-lower-level').html('');
        $('#fp-upper-level').hide();
        $('#fp-market-price').hide();
        $('#fp-lower-level').hide();
        $('#fp-invoice').hide();

        this.gameType = null;
        this.direction = null;
        this.clicked = false;
        this.distances = null;
        this.distance = null;
        $('#fp-apply').addClass('disabled');
        $('#fp-question').html('&nbsp;');

        this.initChart();
        this.updatePayouts();
        this.updateInfoTooltips();
    },

    // Called on init, instrument change and every minute by Game.js setTime()
    updateExpirySelect: function() {
        var gameController = Trading.app.getController('Game');
        var instrumentController = Trading.app.getController('Instrument');
        var instrument = instrumentController.instruments.getById(this.instrumentID);
        if (instrument == null) {
            return;
        }

        var time = gameController.time;
        var quarter = (15 * 60000);
        var deadPeriod = (10 * 60000);
        var timestampBase = time - (time % quarter);

        // If the coming expiry is not tradable (last 10 minutes), jump to the next one
        if ((timestampBase + quarter - time) < deadPeriod) {
            timestampBase += quarter;
        }

        var isOpen;
        var expiry;
        var expiries = [];
        var i;
        // Add only expiries within the trading hours:
        for (i = 1; i <= 4; i++) {
            expiry = timestampBase + i * quarter;
            isOpen = false;
            instrument.tradingHours().each(function(gameTradingHours) {
                if (gameTradingHours.data.gameType < 3 || gameTradingHours.data.gameType > 6) {
                    return;
                }
                gameTradingHours.tradingHourRanges().each(function(period) {
                    if (expiry > period.data.from && expiry <= period.data.to && time > period.data.from) {
                        isOpen = true;
                    }
                });
            });

            if (isOpen) {
                expiries.push(expiry);
            }
        }

        var expirySelect = $('#fp-expiry-select');
        var previousSelectedValue = expirySelect.val();
        expirySelect.find('option').remove();

        for (i = 0; i < expiries.length; i++) {
            expiry = expiries[i];
            expirySelect.append($('<option>', {value: expiry, text: gameController.formatExpiry(expiry)}));
        }

        if (expirySelect.find('option[value="' + previousSelectedValue + '"]').length !== 0) {
            expirySelect.val(previousSelectedValue);
        }

        this.selectExpiry();
    },

    // Called by financial-panel.phtml fp-expiry-select when selectign an expiry from dropdown list:
    selectExpiry: function() {
        var gameController = Trading.app.getController('Game');
        var instrumentController = Trading.app.getController('Instrument');
        var instrument = instrumentController.instruments.getById(this.instrumentID);
        var time = gameController.time;

        var expirySelect = $('#fp-expiry-select');
        var expiry = expirySelect.val();

        // Decide whether to show or hide the closing progress bar
        var deadPeriod = ((expiry - time) <= 120000) ? 60000 : (10 * 60000);
        var closing = expiry - deadPeriod;
        var from = closing - 60 * 60000;

        if (time >= from && time < closing) {
            // Unsubscribe and then re-subscribe
            if (this.progressUpdates) {
                delete this.progressUpdates;
            }

            // Init progress bar
            $('#fp-progress-bar-text-top').html('');
            $('#fp-progress-bar-text-bottom').html('');
            $('#fp-progress-bar-value').css('width', 0);

            // Show progress bar
            $('#fp-closing-progress-bar-container').show();
            $('#fp-time-to-trade-label').show();

            // Subscribe for updates
            this.progressUpdates = {
                from: from,
                to: closing
            }

            // Show the progress bar's value immediately
            this.updateProgress();
        }
        else {
            // Hide progress bar
            $('#fp-closing-progress-bar-container').hide();
            $('#fp-time-to-trade-label').hide();

            // Unsubscribe from getting updates
            delete this.progressUpdates;
        }

        var isOpen;
        var gameControl;
        $('.control-con-item').addClass('disabled');

        instrument.tradingHours().each(function(gameTradingHours) {
            if (gameTradingHours.data.gameType < 3 || gameTradingHours.data.gameType > 6) {
                return;
            }
            isOpen = false;
            if (FinancialPanel.isOpenInConfig(gameTradingHours.data.gameType)) {
                gameTradingHours.tradingHourRanges().each(function(period) {
                    if (expiry > period.data.from && expiry <= period.data.to && time > period.data.from) {
                        isOpen = true;
                    }
                });
            }

            FinancialPanel.gameTypeStatuses[gameTradingHours.data.gameType] = isOpen;

            gameControl = $('#control-con-item-' + gameTradingHours.data.gameType);

            if (isOpen) {
                gameControl.removeClass('disabled');
            }
            else {
                gameControl.addClass('disabled');
                if (FinancialPanel.gameTypes[FinancialPanel.gameType] == gameTradingHours.data.gameType) {
                    FinancialPanel.closeTradeInvoice();
                }
            }
        });

        this.updateDistance();
    },

    // Enable/Disable Touch Option (game type 5) based on expiry selected:
    updateTouchOptionStatus: function() {
        var expirySelect = $('#fp-expiry-select');
        var expiry = expirySelect.val();
        var i;
        var expiryOptions = $('#fp-expiry-select > option');
        var expiryIndex;
        for (i = 0; i < expiryOptions.length; i++) {
            if (expiryOptions[i].value == expiry) {
                expiryIndex = i;
                break;
            }
        }

        var chance = this.getChance();
        var touchGameControl = $('#control-con-item-5');

        if (expiryIndex <= 1 && !touchGameControl.hasClass('disabled')) {
            touchGameControl.removeClass('disabled');
        }
        else {
            touchGameControl.addClass('disabled');
            this.closeTradeInvoice();
        }
    },

    // Update progress bar:
    updateProgress: function() {
        if (typeof(this.progressUpdates) == 'undefined') {
            return;
        }

        var gameController = Trading.app.getController('Game');
        var time = gameController.time;

        var from;
        var to;
        var timeLeft;
        var timeElapsed;
        var width;
        var period;
        var containerWidth = 148;
        var timeLeftFormatted;
        var minutes;
        var seconds;

        from = this.progressUpdates['from'];
        to = this.progressUpdates['to'];
        period = to - from;

        if (time >= from && time < to) {
            timeElapsed = (time - from);
            timeLeft = (to - time) + 1000;

            width = Math.ceil(timeElapsed * containerWidth / period);

            timeLeft = Math.floor(timeLeft / 1000);

            minutes = Math.floor(timeLeft / 60);
            seconds = timeLeft % 60;

            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;

            timeLeftFormatted = minutes + ':' + seconds;

            $('#fp-progress-bar-text-top').html(timeLeftFormatted);
            $('#fp-progress-bar-text-bottom').html(timeLeftFormatted);
            $('#fp-progress-bar-value').css('width', width + 'px');
        }
        else {
            if (this.time >= to) {
                // Unsubscribe game
                delete this.progressUpdates;
            }
        }
    },

    // Get chart history using ajax and draw the chart:
    initChart: function() {
        var instrumentID = this.instrumentID;

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/instrument/history',
			method: 'GET',
            params: {instruments: Ext.encode([instrumentID]), period: FinancialPanel.chartRange, pairArray: 1},
            success: function(response) {
                response = Ext.decode(response.responseText);

                //console.log(response[instrumentID].length);

                FinancialPanel.drawChart(response[instrumentID]);
                FinancialPanel.startChartUpdater();
            }
        });
    },

    getChartDrawingOptions: function() {
        var response;

        if (this.chartType == 'area') {
            response = {seriesType: 'area', lineColor: Registry.chartConfig.financialPanel.colors.areaLine};
        }
        else {
            response = {seriesType: 'line', lineColor: Registry.chartConfig.financialPanel.colors.line};
        }

        return response;
    },

    updateChartType: function() {
        this.chartType = $('#fp-chart-type-select').val();
        this.initChart();
    },

    updateChartRange: function(chartRange) {
        if (this.chartRange == chartRange) {
            return;
        }

        $('#fp-chart-range-select>li').removeClass('active');
        $('#fp-chart-range-option-' + chartRange).addClass('active');

        this.chartRange = chartRange;
        this.initChart();
    },
    convertIntegerToCorrectRate: function( symbol, val  )
    {
      if( symbol == "USUSDJPY")
      {
        return val/100;
      }else{
        return val/10000;
      }
    },
    drawChart: function(wrapperID, symbol, chartData) {
        var dateHelper = new Date();
        //var wrapperID = 'fp-chart-wrapper';
        var data = [];
        var i;

        var rawDtata = chartData.sort();

        for (var i = 0; i < rawDtata.length; i += 1) {
          data.push([
            (new Date( parseInt(rawDtata[i]) )).getTime(),
            this.convertIntegerToCorrectRate( symbol, parseInt(rawDtata[i].split('_')[1]))
          ]);
        }

        var chartDrawingOptions = this.getChartDrawingOptions();
        var seriesType = chartDrawingOptions.seriesType;
        var lineColor = chartDrawingOptions.lineColor;

        var fillColor = {
                            linearGradient : {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops : [[0, Registry.chartConfig.financialPanel.colors.fillColor.top],
                                     [1, Registry.chartConfig.financialPanel.colors.fillColor.bottom]]
                        };

        var labelStyle = Registry.chartConfig.financialPanel.colors.axisLabel ? {color: Registry.chartConfig.financialPanel.colors.axisLabel} : {};

        var chart = new Highcharts.StockChart({
            xAxis: {
                gridLineWidth: 1,
                gridLineColor: Registry.chartConfig.financialPanel.colors.axisgrid,
                lineColor: Registry.chartConfig.financialPanel.colors.axis,
                tickLength: 0,
                ordinal: false,
                labels: {
                    formatter: function() {
                        dateHelper.setTime(this.value);

                        var format = 'H:i';
                        var data = this.axis.series[0].data;

                        // If we don't have much data, show seconds in labels (it happens when the insturment just enters its trading hours)
                        if (data.length && (data[data.length - 1].x - data[0].x < (5 * 60000))) {
                            format = 'H:i:s';
                        }

                        return Ext.Date.format(dateHelper, format);
                    },
                    style: labelStyle
                }
            },
            yAxis: {
                id: 'fp-chart-y-axis',
                gridLineColor: Registry.chartConfig.financialPanel.colors.axisgrid,
                labels: {
                    style: labelStyle
                }
            },
            chart: {
                renderTo: wrapperID,
                plotBorderWidth: 1,
                plotBorderColor: Registry.chartConfig.financialPanel.colors.plotBorder,
                backgroundColor: 'rgba(255,255,255,0)',
                plotBackgroundColor: Registry.chartConfig.financialPanel.colors.plotBackgroundColor
            },
            rangeSelector: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                id: 'fp-chart-series',
                name: 'Price',
                data: data,
                type: seriesType,
                threshold : null,
                fillColor: fillColor
            }],
            plotOptions: {
                line: {
                    lineWidth: 1,
                    color: '#000',
                    dataGrouping: {
                        enabled: false
                    },
                    allowPointSelect: false,
                    marker: {
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    events: {
                        click: function(event) {
                        }
                    }
                },
                area: {
                    lineWidth: 1,
                    color: '#000',
                    dataGrouping: {
                        enabled: false
                    },
                    allowPointSelect: false,
                    marker: {
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    events: {
                        click: function(event) {
                        }
                    }
                },
                series: {
                    color: lineColor,
                    lineWidth: Registry.chartConfig.financialPanel.lineWidth,
                    states: {
                        hover: {
                            lineWidth: Registry.chartConfig.financialPanel.lineWidth
                        }
                    }
                }
            },
            tooltip: {
                headerFormat: '<span>{point.key}</span><br/>',
                xDateFormat: '%H:%M:%S',
                pointFormat: '<span>{point.y}</span>',
                borderWidth: 1,
                crosshairs: [{color: Registry.chartConfig.colors.guide, dashStyle: 'longdash'}],
                formatter: function() {
                    var point = this.points[0].point;
                    var tip = '<span>' + Ext.Date.format(new Date(point.x), 'H:i:s') + '</span><br/><span>' + point.y + '</span>';

                    if (point.marker && point.marker.keep) {
                        var direction = (point.tooltipData.direction == 1) ? Registry._['label-above'] : Registry._['label-below'];

                        tip = '<span class="tooltip-label">' + Registry._['game-label-expiry'] + ':</span><span> ' + Ext.Date.format(new Date(point.tooltipData.expiry), 'H:i:s') + '</span><br/>' +
                              '<span class="tooltip-label">' + direction + ' ' + point.y + '</span><br/>' +
                              '<span class="tooltip-label">' + Registry._['trade-info-investment'] + ':</span><span> $' + point.tooltipData.stake + '</span><br/>' +
                              '<span class="tooltip-label">' + Registry._['trade-info-payout'] + ':</span><span> ' + point.tooltipData.payout + '%</span><br/>' +
                              '<span class="tooltip-label">' + Registry._['label-rebate'] + ':</span><span> ' + point.tooltipData.rebate + '%</span>';

                        tip += Ext.isEmpty(point.tooltipData.returnedAmount) ? '' : '<br/><span class="tooltip-label">' + Registry._['label-return-amount'] + ':</span><span> $' + point.tooltipData.returnedAmount + '</span>';

                        if (point.tooltipData.social) {
                            var userID = point.tooltipData.social.userID;
                            var publicImage = Registry.socialImageUrlPattern.replace('[[[userID]]]', userID) + '?v=' + Math.floor(new Date().getTime() / 10000);
                            var nickname = point.tooltipData.social.nickname;
                            var directionArrowSrc = (point.tooltipData.direction == 1) ? 'images/small-green-arrow-up-10x11.png' : 'images/small-red-arrow-down-10x11.png';
                            direction = (point.tooltipData.direction == 1) ? Registry._['short-text-call'] : Registry._['short-text-put'];

                            var status = Ext.isEmpty(point.tooltipData.returnedAmount) ? Registry._['short-text-opened'] : Registry._['short-text-closed'];
                            var gain = Ext.isEmpty(point.tooltipData.returnedAmount) ? '' : '<br/><span class="tooltip-gain">' + Registry._['short-text-gain'] + ': $' + point.tooltipData.returnedAmount + '</span>';

                            tip = '<div id="tooltip-social-container">' +
                                    '<div class="social-user-img-container">' +
                                        '<img class="social-user-img" src="'+publicImage+'" />' +
                                        '<img class="social-user-arrow-img" src="'+directionArrowSrc+'">&nbsp;</img>' +
                                    '</div>' +
                                    '<div class="advanced-social-trade-info">' +
                                        '<span class="tooltip-nickname">' + nickname + ((Registry.env == 'development') ? ' ('+point.tooltipData.tradeID+') ' : '') +'</span><br/>' +
                                        '<span class="tooltip-status">' + status + ' ' + Registry._['short-text-a-binary'] + ' ' + direction + ' ' + Registry._['short-text-option'] + '</span>' +
                                        gain +
                                    '</div>' +
                                '</div>';
                        }
                    }

                    return '<div class="tooltip-container">' + tip + '</div>';
                },
                useHTML: true
            }
        });

        FinancialPanel.chart = chart;

        chartData = null;
        data = null;
        chart = null;
    },

    // Called by Instrument.js update() when a new quote/price arrives
    // Update the chart/upper and lower levels with the new quote
    quote: function(instrumentID, last, timestamp, trend) {
        if (instrumentID != this.instrumentID || this.chart == null) {
            return;
        }

        var seriesID = 'fp-chart-series';
        var series = this.chart.get(seriesID);

        if (series.data.length == 0) {
            return;
        }

        last = last * 1;

        $('#fp-market-price').html(last.toFixed(this.getPrecision(this.instrumentID)));
        if (this.distance != null) {
            var distance = this.distance;

            $('#fp-upper-level').html((last + distance).toFixed(this.getPrecision(this.instrumentID)));
            $('#fp-lower-level').html((last - distance).toFixed(this.getPrecision(this.instrumentID)));
            $('#fp-upper-level').show();
            $('#fp-lower-level').show();
        }
        $('#fp-market-price').show();
        this.moveChartIndicators();

        if (series && (timestamp - series.data[series.data.length - 1].x < Registry.chartUpdateFrequency)) {
            return;
        }

        var trendColor = Registry.chartConfig.colors.line;
        if (trend == 1) {
            trendColor = Registry.chartConfig.colors.up;
        }
        else if (trend == -1) {
            trendColor = Registry.chartConfig.colors.down;
        }

        var point = {
            x: timestamp,
            y: last,
            marker: {
                enabled: true,
                fillColor: trendColor,
                lineColor: Registry.chartConfig.colors.guide,
                lineWidth: 1,
                keep: false
            }
        };

        if (series.data.length) {
            if (!series.data[series.data.length - 1].marker.keep) {
                series.data[series.data.length - 1].update(point);
            }
            else {
                if (timestamp > series.data[series.data.length - 1].x) {
                    series.addPoint(point);
                }
            }
        }
        else {
            series.addPoint(point);
        }

        this.colorBackground();
        this.updateInvoice();
        // Draw the guide line
        this.chart.get('fp-chart-y-axis').removePlotLine('fp-chart-guide');
        this.chart.get('fp-chart-y-axis').addPlotLine({id: 'fp-chart-guide', value: last, color: '#000', width: 1, dashStyle : 'longdash'});

        //update ask bid
    },

    // Update the chart evert 15 seconds even if we don't get a quote:
    startChartUpdater: function() {
        var interval = 15000;

        // Start chart updater
        if (Registry.fpChartUpdater) {
            Ext.TaskManager.stop(Registry.fpChartUpdater);
        }
        else {
            Registry.fpChartUpdater = {
                run: function() {
                    var gameController = Trading.app.getController('Game');
                    var instrumentID = FinancialPanel.instrumentID;
                    if (instrumentID == null || FinancialPanel.chart == null) {
                        return;
                    }
                    var seriesID = 'fp-chart-series';
                    var series = FinancialPanel.chart.get(seriesID);
                    var value;

                    if (series.data.length == 0) {
                        return;
                    }
                    value = series.data[series.data.length - 1].y;

                    if (value > 0) {
                        var point;
                        var shift;

                        if (series.data.length) {
                            point = series.data[series.data.length - 1];

                            if (point.marker && !point.marker.keep) {
                                // Remove marker from the last point
                                point.marker = {enabled: false};
                                series.data[series.data.length - 1].update(point);
                            }

                            // Push a new point at the most right (and shift if needed)
                            point = {
                                x: gameController.time,
                                y: value * 1,
                                marker: {
                                    enabled: true,
                                    fillColor: Registry.chartConfig.colors.line,
                                    lineColor: Registry.chartConfig.colors.guide,
                                    lineWidth: 1,
                                    keep: false
                                }
                            };

                            shift = ((gameController.time - series.data[0].x) > 3600000 * FinancialPanel.chartRange);
                            series.addPoint(point, true, shift);
                            FinancialPanel.colorBackground();
                            FinancialPanel.updateInvoice();
                        }
                    }
                },
                interval: interval
            }
        }

        // Start updating charts every fixed interval (delay the task, to let the page render)
        var task = new Ext.util.DelayedTask(function() {
            Ext.TaskManager.start(Registry.fpChartUpdater);
        });

        task.delay(2000);
    },

    // Color the chart based on the game-type and direction selected
    colorBackground: function() {
        var chart = this.chart;
        if (chart == null) {
            return;
        }
        var seriesID = 'fp-chart-series';
        var series = chart.get(seriesID);
        var distance;
        var distanceInPixels;
        var i;
        var minSeriesValue, maxSeriesValue;
        var seriesValue;

        if (series.data[series.data.length - 1] && this.distance != null) {
            distance = this.distance;

            minSeriesValue = series.data[0].y;
            maxSeriesValue = series.data[0].y;

            for (i = 1; i < series.data.length; i++) {
                seriesValue = series.data[i].y;
                if (seriesValue < minSeriesValue) {
                    minSeriesValue = seriesValue;
                }
                if (seriesValue > maxSeriesValue) {
                    maxSeriesValue = seriesValue;
                }
            }

            var currentPrice = series.data[series.data.length - 1].y;

            if (currentPrice - distance < minSeriesValue) {
                minSeriesValue = series.data[series.data.length - 1].y - 1.1 * distance;
            }
            if (currentPrice + distance > maxSeriesValue) {
                maxSeriesValue = series.data[series.data.length - 1].y + 1.1 * distance;
            }
            chart.axes[1].setExtremes(minSeriesValue, maxSeriesValue);


//            if (series.data[series.data.length - 1].y - distance < chart.axes[1].min) {
//                chart.axes[1].setExtremes(series.data[series.data.length - 1].y - distance * 2, null);
//            }
//            if (series.data[series.data.length - 1].y + distance > chart.axes[1].max) {
//                chart.axes[1].setExtremes(null, series.data[series.data.length - 1].y + distance * 2);
//            }

            $('#fp-upper-level').html((currentPrice + distance).toFixed(this.getPrecision(this.instrumentID)));
            $('#fp-lower-level').html((currentPrice - distance).toFixed(this.getPrecision(this.instrumentID)));
            this.moveChartIndicators();

            distanceInPixels = distance / (chart.axes[1].max - chart.axes[1].min) * chart.plotHeight;

            var pxBottom = (series.data[series.data.length - 1].y - chart.axes[1].min) / (chart.axes[1].max - chart.axes[1].min) * chart.plotHeight;
            var pxTop;
            var marginBottom;
            var marginTop;
            var fixedMargin = this.fixedMargin;
            var secondBorderWidth = 5;
            var borderWidth = 3;

            if (this.gameType == 'above_below' || this.gameType == null || this.direction == null) {
                pxTop = chart.plotHeight - pxBottom;
                marginBottom = chart.plotTop + fixedMargin + pxTop + distanceInPixels - borderWidth;
                marginTop = chart.plotTop + fixedMargin;

                pxBottom -= distanceInPixels - borderWidth;
                pxTop -= distanceInPixels - borderWidth;
            }
            else if (this.gameType == 'range') {
                marginBottom = chart.plotTop + chart.plotHeight - pxBottom + fixedMargin;
                marginTop = chart.plotTop + chart.plotHeight - pxBottom - distanceInPixels + fixedMargin;
                pxBottom = distanceInPixels;
                pxTop = distanceInPixels;
            }
            else if (this.gameType == 'touch') {
                marginBottom = chart.plotTop + chart.plotHeight - pxBottom + distanceInPixels + fixedMargin - borderWidth;
                marginTop = chart.plotTop + chart.plotHeight - pxBottom - distanceInPixels - secondBorderWidth + fixedMargin + borderWidth;
                pxBottom = secondBorderWidth;
                pxTop = secondBorderWidth;
            }
            else if (this.gameType == 'no_touch') {
                marginBottom = chart.plotTop + chart.plotHeight - pxBottom + distanceInPixels - secondBorderWidth + fixedMargin;
                marginTop = chart.plotTop + chart.plotHeight - pxBottom - distanceInPixels + fixedMargin;
                pxBottom = secondBorderWidth;
                pxTop = secondBorderWidth;
            }

            $('#fp-chart-bottom-bg').css('height', pxBottom + 'px');
            $('#fp-chart-bottom-bg').css('top', marginBottom + 'px');
            $('#fp-chart-top-bg').css('height', pxTop + 'px');
            $('#fp-chart-top-bg').css('top', marginTop + 'px');
            $('#fp-chart-bottom-bg').show();
            $('#fp-chart-top-bg').show();

            if (this.gameType == null || this.direction == null) {
                $('#fp-chart-bottom-bg').removeClass('background');
                $('#fp-chart-bottom-bg').removeClass('border-bottom');
                $('#fp-chart-bottom-bg').addClass('border-top');

                $('#fp-chart-top-bg').removeClass('background');
                $('#fp-chart-top-bg').removeClass('border-top');
                $('#fp-chart-top-bg').addClass('border-bottom');
            }
            else if (this.gameType == 'above_below') {
                if (this.direction == 1) {
                    $('#fp-chart-bottom-bg').removeClass('background');
                    $('#fp-chart-bottom-bg').removeClass('border-bottom');
                    $('#fp-chart-bottom-bg').removeClass('border-top');

                    $('#fp-chart-top-bg').addClass('background');
                    $('#fp-chart-top-bg').removeClass('border-top');
                    $('#fp-chart-top-bg').addClass('border-bottom');
                }
                else {
                    $('#fp-chart-bottom-bg').addClass('background');
                    $('#fp-chart-bottom-bg').removeClass('border-bottom');
                    $('#fp-chart-bottom-bg').addClass('border-top');

                    $('#fp-chart-top-bg').removeClass('background');
                    $('#fp-chart-top-bg').removeClass('border-top');
                    $('#fp-chart-top-bg').removeClass('border-bottom');
                }
            }
            else if (this.gameType == 'range') {
                if (this.direction == 1) {
                    $('#fp-chart-bottom-bg').removeClass('background');
                    $('#fp-chart-bottom-bg').removeClass('border-bottom');
                    $('#fp-chart-bottom-bg').removeClass('border-top');

                    $('#fp-chart-top-bg').addClass('background');
                    $('#fp-chart-top-bg').addClass('border-top');
                    $('#fp-chart-top-bg').removeClass('border-bottom');
                }
                else {
                    $('#fp-chart-bottom-bg').addClass('background');
                    $('#fp-chart-bottom-bg').addClass('border-bottom');
                    $('#fp-chart-bottom-bg').removeClass('border-top');

                    $('#fp-chart-top-bg').removeClass('background');
                    $('#fp-chart-top-bg').removeClass('border-top');
                    $('#fp-chart-top-bg').removeClass('border-bottom');
                }
            }
            else if (this.gameType == 'touch') {
                if (this.direction == 1) {
                    $('#fp-chart-bottom-bg').removeClass('background');
                    $('#fp-chart-bottom-bg').removeClass('border-bottom');
                    $('#fp-chart-bottom-bg').removeClass('border-top');

                    $('#fp-chart-top-bg').addClass('background');
                    $('#fp-chart-top-bg').removeClass('border-top');
                    $('#fp-chart-top-bg').addClass('border-bottom');
                }
                else {
                    $('#fp-chart-bottom-bg').addClass('background');
                    $('#fp-chart-bottom-bg').removeClass('border-bottom');
                    $('#fp-chart-bottom-bg').addClass('border-top');

                    $('#fp-chart-top-bg').removeClass('background');
                    $('#fp-chart-top-bg').removeClass('border-top');
                    $('#fp-chart-top-bg').removeClass('border-bottom');
                }
            }
            else if (this.gameType == 'no_touch') {
                if (this.direction == 1) {
                    $('#fp-chart-bottom-bg').removeClass('background');
                    $('#fp-chart-bottom-bg').removeClass('border-bottom');
                    $('#fp-chart-bottom-bg').removeClass('border-top');

                    $('#fp-chart-top-bg').addClass('background');
                    $('#fp-chart-top-bg').addClass('border-top');
                    $('#fp-chart-top-bg').removeClass('border-bottom');
                }
                else {
                    $('#fp-chart-bottom-bg').addClass('background');
                    $('#fp-chart-bottom-bg').addClass('border-bottom');
                    $('#fp-chart-bottom-bg').removeClass('border-top');

                    $('#fp-chart-top-bg').removeClass('background');
                    $('#fp-chart-top-bg').removeClass('border-top');
                    $('#fp-chart-top-bg').removeClass('border-bottom');
                }
            }
        }
        else {
            $('#fp-chart-bottom-bg').removeClass('background');
            $('#fp-chart-bottom-bg').removeClass('border-bottom');
            $('#fp-chart-bottom-bg').removeClass('border-top');

            $('#fp-chart-top-bg').removeClass('background');
            $('#fp-chart-top-bg').removeClass('border-top');
            $('#fp-chart-top-bg').removeClass('border-bottom');
        }
    },

    // Move the chart indicators based on the market price and distance:
    moveChartIndicators: function() {
        var chart = this.chart;
        if (chart == null) {
            return;
        }
        var seriesID = 'fp-chart-series';
        var series = chart.get(seriesID);

        if (!series.data[series.data.length - 1]) {
            return;
        }

        var pxBottom = (series.data[series.data.length - 1].y - chart.axes[1].min) / (chart.axes[1].max - chart.axes[1].min) * chart.plotHeight;
        var marketPriceTop = chart.plotTop + chart.plotHeight - pxBottom + this.fixedMargin;
        $('#fp-market-price').css('top', marketPriceTop + 'px');

        if (this.distance == null) {
            return;
        }

        var distance = this.distance;

        var distanceInPixels = distance / (chart.axes[1].max - chart.axes[1].min) * chart.plotHeight;
        if (distanceInPixels < 16) {
            distanceInPixels = 16;
        }

        $('#fp-upper-level').css('top', (marketPriceTop - distanceInPixels) + 'px');
        $('#fp-lower-level').css('top', (marketPriceTop + distanceInPixels) + 'px');
    },

    // Triggered when the mouse is over a game button
    selectGame: function(gameType, direction) {
        // Save the button details for potential future click:
        this.tempGameType = gameType;
        this.tempDirection = direction;

        // Don't change anything in case a button is already clicked:
        if (this.clicked) {
            return;
        }

        this.gameType = gameType;
        this.direction = direction;

        this.colorBackground();
    },

    // Update the invoce action icon based on the game-type and direction
    updateInvoiceActionIcon: function() {
        var gameType = this.gameTypes[this.gameType];
        var direction = this.direction;
        var actionIcon = $('.trade-box-adv .fp-action-icon');
        var actionSymbol = $('.trade-box-adv .fp-action-symbol');

        if (direction == 1) {
            actionIcon.addClass('b1');
            actionIcon.removeClass('b2');
        }
        else {
            actionIcon.addClass('b2');
            actionIcon.removeClass('b1');
        }

        actionSymbol.removeClass('s1');
        actionSymbol.removeClass('s2');
        actionSymbol.removeClass('s3');
        actionSymbol.removeClass('s4');

        switch (gameType) {
            case 3:
                actionSymbol.addClass('s1');
                break;
            case 4:
                actionSymbol.addClass('s2');
                break;
            case 5:
                actionSymbol.addClass('s3');
                break;
            case 6:
                actionSymbol.addClass('s4');
                break;
        }
    },

    // Update the question text when a game is selected/clicked based on game-type and direction
    updateQuestion: function() {
        var gameType = this.gameTypes[this.gameType];
        var direction = this.direction;

        var question;

        switch (gameType) {
            case 3:
                if (direction == 1) {
                    question = Registry._['financial-panel-question-above'];//'Will [[[instrument-name]]] close above the upper strike price at expiration?';
                }
                else {
                    question = Registry._['financial-panel-question-below'];//'Will [[[instrument-name]]] close below the lower strike price at expiration?';
                }
                break;
            case 4:
                if (direction == 1) {
                    question = Registry._['financial-panel-question-range-up'];//'Will [[[instrument-name]]] close strictly between the market and upper strike price at expiration?';
                }
                else {
                    question = Registry._['financial-panel-question-range-down'];//'Will [[[instrument-name]]] close strictly between the market and lower strike price at expiration?';
                }
                break;
            case 5:
                if (direction == 1) {
                    question = Registry._['financial-panel-question-touch-up'];//'Will [[[instrument-name]]] touch the upper strike price prior to expiration?';
                }
                else {
                    question = Registry._['financial-panel-question-touch-down'];//'Will [[[instrument-name]]] touch the lower strike price prior to expiration?';
                }
                break;
            case 6:
                if (direction == 1) {
                    question = Registry._['financial-panel-question-no-touch-up'];//'Will [[[instrument-name]]] not touch the upper strike price prior to expiration?';
                }
                else {
                    question = Registry._['financial-panel-question-no-touch-down'];//'Will [[[instrument-name]]] not touch the lower strike price prior to expiration?';
                }
                break;
        }

        question = question.replace('[[[instrument-name]]]', $("#fp-instrument-select option:selected").text());

        $('#fp-question').html(question);
    },

    // Triggered when a game button is clicked
    clickGame: function() {
        // Change the game type and direction according to the clicked button:
        this.gameType = this.tempGameType;
        this.direction = this.tempDirection;
        this.clicked = true;

        this.updateInvoiceActionIcon();
        this.updateQuestion();

        this.colorBackground();
        this.updateInvoice();

        if ($('#fp-confirmation-message').css('display') == 'none') {
            $('#fp-invoice').show();
        }
    },

    // Triggered when the mouse is moving out the game button (and no button was previously clicked)
    deselectGame: function() {
        if (this.clicked) {
            return;
        }

        this.gameType = null;
        this.direction = null;

        $('#fp-question').html('&nbsp;');

        this.colorBackground();
    },

    // Close the trade invoice
    closeTradeInvoice: function() {
        $('.control-con-item').removeClass('i-selected');
        FinancialPanel.gameType = null;
        FinancialPanel.direction = null;
        FinancialPanel.clicked = false;
        FinancialPanel.colorBackground();
        $('#fp-invoice').hide();
        $('#fp-question').html('&nbsp;');
    },

    // Place a trade:
    trade: function() {
        if ($('#fp-apply').hasClass('disabled')) {
            return;
        }

        var gameController = Trading.app.getController('Game');

        var message;

        $('#fp-request-button-wrapper').hide();
        $('#fp-close-message-button').hide();

        // Force log in to allow trading
        if (!Trading.app.getController('User').forceLogin()) {
            return;
        }
        else {
            var minStake = Registry.investmentLimits.minStakeStrategic * 1;
            var maxStake = Registry.investmentLimits.maxStakeStrategic * 1;
            var stake = Math.round($('#fp-investment-amount').val() * gameController.getUserCurrencyInfo().conversionRate);

            var error = false;

            if (stake < minStake) {
                error = true;
                message = Registry._['min-trade'] + ': ' + gameController.getUserCurrencyInfo().currencySymbol + Ext.util.Format.number(minStake / gameController.getUserCurrencyInfo().conversionRate, '0,000.00');
            }
            else if (stake > maxStake) {
                error = true;
                message = Registry._['max-trade'] + ': ' + gameController.getUserCurrencyInfo().currencySymbol + Ext.util.Format.number(maxStake / gameController.getUserCurrencyInfo().conversionRate, '0,000.00');
            }

            if (error) {
                $('#fp-invoice').hide();
                $('#fp-confirmation-message .message-title').html(message);
                $('#fp-confirmation-message .message-icon').hide();
                $('#fp-confirmation-message').show();
                setTimeout(function() {
                    $('#fp-confirmation-message').fadeOut(500, function() { $('#fp-invoice').show(); });
                }, 5000);

                return;
            }
        }

        if (typeof(Registry.permissionLevels.financialPanel) != 'undefined' &&
            typeof(Registry.userAccountLevel) != 'undefined' &&
            Registry.userAccountLevel < Registry.permissionLevels.financialPanel) {
            $('#fp-request-button-wrapper').show();
            $('#fp-close-message-button').show();

            $('#fp-invoice').hide();
            message = Registry._['financial-panel-request'];
            $('#fp-confirmation-message .message-title').html(message);
            $('#fp-confirmation-message .message-icon').hide();
            $('#fp-confirmation-message').show();

            return;
        }

        $('#fp-loader').addClass('loading');

        var instrumentID = this.instrumentID * 1;
        var params = {};

        params.instrumentID = instrumentID;
        params.payout = this.payout * 1;
        params.rebate = 0;
        params.direction = this.direction * 1;
        params.expiry = $('#fp-expiry-select').val() * 1;
        params.stake = Math.round($('#fp-investment-amount').val() * gameController.getUserCurrencyInfo().conversionRate);
        params.userCurrency = Registry.userCurrency;
        params.userCurrencyStake = $('#fp-investment-amount').val() * 1;
        params.strike = $('#fp-market-price').html() * 1;
        params.gameType = this.gameTypes[this.gameType];
        params.distance = this.distance;

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/trade',
            scope: this,
            params: params,
            success: function(response, options) {
                $('#fp-loader').removeClass('loading');
                response = Ext.decode(response.responseText);

                var params = options.params;

                if (response.success) {
                    FinancialPanel.closeTradeInvoice();
                    var timeOutDuration = 5000;

                    if (response.allowTimedCancel) {
                        $('#fp-confirmation-message .message-body').html(
                            '<a id="cancel-trade-button' + response.tradeID + '" class="button cancel-trade-button" href="#" onclick="Trading.app.getController(\'Game\').cancelTrade(\'' + params.instrumentID + '\',' + response.tradeID + ', true); return false;">' + Registry._['Cancel'] + ' <span id="cancel-timer-' + response.tradeID + '">' + Registry.cancelTradePeriod + '</span></a>' +
                            '<span class="loadable" id="cancel-loader-' + response.tradeID + '">&nbsp;</span>' +
                            '<div class="message-container evaluation-message" style="display: none;" id="response-message-' + response.tradeID + '"></div>');
                        $('#fp-confirmation-message .message-body').show();

                        var cancelCountdown = new Utils.countdown({
                            seconds: Registry.cancelTradePeriod, // number of seconds to count down
                            onUpdateStatus: function (sec) {
                                var timerElement = Ext.get('cancel-timer-' + response.tradeID);
                                if (!timerElement) {
                                    cancelCountdown.stop();
                                } else {
                                    Utils.cancelTradeCountdownProgress(timerElement, sec);
                                }
                            }, // callback for each second
                            onCounterEnd: function () {
                                var timerElement = Ext.get('cancel-timer-' + response.tradeID);
                                var cancelButton = Ext.get('cancel-trade-button' + response.tradeID);
                                if (cancelButton && timerElement) {
                                    cancelButton.addCls('disabled');
                                    cancelButton.set({onClick: 'return false'});
                                    $('#fp-confirmation-message').fadeOut(500, function () {
                                        $('#fp-confirmation-message .message-title').removeClass('centered');
                                    });
                                }
                            } // final action
                        });

                        cancelCountdown.start();
                    } else {
                        setTimeout(function() {
                            $('#fp-confirmation-message').fadeOut(500, function(){ $('#fp-confirmation-message .message-title').removeClass('centered'); });
                        }, 5000);
                    }

                    $('#fp-confirmation-message .message-title').html(Registry._['financial-panel-trade-accepted']/*'Trade accepted!'*/);
                    $('#fp-confirmation-message .message-title').addClass('centered');
                    $('#fp-confirmation-message .message-icon').show();
                    $('#fp-confirmation-message').show();

                    params.allowClosePosition = response.allowClosePosition;
                    params.created = response.timestamp;
                    FinancialPanel.trades[response.tradeID] = params;

                    var strike = FinancialPanel.formatStrike(params.strike, params.direction, params.gameType, params.distance, params.instrumentID);
                    var action = FinancialPanel.formatAction(params.gameType, params.direction);

                    var tableRow = '<td class="fp-positions-table-trade-id">' + response.tradeID + '</td>';
                    tableRow += '<td class="fp-positions-table-trading-time">' + gameController.formatExpiry(params.created) + '</td>';
                    tableRow += '<td class="fp-positions-table-expiry-time">' + gameController.formatExpiry(params.expiry) + '</td>';
                    tableRow += '<td class="fp-positions-table-asset">' + $("#fp-instrument-select option:selected").text() + '</td>';
                    tableRow += '<td class="fp-positions-table-option-type">' + action + '</td>';
                    tableRow += '<td class="fp-positions-table-strike">' + strike + '</td>';
                    tableRow += '<td class="fp-positions-table-investment">' + gameController.getUserCurrencyInfo().currencySymbol + params.userCurrencyStake + '</td>';
                    tableRow += '<td class="fp-positions-table-payout">' + params.payout + '%</td>';
                    tableRow += '<td class="fp-positions-table-expiry-price"><div id="fp-trade-entry-expiry-' + response.tradeID + '" class="trade-entry-expiry"></div></td>';
                    tableRow += '<td class="fp-positions-table-status"><div id="fp-trade-entry-indicator-' + response.tradeID + '" class="trade-entry-indicator"></div></td>';

                    tableRow = '<tr>' + tableRow + '</tr>';

                    if ($('#fp-positions-table tbody#fp-open-positions-data tr:first').length > 0) {
                        $('#fp-positions-table tbody#fp-open-positions-data tr:first').before(tableRow);
                    }
                    else {
                        $('#fp-positions-table tbody#fp-open-positions-data').html(tableRow);
                    }
                    $('#fp-positions-table tbody#fp-open-positions-data tr:first').addClass('data');

                    FinancialPanel.colorPositionsTableRows('open')

                    // Show new position and update wallet
                    var trade = Ext.create('Trading.model.Trade', {
                        tradeID: response.tradeID,
                        type: params.gameType,
                        instrumentID: (params.instrumentID + ''),
                        timestamp: response.timestamp,
                        expiry: params.expiry,
                        stake: params.stake,
                        userCurrency: params.userCurrency,
                        userCurrencyStake: params.userCurrencyStake,
                        strike: params.strike,
                        direction: params.direction,
                        payout: params.payout,
                        rebate: params.rebate,
                        status: 1,
                        allowClosePosition: response.allowClosePosition,
                        distance: params.distance
                    });

                    Trading.app.getController('User').trade(trade);
                }
                else {
                    $('#fp-invoice').hide();
                    var message = response.message ? response.message : Registry._['financial-panel-trade-rejected']/*'Trade rejected!'*/;
                    $('#fp-confirmation-message .message-title').html(message);
                    $('#fp-confirmation-message .message-icon').hide();
                    $('#fp-confirmation-message').show();
                    setTimeout(function() {
                        $('#fp-confirmation-message').fadeOut(500, function() { $('#fp-invoice').show(); });
                    }, 5000);
                }
            },
            failure: function(response) {
                $('#fp-loader').removeClass('loading');
                $('#fp-invoice').hide();
                var message = Registry._['financial-panel-trade-was-not-accepted'];/*'Trade was not accepted!'*/;
                console.log('Trade was not accepted. Server response:');
                console.log(response);
                $('#fp-confirmation-message .message-title').html(message);
                $('#fp-confirmation-message .message-icon').hide();
                $('#fp-confirmation-message').show();
                setTimeout(function() {
                    $('#fp-confirmation-message').fadeOut(500, function() { $('#fp-invoice').show(); });
                }, 5000);
            }
        });
    },

    // Request premission to trade when the user account level is not high enough
    requestPermission: function() {
        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/user-request',
            scope: this,
            params: {requestType: 'financialPanel'},
            success: function(response) {
                FinancialPanel.showPermissionRequestResponse();
            },
            failure: function(response) {
                FinancialPanel.showPermissionRequestResponse();
            }
        });
    },

    // Show a confirmation message for premission request
    showPermissionRequestResponse: function() {
        $('#fp-request-button-wrapper').hide();
        $('#fp-close-message-button').hide();

        var message = Registry._['financial-panel-request-response-success'];
        $('#fp-confirmation-message .message-title').html(message);
        setTimeout(function() {
            $('#fp-confirmation-message').fadeOut(500);
        }, 10000);
    },

    hideMessage: function() {
        $('#fp-confirmation-message').hide();
    },

    // format strike based on the strike value game-type and direction
    // Used also by User.js
    formatStrike: function(strike, direction, type, distance, instrumentID) {
        var numberOfDigits = this.getPrecision(instrumentID);

        strike = (strike * 1);
        distance = (distance * 1);
        direction = (direction * 1);

        var result;
        if (type == 1 || type == 2 || type == 7 || type == 11) {
            result = (strike).toFixed(numberOfDigits);
        }
        else if (type == 3 || type == 5 || type == 6) {
            result = (direction == 1) ? (strike + distance).toFixed(numberOfDigits) : (strike - distance).toFixed(numberOfDigits);
        }
        else if (type == 4) {
            result = (direction == 1) ? (strike.toFixed(numberOfDigits) + ' - ' + (strike + distance).toFixed(numberOfDigits)) :
                                          ((strike - distance).toFixed(numberOfDigits) + ' - ' + strike.toFixed(numberOfDigits));
        }

        return result;
    },

    // Get action text to be displayed on open-positions table
    formatAction: function(gameType, direction) {
        var action = '';
        gameType = (gameType * 1);
        direction = (direction * 1);
        switch (gameType) {
            case 3:
                if (direction == 1) {
                    action = Registry._['financial-panel-button-above'];
                }
                else {
                    action = Registry._['financial-panel-button-below'];
                }
                break;
            case 4:
                if (direction == 1) {
                    action = Registry._['financial-panel-button-range-up'];
                }
                else {
                    action = Registry._['financial-panel-button-range-down'];
                }
                break;
            case 5:
                if (direction == 1) {
                    action = Registry._['financial-panel-button-touch-up'];
                }
                else {
                    action = Registry._['financial-panel-button-touch-down'];
                }
                break;
            case 6:
                if (direction == 1) {
                    action = Registry._['financial-panel-button-no-touch-up'];
                }
                else {
                    action = Registry._['financial-panel-button-no-touch-down'];
                }
                break;
        }

        return action;
    },

    // Get the instrument precision (number of significant decimal places)
    getPrecision: function(instrumentID) {
        return Trading.app.getController('Instrument').instruments.getById(instrumentID + '').data.precision * 1;
    },

    // Called by Feed.js handleManualActiveGames() to update which games are active (changed manually through the back-office/admin)
    updateManualActiveGames: function(manualActiveGames) {
        Registry.advancedGamesConfig = manualActiveGames;
        if (this.instrumentID !== null) {
            this.selectExpiry();
        }
    },

    // Called by Feed.js handleActiveGames() to update which games are active (changed automatically)
    updateActiveGames: function(activeGames) {
        this.activeGames = activeGames;
        if (this.instrumentID !== null) {
            this.selectExpiry();
        }
    },

    // Returns true if a game is open both in manual and automatic active games
    isOpenInConfig: function(gameType, instrumentID) {
        if (typeof(instrumentID) == 'undefined') {
            instrumentID = this.instrumentID;
        }

        var gameTypeName = this.gameTypeNames[gameType];
        var inConfig = (Registry.advancedGamesConfig['game_' + gameTypeName].indexOf(instrumentID) != -1);
        var inActiveGames;
        if (this.activeGames == null) {
            inActiveGames = true;
        }
        else {
            if (typeof(this.activeGames[instrumentID]) == 'undefined' ||
                typeof(this.activeGames[instrumentID][gameType]) == 'undefined') {
                    inActiveGames = false;
            }
            else {
                inActiveGames = this.activeGames[instrumentID][gameType];
            }
        }

        return (inConfig && inActiveGames);
    },

    // Called by User.js renderTrades() to fill the open-positions table with the user's trades
    addTrades: function(trades) {
        var gameController = Trading.app.getController('Game');
        var instrumentController = Trading.app.getController('Instrument');

        trades.each(function(trade) {
            var tradeData = trade.data;
            if (tradeData.type < 3 || tradeData.type > 6) {
                return;
            }

            var strike = FinancialPanel.formatStrike(tradeData.strike, tradeData.direction, tradeData.type, tradeData.distance, tradeData.instrumentID);
            var action = FinancialPanel.formatAction(tradeData.type, tradeData.direction);

            var tableRow = '<td class="fp-positions-table-trade-id">' + tradeData.tradeID + '</td>';
            tableRow += '<td class="fp-positions-table-trading-time">' + gameController.formatExpiry(tradeData.timestamp) + '</td>';
            tableRow += '<td class="fp-positions-table-expiry-time">' + gameController.formatExpiry(tradeData.expiry) + '</td>';
            tableRow += '<td class="fp-positions-table-asset">' + instrumentController.instruments.getById(tradeData.instrumentID).data.name + '</td>';
            tableRow += '<td class="fp-positions-table-option-type">' + action + '</td>';
            tableRow += '<td class="fp-positions-table-strike">' + strike + '</td>';
            // console.log(tradeData.userCurrency);
            tableRow += '<td class="fp-positions-table-investment">' + Registry.currenciesInfo[tradeData.userCurrency].currencySymbol + tradeData.userCurrencyStake + '</td>';
            tableRow += '<td class="fp-positions-table-payout">' + tradeData.payout + '%</td>';
            tableRow += '<td class="fp-positions-table-expiry-price"><div id="fp-trade-entry-expiry-' + tradeData.tradeID + '" class="trade-entry-expiry"></div></td>';
            tableRow += '<td class="fp-positions-table-status"><div id="fp-trade-entry-indicator-' + tradeData.tradeID + '" class="trade-entry-indicator"></div></td>';

            tableRow = '<tr>' + tableRow + '</tr>';

            if ($('#fp-positions-table tbody#fp-open-positions-data tr:last').length > 0) {
                $('#fp-positions-table tbody#fp-open-positions-data tr:last').after(tableRow);
            }
            else {
                $('#fp-positions-table tbody#fp-open-positions-data').html(tableRow);
            }
            $('#fp-positions-table tbody#fp-open-positions-data tr:last').addClass('data');
        });

        this.colorPositionsTableRows('open');
    },

    // Color the open-positions table rows with different color for odd and even rows
    colorPositionsTableRows: function(positionsType) {
        var rows = $('#fp-positions-table tbody#fp-' + positionsType + '-positions-data tr');
        var row;
        var i;

        for (i = 0; i < rows.length; i++) {
            row = $('#fp-positions-table tbody#fp-' + positionsType + '-positions-data tr:nth-child(' + (i + 1) + ')');
            if (i % 2 == 0) {
                row.addClass('even');
                row.removeClass('odd');
            }
            else {
                row.addClass('odd');
                row.removeClass('even');
            }
        }
    },

    // Called by financial-panel.phtml when the mouse is over a speicifc game type buttons region
    formatInfoBox: function(gameType) {
        var message = '';
        var payout = $('#control-con-item-' + gameType + ' .c-val').html();
        var i;

        switch (gameType) {
            case 3:
                message = '<span class="info-box-message-title">' + Registry._['financial-panel-button-above'] + '</span> - ' + Registry._['financial-panel-info-box-above'] + '<br />' +/*'Profit [[[payout]]] if [[[instrument-name]]] is above the upper strike at expiration.'*/
                          '<span class="info-box-message-title">' + Registry._['financial-panel-button-below'] + '</span> - ' + Registry._['financial-panel-info-box-below'];/*'Profit [[[payout]]] if [[[instrument-name]]] is below the lower strike at expiration.'*/
                break;
            case 4:
                message = '<span class="info-box-message-title">' + Registry._['financial-panel-button-range-up'] + '</span> - ' + Registry._['financial-panel-info-box-range-up'] + '<br />' +/*'Profit [[[payout]]] if [[[instrument-name]]] is strictly between the market and the upper strike at expiration.'*/
                          '<span class="info-box-message-title">' + Registry._['financial-panel-button-range-down'] + '</span> - ' + Registry._['financial-panel-info-box-range-down'];/*'Profit [[[payout]]] if [[[instrument-name]]] is strictly between the market and the lower strike at expiration.'*/
                break;
            case 5:
                message = '<span class="info-box-message-title">' + Registry._['financial-panel-button-touch-up'] + '</span> - ' + Registry._['financial-panel-info-box-touch-up'] + '<br />' +/*'Profit [[[payout]]] if [[[instrument-name]]] touches the upper strike before expiration.'*/
                          '<span class="info-box-message-title">' + Registry._['financial-panel-button-touch-down'] + '</span> - ' + Registry._['financial-panel-info-box-touch-down'];/*'Profit [[[payout]]] if [[[instrument-name]]] touches the lower strike before expiration.'*/;
                break;
            case 6:
                message = '<span class="info-box-message-title">' + Registry._['financial-panel-button-no-touch-up'] + '</span> - ' + Registry._['financial-panel-info-box-no-touch-up'] + '<br />' +/*'Profit [[[payout]]] if [[[instrument-name]]] does NOT touch the upper strike before expiration.'*/
                          '<span class="info-box-message-title">' + Registry._['financial-panel-button-no-touch-down'] + '</span> - ' + Registry._['financial-panel-info-box-no-touch-down'];/*'Profit [[[payout]]] if [[[instrument-name]]] does NOT touch the lower strike before expiration.'*/
                break;
        }

        // We have two replacements to make:
        for (i = 0; i < 2; i++) {
            message = message.replace('[[[payout]]]', payout);
            message = message.replace('[[[instrument-name]]]', $("#fp-instrument-select option:selected").text());
        }

        return message;
    },

    // Called by financial-panel.phtml to swith between open and closed positions table data
    selectTab: function(tabName) {
        if ($('#fp-tab-' + tabName + '-positions').hasClass('active')) {
            return;
        }

        if (tabName == 'open') {
            $('#fp-tab-closed-positions').removeClass('active');
            $('#fp-tab-open-positions').addClass('active');
            $('#fp-closed-positions-data').hide();
            $('#fp-open-positions-data').show();
            $('#fp-view-full-trades-report').hide();
        }
        else if (tabName == 'closed') {
            $('#fp-tab-open-positions').removeClass('active');
            $('#fp-tab-closed-positions').addClass('active');
            $('#fp-open-positions-data').hide();
            $('#fp-closed-positions-data').show();
            $('#fp-view-full-trades-report').show();

            this.loadClosedPositionsData();
        }
    },

    // Update the user's closed-positions data (called by selectTab() when selecting the closed-positions tab)
    loadClosedPositionsData: function() {
        if (!Registry.userID) {
            return;
        }

        Ext.Ajax.request({
            url: Registry.uriBase + '/ajax/user/trades',
            params: {
                year: '',
                month: '',
                day: '',
                page: 1
            },
            success: function(response) {
                response = Ext.decode(response.responseText);
                var trades = response.rows;
                var i;
                var tradeData;
                var tableRow;
                var strike;
                var action;

                $('#fp-positions-table tbody#fp-closed-positions-data tr').remove()

                for (i = 0; i < trades.length; i++) {
                    tradeData = trades[i];

                    if (tradeData.type < 3 || tradeData.type > 6) {
                        continue;
                    }

                    strike = FinancialPanel.formatStrike(tradeData.strike, tradeData.direction, tradeData.type, tradeData.distance, tradeData.instrumentID);
                    action = FinancialPanel.formatAction(tradeData.type, tradeData.direction);

                    tableRow = '<td class="fp-positions-table-trade-id">' + tradeData.tradeID + '</td>';
                    tableRow += '<td class="fp-positions-table-trading-time">' + tradeData.created + '</td>';
                    tableRow += '<td class="fp-positions-table-expiry-time">' + tradeData.expired + '</td>';
                    tableRow += '<td class="fp-positions-table-asset">' + tradeData.asset + '</td>';
                    tableRow += '<td class="fp-positions-table-option-type">' + action + '</td>';
                    tableRow += '<td class="fp-positions-table-strike">' + strike + '</td>';
                    tableRow += '<td class="fp-positions-table-investment">' + Registry.currenciesInfo[tradeData.userCurrency].currencySymbol + tradeData.userCurrencyStake + '</td>';
                    tableRow += '<td class="fp-positions-table-payout">' + tradeData.payout + '</td>';
                    tableRow += '<td class="fp-positions-table-expiry-price"><div id="fp-trade-entry-expiry-' + tradeData.tradeID + '" class="trade-entry-expiry">' + tradeData.expiry + '</div></td>';
                    tableRow += '<td class="fp-positions-table-status"><div id="fp-trade-entry-indicator-' + tradeData.tradeID + '" class="trade-entry-indicator">' + Registry._['label-return-amount'] + ': ' + Registry.currenciesInfo[tradeData.userCurrency].currencySymbol + tradeData['userCurrencyReturn'] + '</div></td>';

                    tableRow = '<tr>' + tableRow + '</tr>';

                    if ($('#fp-positions-table tbody#fp-closed-positions-data tr:last').length > 0) {
                        $('#fp-positions-table tbody#fp-closed-positions-data tr:last').after(tableRow);
                    }
                    else {
                        $('#fp-positions-table tbody#fp-closed-positions-data').html(tableRow);
                    }
                    $('#fp-positions-table tbody#fp-closed-positions-data tr:last').addClass('data');
                }

                FinancialPanel.colorPositionsTableRows('closed');
            },
            failure: function(response) {
            }
        });
    },

    addInfoTooltips: function (instrumentData) {
        if (!Registry.displayGameInfo) {
            return;
        }

        this.tplInstrumentInfo = new Ext.XTemplate(
            '<h4><b>{name}{[values.futureExpirationDate ? "-" + values.futureExpirationDate : ""]}</b></h4>',
            '<p>{[this.htmlEscape(values.description)]}</p>',
            '<br/>',
            '<span><b>' + Registry._['expiry-formula'] + ': </b></span>',
            '<span>{[this.htmlEscape(values.expiry)]}</span>',
            '<br/>',
            '<br/>',
            '<span><b>' + Registry._['feed-source'] + ': </b></span>',
            '<span>{provider}</span>',
            {
                htmlEscape: function(value) {
                    return Utils.htmlEscape(value);
                }
            }
            );

        this.tplAskBidInfo = new Ext.XTemplate(
            '<h4><b>' + Registry._['strike-rate'] + '</b></h4>',
            '<p>' + Registry._['strike-rate-text'] + '</p>',
            '<br/>',
            '<h4><b>' + Registry._['ask-bid-rates'] + '</b></h4>',
            '<p>' + Utils.htmlEscape(Registry._['ask-bid-rates-text']) + '</p>'
            );

        this.tplAskBidValues = new Ext.XTemplate(
                '<div class="ask-bid-value"><span>' + Registry._['Bid'] + ':</span>&nbsp;<span id="fp-bid-{instrumentID}">-</span></div>',
                '<div class="ask-bid-value"><span>' + Registry._['Ask'] + ':</span>&nbsp;<span id="fp-ask-{instrumentID}">-</span></div>'
            );

        this.updateInfoTooltips(instrumentData);

        $('#fp-game-info.instrument-desc').tooltip({
            position: {my: "left-56 top+25", collision: "none"},
            items: "[tooltip-content]",
            tooltipClass: "game-tooltip instrument-desc-tooltip"
        });

        $('#fp-ask-bid-container .ask-bid-desc').tooltip({
            position: {my: "right+121 bottom-22", collision: "none"},
            items: "[tooltip-content]",
            tooltipClass: "game-tooltip ask-bid-desc-tooltip"
        });
    },

    updateInfoTooltips: function(instrumentData) {
        if (!Registry.displayGameInfo) {
            return;
        }

        if (!instrumentData) {
            var instrumentController = Trading.app.getController('Instrument');
            instrumentData = instrumentController.instruments.getById(this.instrumentID).data;
        }

        $('#fp-game-info').attr('tooltip-content', this.tplInstrumentInfo.applyTemplate(instrumentData));
        $('#fp-ask-bid-container .ask-bid-desc').attr('tooltip-content', this.tplAskBidInfo.applyTemplate(instrumentData));
        this.tplAskBidValues.overwrite('fp-ask-bid-values', instrumentData);
    }
}

var swfobject=function(){var aq="undefined",aD="object",ab="Shockwave Flash",X="ShockwaveFlash.ShockwaveFlash",aE="application/x-shockwave-flash",ac="SWFObjectExprInst",ax="onreadystatechange",af=window,aL=document,aB=navigator,aa=false,Z=[aN],aG=[],ag=[],al=[],aJ,ad,ap,at,ak=false,aU=false,aH,an,aI=true,ah=function(){var a=typeof aL.getElementById!=aq&&typeof aL.getElementsByTagName!=aq&&typeof aL.createElement!=aq,e=aB.userAgent.toLowerCase(),c=aB.platform.toLowerCase(),h=c?/win/.test(c):/win/.test(e),j=c?/mac/.test(c):/mac/.test(e),g=/webkit/.test(e)?parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,d=!+"\v1",f=[0,0,0],k=null;if(typeof aB.plugins!=aq&&typeof aB.plugins[ab]==aD){k=aB.plugins[ab].description;if(k&&!(typeof aB.mimeTypes!=aq&&aB.mimeTypes[aE]&&!aB.mimeTypes[aE].enabledPlugin)){aa=true;d=false;k=k.replace(/^.*\s+(\S+\s+\S+$)/,"$1");f[0]=parseInt(k.replace(/^(.*)\..*$/,"$1"),10);f[1]=parseInt(k.replace(/^.*\.(.*)\s.*$/,"$1"),10);f[2]=/[a-zA-Z]/.test(k)?parseInt(k.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof af.ActiveXObject!=aq){try{var i=new ActiveXObject(X);if(i){k=i.GetVariable("$version");if(k){d=true;k=k.split(" ")[1].split(",");f=[parseInt(k[0],10),parseInt(k[1],10),parseInt(k[2],10)]}}}catch(b){}}}return{w3:a,pv:f,wk:g,ie:d,win:h,mac:j}}(),aK=function(){if(!ah.w3){return}if((typeof aL.readyState!=aq&&aL.readyState=="complete")||(typeof aL.readyState==aq&&(aL.getElementsByTagName("body")[0]||aL.body))){aP()}if(!ak){if(typeof aL.addEventListener!=aq){aL.addEventListener("DOMContentLoaded",aP,false)}if(ah.ie&&ah.win){aL.attachEvent(ax,function(){if(aL.readyState=="complete"){aL.detachEvent(ax,arguments.callee);aP()}});if(af==top){(function(){if(ak){return}try{aL.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}aP()})()}}if(ah.wk){(function(){if(ak){return}if(!/loaded|complete/.test(aL.readyState)){setTimeout(arguments.callee,0);return}aP()})()}aC(aP)}}();function aP(){if(ak){return}try{var b=aL.getElementsByTagName("body")[0].appendChild(ar("span"));b.parentNode.removeChild(b)}catch(a){return}ak=true;var d=Z.length;for(var c=0;c<d;c++){Z[c]()}}function aj(a){if(ak){a()}else{Z[Z.length]=a}}function aC(a){if(typeof af.addEventListener!=aq){af.addEventListener("load",a,false)}else{if(typeof aL.addEventListener!=aq){aL.addEventListener("load",a,false)}else{if(typeof af.attachEvent!=aq){aM(af,"onload",a)}else{if(typeof af.onload=="function"){var b=af.onload;af.onload=function(){b();a()}}else{af.onload=a}}}}}function aN(){if(aa){Y()}else{am()}}function Y(){var d=aL.getElementsByTagName("body")[0];var b=ar(aD);b.setAttribute("type",aE);var a=d.appendChild(b);if(a){var c=0;(function(){if(typeof a.GetVariable!=aq){var e=a.GetVariable("$version");if(e){e=e.split(" ")[1].split(",");ah.pv=[parseInt(e[0],10),parseInt(e[1],10),parseInt(e[2],10)]}}else{if(c<10){c++;setTimeout(arguments.callee,10);return}}d.removeChild(b);a=null;am()})()}else{am()}}function am(){var g=aG.length;if(g>0){for(var h=0;h<g;h++){var c=aG[h].id;var l=aG[h].callbackFn;var a={success:false,id:c};if(ah.pv[0]>0){var i=aS(c);if(i){if(ao(aG[h].swfVersion)&&!(ah.wk&&ah.wk<312)){ay(c,true);if(l){a.success=true;a.ref=av(c);l(a)}}else{if(aG[h].expressInstall&&au()){var e={};e.data=aG[h].expressInstall;e.width=i.getAttribute("width")||"0";e.height=i.getAttribute("height")||"0";if(i.getAttribute("class")){e.styleclass=i.getAttribute("class")}if(i.getAttribute("align")){e.align=i.getAttribute("align")}var f={};var d=i.getElementsByTagName("param");var k=d.length;for(var j=0;j<k;j++){if(d[j].getAttribute("name").toLowerCase()!="movie"){f[d[j].getAttribute("name")]=d[j].getAttribute("value")}}ae(e,f,c,l)}else{aF(i);if(l){l(a)}}}}}else{ay(c,true);if(l){var b=av(c);if(b&&typeof b.SetVariable!=aq){a.success=true;a.ref=b}l(a)}}}}}function av(b){var d=null;var c=aS(b);if(c&&c.nodeName=="OBJECT"){if(typeof c.SetVariable!=aq){d=c}else{var a=c.getElementsByTagName(aD)[0];if(a){d=a}}}return d}function au(){return !aU&&ao("6.0.65")&&(ah.win||ah.mac)&&!(ah.wk&&ah.wk<312)}function ae(f,d,h,e){aU=true;ap=e||null;at={success:false,id:h};var a=aS(h);if(a){if(a.nodeName=="OBJECT"){aJ=aO(a);ad=null}else{aJ=a;ad=h}f.id=ac;if(typeof f.width==aq||(!/%$/.test(f.width)&&parseInt(f.width,10)<310)){f.width="310"}if(typeof f.height==aq||(!/%$/.test(f.height)&&parseInt(f.height,10)<137)){f.height="137"}aL.title=aL.title.slice(0,47)+" - Flash Player Installation";var b=ah.ie&&ah.win?"ActiveX":"PlugIn",c="MMredirectURL="+af.location.toString().replace(/&/g,"%26")+"&MMplayerType="+b+"&MMdoctitle="+aL.title;if(typeof d.flashvars!=aq){d.flashvars+="&"+c}else{d.flashvars=c}if(ah.ie&&ah.win&&a.readyState!=4){var g=ar("div");h+="SWFObjectNew";g.setAttribute("id",h);a.parentNode.insertBefore(g,a);a.style.display="none";(function(){if(a.readyState==4){a.parentNode.removeChild(a)}else{setTimeout(arguments.callee,10)}})()}aA(f,d,h)}}function aF(a){if(ah.ie&&ah.win&&a.readyState!=4){var b=ar("div");a.parentNode.insertBefore(b,a);b.parentNode.replaceChild(aO(a),b);a.style.display="none";(function(){if(a.readyState==4){a.parentNode.removeChild(a)}else{setTimeout(arguments.callee,10)}})()}else{a.parentNode.replaceChild(aO(a),a)}}function aO(b){var d=ar("div");if(ah.win&&ah.ie){d.innerHTML=b.innerHTML}else{var e=b.getElementsByTagName(aD)[0];if(e){var a=e.childNodes;if(a){var f=a.length;for(var c=0;c<f;c++){if(!(a[c].nodeType==1&&a[c].nodeName=="PARAM")&&!(a[c].nodeType==8)){d.appendChild(a[c].cloneNode(true))}}}}}return d}function aA(e,g,c){var d,a=aS(c);if(ah.wk&&ah.wk<312){return d}if(a){if(typeof e.id==aq){e.id=c}if(ah.ie&&ah.win){var f="";for(var i in e){if(e[i]!=Object.prototype[i]){if(i.toLowerCase()=="data"){g.movie=e[i]}else{if(i.toLowerCase()=="styleclass"){f+=' class="'+e[i]+'"'}else{if(i.toLowerCase()!="classid"){f+=" "+i+'="'+e[i]+'"'}}}}}var h="";for(var j in g){if(g[j]!=Object.prototype[j]){h+='<param name="'+j+'" value="'+g[j]+'" />'}}a.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+f+">"+h+"</object>";ag[ag.length]=e.id;d=aS(e.id)}else{var b=ar(aD);b.setAttribute("type",aE);for(var k in e){if(e[k]!=Object.prototype[k]){if(k.toLowerCase()=="styleclass"){b.setAttribute("class",e[k])}else{if(k.toLowerCase()!="classid"){b.setAttribute(k,e[k])}}}}for(var l in g){if(g[l]!=Object.prototype[l]&&l.toLowerCase()!="movie"){aQ(b,l,g[l])}}a.parentNode.replaceChild(b,a);d=b}}return d}function aQ(b,d,c){var a=ar("param");a.setAttribute("name",d);a.setAttribute("value",c);b.appendChild(a)}function aw(a){var b=aS(a);if(b&&b.nodeName=="OBJECT"){if(ah.ie&&ah.win){b.style.display="none";(function(){if(b.readyState==4){aT(a)}else{setTimeout(arguments.callee,10)}})()}else{b.parentNode.removeChild(b)}}}function aT(a){var b=aS(a);if(b){for(var c in b){if(typeof b[c]=="function"){b[c]=null}}b.parentNode.removeChild(b)}}function aS(a){var c=null;try{c=aL.getElementById(a)}catch(b){}return c}function ar(a){return aL.createElement(a)}function aM(a,c,b){a.attachEvent(c,b);al[al.length]=[a,c,b]}function ao(a){var b=ah.pv,c=a.split(".");c[0]=parseInt(c[0],10);c[1]=parseInt(c[1],10)||0;c[2]=parseInt(c[2],10)||0;return(b[0]>c[0]||(b[0]==c[0]&&b[1]>c[1])||(b[0]==c[0]&&b[1]==c[1]&&b[2]>=c[2]))?true:false}function az(b,f,a,c){if(ah.ie&&ah.mac){return}var e=aL.getElementsByTagName("head")[0];if(!e){return}var g=(a&&typeof a=="string")?a:"screen";if(c){aH=null;an=null}if(!aH||an!=g){var d=ar("style");d.setAttribute("type","text/css");d.setAttribute("media",g);aH=e.appendChild(d);if(ah.ie&&ah.win&&typeof aL.styleSheets!=aq&&aL.styleSheets.length>0){aH=aL.styleSheets[aL.styleSheets.length-1]}an=g}if(ah.ie&&ah.win){if(aH&&typeof aH.addRule==aD){aH.addRule(b,f)}}else{if(aH&&typeof aL.createTextNode!=aq){aH.appendChild(aL.createTextNode(b+" {"+f+"}"))}}}function ay(a,c){if(!aI){return}var b=c?"visible":"hidden";if(ak&&aS(a)){aS(a).style.visibility=b}else{az("#"+a,"visibility:"+b)}}function ai(b){var a=/[\\\"<>\.;]/;var c=a.exec(b)!=null;return c&&typeof encodeURIComponent!=aq?encodeURIComponent(b):b}var aR=function(){if(ah.ie&&ah.win){window.attachEvent("onunload",function(){var a=al.length;for(var b=0;b<a;b++){al[b][0].detachEvent(al[b][1],al[b][2])}var d=ag.length;for(var c=0;c<d;c++){aw(ag[c])}for(var e in ah){ah[e]=null}ah=null;for(var f in swfobject){swfobject[f]=null}swfobject=null})}}();return{registerObject:function(a,e,c,b){if(ah.w3&&a&&e){var d={};d.id=a;d.swfVersion=e;d.expressInstall=c;d.callbackFn=b;aG[aG.length]=d;ay(a,false)}else{if(b){b({success:false,id:a})}}},getObjectById:function(a){if(ah.w3){return av(a)}},embedSWF:function(k,e,h,f,c,a,b,i,g,j){var d={success:false,id:e};if(ah.w3&&!(ah.wk&&ah.wk<312)&&k&&e&&h&&f&&c){ay(e,false);aj(function(){h+="";f+="";var q={};if(g&&typeof g===aD){for(var o in g){q[o]=g[o]}}q.data=k;q.width=h;q.height=f;var n={};if(i&&typeof i===aD){for(var p in i){n[p]=i[p]}}if(b&&typeof b===aD){for(var l in b){if(typeof n.flashvars!=aq){n.flashvars+="&"+l+"="+b[l]}else{n.flashvars=l+"="+b[l]}}}if(ao(c)){var m=aA(q,n,e);if(q.id==e){ay(e,true)}d.success=true;d.ref=m}else{if(a&&au()){q.data=a;ae(q,n,e,j);return}else{ay(e,true)}}if(j){j(d)}})}else{if(j){j(d)}}},switchOffAutoHideShow:function(){aI=false},ua:ah,getFlashPlayerVersion:function(){return{major:ah.pv[0],minor:ah.pv[1],release:ah.pv[2]}},hasFlashPlayerVersion:ao,createSWF:function(a,b,c){if(ah.w3){return aA(a,b,c)}else{return undefined}},showExpressInstall:function(b,a,d,c){if(ah.w3&&au()){ae(b,a,d,c)}},removeSWF:function(a){if(ah.w3){aw(a)}},createCSS:function(b,a,c,d){if(ah.w3){az(b,a,c,d)}},addDomLoadEvent:aj,addLoadEvent:aC,getQueryParamValue:function(b){var a=aL.location.search||aL.location.hash;if(a){if(/\?/.test(a)){a=a.split("?")[1]}if(b==null){return ai(a)}var c=a.split("&");for(var d=0;d<c.length;d++){if(c[d].substring(0,c[d].indexOf("="))==b){return ai(c[d].substring((c[d].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(aU){var a=aS(ac);if(a&&aJ){a.parentNode.replaceChild(aJ,a);if(ad){ay(ad,true);if(ah.ie&&ah.win){aJ.style.display="block"}}if(ap){ap(at)}}aU=false}}}}();

/*! nanoScrollerJS - v0.8.1 used by tplFinancialView */

!function(a,b,c){"use strict";var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;z={paneClass:"nano-pane",sliderClass:"nano-slider",contentClass:"nano-content",iOSNativeScrolling:!1,preventPageScrolling:!1,disableResize:!1,alwaysVisible:!1,flashDelay:1500,sliderMinHeight:20,sliderMaxHeight:null,documentContext:null,windowContext:null},u="scrollbar",t="scroll",l="mousedown",m="mouseenter",n="mousemove",p="mousewheel",o="mouseup",s="resize",h="drag",i="enter",w="up",r="panedown",f="DOMMouseScroll",g="down",x="wheel",j="keydown",k="keyup",v="touchmove",d="Microsoft Internet Explorer"===b.navigator.appName&&/msie 7./i.test(b.navigator.appVersion)&&b.ActiveXObject,e=null,D=b.requestAnimationFrame,y=b.cancelAnimationFrame,F=c.createElement("div").style,H=function(){var a,b,c,d,e,f;for(d=["t","webkitT","MozT","msT","OT"],a=e=0,f=d.length;f>e;a=++e)if(c=d[a],b=d[a]+"ransform",b in F)return d[a].substr(0,d[a].length-1);return!1}(),G=function(a){return H===!1?!1:""===H?a:H+a.charAt(0).toUpperCase()+a.substr(1)},E=G("transform"),B=E!==!1,A=function(){var a,b,d;return a=c.createElement("div"),b=a.style,b.position="absolute",b.width="100px",b.height="100px",b.overflow=t,b.top="-9999px",c.body.appendChild(a),d=a.offsetWidth-a.clientWidth,c.body.removeChild(a),d},C=function(){var a,c,d;return c=b.navigator.userAgent,(a=/(?=.+Mac OS X)(?=.+Firefox)/.test(c))?(d=/Firefox\/\d{2}\./.exec(c),d&&(d=d[0].replace(/\D+/g,"")),a&&+d>23):!1},q=function(){function j(d,f){this.el=d,this.options=f,e||(e=A()),this.$el=a(this.el),this.doc=a(this.options.documentContext||c),this.win=a(this.options.windowContext||b),this.body=this.doc.find("body"),this.$content=this.$el.children("."+f.contentClass),this.$content.attr("tabindex",this.options.tabIndex||0),this.content=this.$content[0],this.previousPosition=0,this.options.iOSNativeScrolling&&null!=this.el.style.WebkitOverflowScrolling?this.nativeScrolling():this.generate(),this.createEvents(),this.addEvents(),this.reset()}return j.prototype.preventScrolling=function(a,b){if(this.isActive)if(a.type===f)(b===g&&a.originalEvent.detail>0||b===w&&a.originalEvent.detail<0)&&a.preventDefault();else if(a.type===p){if(!a.originalEvent||!a.originalEvent.wheelDelta)return;(b===g&&a.originalEvent.wheelDelta<0||b===w&&a.originalEvent.wheelDelta>0)&&a.preventDefault()}},j.prototype.nativeScrolling=function(){this.$content.css({WebkitOverflowScrolling:"touch"}),this.iOSNativeScrolling=!0,this.isActive=!0},j.prototype.updateScrollValues=function(){var a,b;a=this.content,this.maxScrollTop=a.scrollHeight-a.clientHeight,this.prevScrollTop=this.contentScrollTop||0,this.contentScrollTop=a.scrollTop,b=this.contentScrollTop>this.previousPosition?"down":this.contentScrollTop<this.previousPosition?"up":"same",this.previousPosition=this.contentScrollTop,"same"!==b&&this.$el.trigger("update",{position:this.contentScrollTop,maximum:this.maxScrollTop,direction:b}),this.iOSNativeScrolling||(this.maxSliderTop=this.paneHeight-this.sliderHeight,this.sliderTop=0===this.maxScrollTop?0:this.contentScrollTop*this.maxSliderTop/this.maxScrollTop)},j.prototype.setOnScrollStyles=function(){var a;B?(a={},a[E]="translate(0, "+this.sliderTop+"px)"):a={top:this.sliderTop},D?(y&&this.scrollRAF&&y(this.scrollRAF),this.scrollRAF=D(function(b){return function(){return b.scrollRAF=null,b.slider.css(a)}}(this))):this.slider.css(a)},j.prototype.createEvents=function(){this.events={down:function(a){return function(b){return a.isBeingDragged=!0,a.offsetY=b.pageY-a.slider.offset().top,a.slider.is(b.target)||(a.offsetY=0),a.pane.addClass("active"),a.doc.bind(n,a.events[h]).bind(o,a.events[w]),a.body.bind(m,a.events[i]),!1}}(this),drag:function(a){return function(b){return a.sliderY=b.pageY-a.$el.offset().top-a.paneTop-(a.offsetY||.5*a.sliderHeight),a.scroll(),a.contentScrollTop>=a.maxScrollTop&&a.prevScrollTop!==a.maxScrollTop?a.$el.trigger("scrollend"):0===a.contentScrollTop&&0!==a.prevScrollTop&&a.$el.trigger("scrolltop"),!1}}(this),up:function(a){return function(){return a.isBeingDragged=!1,a.pane.removeClass("active"),a.doc.unbind(n,a.events[h]).unbind(o,a.events[w]),a.body.unbind(m,a.events[i]),!1}}(this),resize:function(a){return function(){a.reset()}}(this),panedown:function(a){return function(b){return a.sliderY=(b.offsetY||b.originalEvent.layerY)-.5*a.sliderHeight,a.scroll(),a.events.down(b),!1}}(this),scroll:function(a){return function(b){a.updateScrollValues(),a.isBeingDragged||(a.iOSNativeScrolling||(a.sliderY=a.sliderTop,a.setOnScrollStyles()),null!=b&&(a.contentScrollTop>=a.maxScrollTop?(a.options.preventPageScrolling&&a.preventScrolling(b,g),a.prevScrollTop!==a.maxScrollTop&&a.$el.trigger("scrollend")):0===a.contentScrollTop&&(a.options.preventPageScrolling&&a.preventScrolling(b,w),0!==a.prevScrollTop&&a.$el.trigger("scrolltop"))))}}(this),wheel:function(a){return function(b){var c;if(null!=b)return c=b.delta||b.wheelDelta||b.originalEvent&&b.originalEvent.wheelDelta||-b.detail||b.originalEvent&&-b.originalEvent.detail,c&&(a.sliderY+=-c/3),a.scroll(),!1}}(this),enter:function(a){return function(b){var c;if(a.isBeingDragged)return 1!==(b.buttons||b.which)?(c=a.events)[w].apply(c,arguments):void 0}}(this)}},j.prototype.addEvents=function(){var a;this.removeEvents(),a=this.events,this.options.disableResize||this.win.bind(s,a[s]),this.iOSNativeScrolling||(this.slider.bind(l,a[g]),this.pane.bind(l,a[r]).bind(""+p+" "+f,a[x])),this.$content.bind(""+t+" "+p+" "+f+" "+v,a[t])},j.prototype.removeEvents=function(){var a;a=this.events,this.win.unbind(s,a[s]),this.iOSNativeScrolling||(this.slider.unbind(),this.pane.unbind()),this.$content.unbind(""+t+" "+p+" "+f+" "+v,a[t])},j.prototype.generate=function(){var a,c,d,f,g,h,i;return f=this.options,h=f.paneClass,i=f.sliderClass,a=f.contentClass,(g=this.$el.children("."+h)).length||g.children("."+i).length||this.$el.append('<div class="'+h+'"><div class="'+i+'" /></div>'),this.pane=this.$el.children("."+h),this.slider=this.pane.find("."+i),0===e&&C()?(d=b.getComputedStyle(this.content,null).getPropertyValue("padding-right").replace(/[^0-9.]+/g,""),c={right:-14,paddingRight:+d+14}):e&&(c={right:-e},this.$el.addClass("has-scrollbar")),null!=c&&this.$content.css(c),this},j.prototype.restore=function(){this.stopped=!1,this.iOSNativeScrolling||this.pane.show(),this.addEvents()},j.prototype.reset=function(){var a,b,c,f,g,h,i,j,k,l,m,n;return this.iOSNativeScrolling?void(this.contentHeight=this.content.scrollHeight):(this.$el.find("."+this.options.paneClass).length||this.generate().stop(),this.stopped&&this.restore(),a=this.content,f=a.style,g=f.overflowY,d&&this.$content.css({height:this.$content.height()}),b=a.scrollHeight+e,l=parseInt(this.$el.css("max-height"),10),l>0&&(this.$el.height(""),this.$el.height(a.scrollHeight>l?l:a.scrollHeight)),i=this.pane.outerHeight(!1),k=parseInt(this.pane.css("top"),10),h=parseInt(this.pane.css("bottom"),10),j=i+k+h,n=Math.round(j/b*j),n<this.options.sliderMinHeight?n=this.options.sliderMinHeight:null!=this.options.sliderMaxHeight&&n>this.options.sliderMaxHeight&&(n=this.options.sliderMaxHeight),g===t&&f.overflowX!==t&&(n+=e),this.maxSliderTop=j-n,this.contentHeight=b,this.paneHeight=i,this.paneOuterHeight=j,this.sliderHeight=n,this.paneTop=k,this.slider.height(n),this.events.scroll(),this.pane.show(),this.isActive=!0,a.scrollHeight===a.clientHeight||this.pane.outerHeight(!0)>=a.scrollHeight&&g!==t?(this.pane.hide(),this.isActive=!1):this.el.clientHeight===a.scrollHeight&&g===t?this.slider.hide():this.slider.show(),this.pane.css({opacity:this.options.alwaysVisible?1:"",visibility:this.options.alwaysVisible?"visible":""}),c=this.$content.css("position"),("static"===c||"relative"===c)&&(m=parseInt(this.$content.css("right"),10),m&&this.$content.css({right:"",marginRight:m})),this)},j.prototype.scroll=function(){return this.isActive?(this.sliderY=Math.max(0,this.sliderY),this.sliderY=Math.min(this.maxSliderTop,this.sliderY),this.$content.scrollTop(this.maxScrollTop*this.sliderY/this.maxSliderTop),this.iOSNativeScrolling||(this.updateScrollValues(),this.setOnScrollStyles()),this):void 0},j.prototype.scrollBottom=function(a){return this.isActive?(this.$content.scrollTop(this.contentHeight-this.$content.height()-a).trigger(p),this.stop().restore(),this):void 0},j.prototype.scrollTop=function(a){return this.isActive?(this.$content.scrollTop(+a).trigger(p),this.stop().restore(),this):void 0},j.prototype.scrollTo=function(a){return this.isActive?(this.scrollTop(this.$el.find(a).get(0).offsetTop),this):void 0},j.prototype.stop=function(){return y&&this.scrollRAF&&(y(this.scrollRAF),this.scrollRAF=null),this.stopped=!0,this.removeEvents(),this.iOSNativeScrolling||this.pane.hide(),this},j.prototype.destroy=function(){return this.stopped||this.stop(),!this.iOSNativeScrolling&&this.pane.length&&this.pane.remove(),d&&this.$content.height(""),this.$content.removeAttr("tabindex"),this.$el.hasClass("has-scrollbar")&&(this.$el.removeClass("has-scrollbar"),this.$content.css({right:""})),this},j.prototype.flash=function(){return!this.iOSNativeScrolling&&this.isActive?(this.reset(),this.pane.addClass("flashed"),setTimeout(function(a){return function(){a.pane.removeClass("flashed")}}(this),this.options.flashDelay),this):void 0},j}(),a.fn.nanoScroller=function(b){return this.each(function(){var c,d;if((d=this.nanoscroller)||(c=a.extend({},z,b),this.nanoscroller=d=new q(this,c)),b&&"object"==typeof b){if(a.extend(d.options,b),null!=b.scrollBottom)return d.scrollBottom(b.scrollBottom);if(null!=b.scrollTop)return d.scrollTop(b.scrollTop);if(b.scrollTo)return d.scrollTo(b.scrollTo);if("bottom"===b.scroll)return d.scrollBottom(0);if("top"===b.scroll)return d.scrollTop(0);if(b.scroll&&b.scroll instanceof a)return d.scrollTo(b.scroll);if(b.stop)return d.stop();if(b.destroy)return d.destroy();if(b.flash)return d.flash()}return d.reset()})},a.fn.nanoScroller.Constructor=q}(jQuery,window,document);

/*! expand */
/*
(function(e){e.fn.expandAll=function(t){var n="1.3.8.3";var r=e.extend({},e.fn.expandAll.defaults,t);return this.each(function(t){function d(t){for(var n=0,r=arguments.length;n<r;n++){var i=arguments[n],s=e(i);if(s.scrollTop()>0){return i}else{s.scrollTop(1);var o=s.scrollTop()>0;s.scrollTop(0);if(o){return i}}}return[]}var n=e(this),i,s,u,a,f,l,c;r.switchPosition=="before"?(e.fn.findSibling=e.fn.prev,e.fn.insrt=e.fn.before):(e.fn.findSibling=e.fn.next,e.fn.insrt=e.fn.after);if(this.id.length){f="#"+this.id}else if(this.className.length){f=this.tagName.toLowerCase()+"."+this.className.split(" ").join(".")}else{f=this.tagName.toLowerCase()}if(r.ref&&n.find(r.ref).length){r.switchPosition=="before"?i=n.find(r.ref).filter(":first"):i=n.find(r.ref).filter(":last")}else{return}if(r.cllpsLength&&n.closest(f).find(r.cllpsEl).text().length<r.cllpsLength){n.closest(f).find(r.cllpsEl).addClass("dont_touch");return}r.initTxt=="show"?(l=r.expTxt,c=""):(l=r.cllpsTxt,c="open");if(r.state=="hidden"){n.find(r.cllpsEl+":not(.shown, .dont_touch)").hide().findSibling().find("> a.open").removeClass("open").data("state",0)}else{n.find(r.cllpsEl).show().findSibling().find("> a").addClass("open").data("state",1)}r.oneSwitch?i.insrt('<p class="switch"><a href="#" class="'+c+'">'+l+"</a></p>"):i.insrt('<p class="switch"><a href="#" class="">'+r.expTxt+'</a>&nbsp;|&nbsp;<a href="#" class="open">'+r.cllpsTxt+"</a></p>");s=i.findSibling("p").find("a");u=n.closest(f).find(r.cllpsEl).not(".dont_touch");a=r.trigger?n.closest(f).find(r.trigger+" > a"):n.closest(f).find(".expand > a");if(r.child){n.find(r.cllpsEl+".shown").show().findSibling().find("> a").addClass("open").text(r.cllpsTxt);window.$vrbls={kt1:r.expTxt,kt2:r.cllpsTxt}}var h;typeof d=="function"?h=d("html","body"):h="html, body";s.click(function(){var t=e(this),n=t.closest(f).find(r.cllpsEl).filter(":first"),i=n.offset().top-r.offset;if(r.parent){var s=t.parent().nextAll().children("p.switch").find("a");kidTxt1=$vrbls.kt1,kidTxt2=$vrbls.kt2,kidTxt=t.text()==r.expTxt?kidTxt2:kidTxt1;s.text(kidTxt);if(t.text()==r.expTxt){s.addClass("open")}else{s.removeClass("open")}}if(t.text()==r.expTxt){if(r.oneSwitch){t.text(r.cllpsTxt).attr("class","open")}a.addClass("open").data("state",1);u[r.showMethod](r.speed)}else{if(r.oneSwitch){t.text(r.expTxt).attr("class","")}a.removeClass("open").data("state",0);if(r.speed==0||r.instantHide){u.hide()}else{u[r.hideMethod](r.speed)}if(r.scroll&&i<e(window).scrollTop()){e(h).animate({scrollTop:i},600)}}return false});if(r.localLinks){var p=e(f).find(r.localLinks);if(p.length){e(p).click(function(){var t=e(this.hash);t=t.length&&t||e("[name="+this.hash.slice(1)+"]");if(t.length){var n=t.offset().top;e(h).animate({scrollTop:n},600);return false}})}}})};e.fn.expandAll.defaults={state:"hidden",initTxt:"show",expTxt:"[Expand All]",cllpsTxt:"[Collapse All]",oneSwitch:true,ref:".expand",switchPosition:"before",scroll:false,offset:20,showMethod:"slideDown",hideMethod:"slideUp",speed:600,cllpsEl:".collapse",trigger:".expand",localLinks:null,parent:false,child:false,cllpsLength:null,instantHide:false};e.fn.toggler=function(t){var n=e.extend({},e.fn.toggler.defaults,t);var r=e(this);r.wrapInner('<a style="display:block" href="#" title="Expand/Collapse" />');if(n.initShow){e(n.initShow).addClass("shown")}r.next(n.cllpsEl+":not(.shown)").hide();return this.each(function(){var t;n.container?t=n.container:t="html";if(r.next("div.shown").length){r.closest(t).find(".shown").show().prev().find("a").addClass("open")}e(this).click(function(){e(this).find("a").toggleClass("open").end().next(n.cllpsEl)[n.method](n.speed);return false})})};e.fn.toggler.defaults={cllpsEl:"div.collapse",method:"slideToggle",speed:"slow",container:"",initShow:".shown"};var t=false;if(typeof window.attachEvent!="undefined"){t=true}e.fn.fadeToggle=function(e,n){return this.animate({opacity:"toggle"},e,function(){if(t){this.style.removeAttribute("filter")}if(jQuery.isFunction(n)){n()}})};e.fn.slideFadeToggle=function(e,n,r){return this.animate({opacity:"toggle",height:"toggle"},e,n,function(){if(t){this.style.removeAttribute("filter")}if(jQuery.isFunction(r)){r()}})};e.fn.slideFadeDown=function(e,n){return this.animate({opacity:"show",height:"show"},e,function(){if(t){this.style.removeAttribute("filter")}if(jQuery.isFunction(n)){n()}})};e.fn.slideFadeUp=function(e,n){return this.animate({opacity:"hide",height:"hide"},e,function(){if(t){this.style.removeAttribute("filter")}if(jQuery.isFunction(n)){n()}})}})(jQuery);
*/

//function Countdown(options) {
//    var timer,
//    instance = this,
//    seconds = --options.seconds || 10,
//    updateStatus = options.onUpdateStatus || function () {},
//    counterEnd = options.onCounterEnd || function () {};
//
//    function decrementCounter() {
//        updateStatus(seconds);
//        if (seconds == 0) {
//            counterEnd();
//            instance.stop();
//        }
//        seconds--;
//    }
//
//    this.start = function () {
//        clearInterval(timer);
//        timer = 0;
//        timer = setInterval(decrementCounter, 1000);
//    };
//
//    this.stop = function () {
//        clearInterval(timer);
//    };
//}
