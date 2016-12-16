  module DisplayDateTime
    ##
    # Takes a list of methods that the base object wants to be able to use
    # to display with Spree::Money, and turns them into display_* methods.
    # Intended to help clean up some of the presentational logic that exists
    # at the model layer.
    #
    #
    # ==== Examples
    # Decorate a method, with the default option of using the base object's
    # currency
    #
    #     extend Spree::DisplayDateTime
    #     date_time_methods :created_at, :charged_at
    #
    # Decorate a method, but with some additional options
    #     extend Spree::DisplayDateTime
    #     date_time_methods created_at: { currency: "CAD", no_cents: true }
    def date_time_methods(*args)
      args.each do |money_method|
        money_method = { money_method => {} } unless money_method.is_a? Hash
        money_method.each do |method_name, opts|
          define_method("display_#{method_name}") do
            default_opts = { format: :better }
            I18n.l( send(method_name), default_opts.merge( opts ))
          end
        end
      end
    end
  end
