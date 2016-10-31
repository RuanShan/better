require "id_card.rb"
Juhe::IdCard.app_key = ENV["BETTER_JUHE_IDCARD_APPKEY"]
Juhe::Bank.verify_app_key = ENV["BETTER_JUHE_BANK_VERIFY_APPKEY"]
Juhe::Bank.info_app_key = ENV["BETTER_JUHE_BANK_INFO_APPKEY"]
