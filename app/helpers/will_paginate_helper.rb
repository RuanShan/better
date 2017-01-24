module WillPaginateHelper
  class WillPaginateFullLinkRenderer < WillPaginate::ActionView::LinkRenderer
    attr_accessor :remote, :form_id

    def prepare(collection, options, template)
      @remote = options[:remote] ? options[:remote] : false
      @form_id = options[:form_id] ? options[:form_id] : ""
      super(collection, options, template)
    end

    #protected

    #def url(page)
    #  raise NotImplementedError
    #end

    private

    def link(text, target, attributes = {})
      page=1
      if target.is_a? Fixnum
        page = target
        attributes[:rel] = rel_value(target)
        target = url(target)
      end
      #add ajax support
      attributes["data-remote"] = @remote
      #if we have a form_id, use onclick to submit form
      attributes[:href] = @form_id == "" ? target : "#"
      if @form_id != ""
        attributes[:onclick] = "page_submit_form('#{form_id}','#{page}');return false;"
      end
      tag(:a, text, attributes)
    end
  end

  def full_will_paginate(collection, options = {})
    will_paginate(collection, options.merge(:renderer => WillPaginateHelper::WillPaginateFullLinkRenderer))
  end
end
