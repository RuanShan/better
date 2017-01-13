module BetterDateScope

  # sample
  # add_better_date_scopes( created_at: :today)
  def better_date_time_scope( args = {})
      args.each_pair do |field_name, timespans|
        timespans = [timespans] unless timespans.is_a? Array
        class_eval do
          scope :in_day, ->(datetime){ where( ["#{field_name}>? and #{field_name}<?",  datetime.beginning_of_day, datetime.end_of_day] )}
          scope :in_days, ->(from_datetime, days ){ where( ["#{field_name}>? and #{field_name}<?", datetime.end_of_day.advance( days: days), datetime.end_of_day ] )}
          scope :in_month, ->(datetime){ where( ["#{field_name}>? and #{field_name}<?", beginning_of_month(datetime), end_of_month(datetime)] )}

          timespans.each{|span|
            case span
            when :today
              scope :today, ->{ in_day( DateTime.current ) }
            when :week
              scope :week, ->{ in_days( DateTime.current, 7 ) }
            when :month
              scope :month, ->{ in_month( DateTime.current ) }
            when :before_today
              scope :before_today, ->{ where( [" #{field_name}<?",  DateTime.current.beginning_of_day] ) }
            end
          }
        end
      end
  end

  def better_date_scope( args = {})
    args.each_pair do |field_name, dates|
      dates = [dates] unless dates.is_a? Array
      class_eval do
        scope :on_date, ->(date){ where( field_name => date )}
        scope :between_dates, ->(from_date, to_date){ where( ["#{field_name}>=? AND #{field_name}<=?", from_date, to_date] )}
        scope :before_date, ->(date){ where(["#{field_name}<=?",date])}

        dates.each{|some_date|
          case some_date
          when :today
            scope :today, ->{ on_date( DateTime.current.to_date ) }
          when :yesterday
            scope :yesterday, ->{ on_date( DateTime.current.yesterday.to_date ) }
          when :ten_days
            scope :ten_days, ->{ between_dates(  DateTime.current.advance(days: -10).to_date, DateTime.current.to_date ) }
          end
        }
      end
    end
  end

  def better_month_scope( args = {})
    args.each_pair do |field_name, dates|
      dates = [dates] unless dates.is_a? Array
      class_eval do
        scope :in_month, ->(date){ where( field_name => date )}
        scope :between_months, ->(from_date, to_date){ where( ["#{field_name}>=? AND #{field_name}<=?", from_date, to_date] )}

        dates.each{|some_date|
          case some_date
          when :current_month
            scope :current_month, ->{ in_month( beginning_of_month( DateTime.current )) }
          when :last_month
            scope :last_month, ->{ in_month( beginning_of_month( DateTime.current.advance(months: -1) )) }
          end
        }
      end
    end
  end


  def beginning_of_month( datetime )
    DateTime.civil_from_format( :local, datetime.year, datetime.month, 1 ).to_date
  end

  def end_of_month( datetime )
    beginning_of_month( datetime ).advance( months: 1 )
  end

end
