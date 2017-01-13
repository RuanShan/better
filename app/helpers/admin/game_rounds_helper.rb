module Admin::GameRoundsHelper
  def display_bids_detail( bids )
    quotes = bids.map(&:last_quote)

    amount = bids.sum(&:amount)

    quotes.sort!

    "#{amount} (#{bids.count}) [#{quotes.first}~#{quotes.last}]"
  end
end
