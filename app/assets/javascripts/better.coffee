# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
#= require jsuri
class window.Better
  @ready: (callback) ->
    jQuery(document).ready(callback)

    # fire ready callbacks also on turbolinks page change event
    jQuery(document).on 'page:load', ->
      callback(jQuery)

  @pathFor: (path) ->
    locationOrigin = "#{window.location.protocol}//#{window.location.hostname}" + (if window.location.port then ":#{window.location.port}" else "")
    @url("#{locationOrigin}#{path}", @url_params).toString()
  # Helper function to take a URL and add query parameters to it
  # Uses the JSUri library from here: https://github.com/derek-watson/jsUri
  # Thanks to Jake Moffat for the suggestion: https://twitter.com/jakeonrails/statuses/321776992221544449
  @url: (uri, query) ->
    if uri.path == undefined
      uri = new Uri(uri)
    if query
      $.each query, (key, value) ->
        uri.addQueryParam(key, value)
    return uri

  # This function automatically appends the API token
  # for the user to the end of any URL.
  # Immediately after, this string is then passed to jQuery.ajax.
  #
  # ajax works in two ways in jQuery:
  #
  # $.ajax("url", {settings: 'go here'})
  # or:
  # $.ajax({url: "url", settings: 'go here'})
  #
  # This function will support both of these calls.
  @ajax: (url_or_settings, settings) ->
    if (typeof(url_or_settings) == "string")
      $.ajax(Spree.url(url_or_settings).toString(), settings)
    else
      url = url_or_settings['url']
      delete url_or_settings['url']
      $.ajax(Spree.url(url).toString(), url_or_settings)

  @routes:
    my_account: @pathFor('/my/account')
    invitable_sign_up: (user_number) ->
      Better.pathFor("/invitable_sign_up/#{Better.user_number}")

  @url_params:
    {}
