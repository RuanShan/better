module NumberFormatting
  extend ActiveSupport::Concern

  class_methods do
    def last_digits(number)
      number.to_s.length <= 4 ? number : number.to_s.slice(-4..-1)
    end

    def mask(number)
      "**#{last_digits(number)}"
    end
  end

  # This method is used to format numerical information pertaining to credit cards.
  #
  #   format(2005, :two_digits)  # => "05"
  #   format(05,   :four_digits) # => "0005"
  def format(number, option)
    return '' if number.blank?

    case option
      when :two_digits  ; sprintf("%.2i", number.to_i)[-2..-1]
      when :four_digits ; sprintf("%.4i", number.to_i)[-4..-1]
      else number
    end
  end
end
