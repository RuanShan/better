# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170142351704) do

  create_table "administrators", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_administrators_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_administrators_on_reset_password_token", unique: true, using: :btree
  end

  create_table "bids", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "game_round_id"
    t.integer  "user_id"
    t.string   "number"
    t.decimal  "amount",        precision: 10
    t.decimal  "rate",          precision: 10
    t.integer  "state",                                  default: 0,     null: false
    t.datetime "created_at",                                             null: false
    t.datetime "updated_at",                                             null: false
    t.integer  "highlow",                                default: 0,     null: false
    t.decimal  "last_quote",    precision: 14, scale: 6, default: "0.0", null: false
    t.string   "status"
    t.index ["game_round_id"], name: "index_bids_on_game_round_id", using: :btree
    t.index ["user_id"], name: "index_bids_on_user_id", using: :btree
  end

  create_table "deposits", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "payment_method_id"
    t.integer  "user_id"
    t.string   "number"
    t.string   "currency"
    t.decimal  "amount",                       precision: 10, default: 0,  null: false
    t.string   "state",             limit: 12
    t.string   "memo"
    t.string   "promotion_number"
    t.datetime "completed_at"
    t.string   "payment_no"
    t.string   "payment_result"
    t.datetime "created_at",                                               null: false
    t.datetime "updated_at",                                               null: false
    t.integer  "administrator_id"
    t.string   "iss_ins_cd",                                  default: "", null: false
    t.index ["administrator_id"], name: "index_deposits_on_administrator_id", using: :btree
    t.index ["number"], name: "index_deposits_on_number", using: :btree
    t.index ["payment_method_id"], name: "index_deposits_on_payment_method_id", using: :btree
    t.index ["user_id", "created_at"], name: "index_deposits_on_user_id_and_created_at", using: :btree
    t.index ["user_id"], name: "index_deposits_on_user_id", using: :btree
  end

  create_table "drawings", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.integer  "user_bank_id"
    t.string   "number"
    t.decimal  "amount",                      precision: 10
    t.string   "state",            limit: 12
    t.datetime "completed_at"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.integer  "administrator_id"
    t.index ["administrator_id"], name: "index_drawings_on_administrator_id", using: :btree
    t.index ["user_bank_id"], name: "index_drawings_on_user_bank_id", using: :btree
    t.index ["user_id", "created_at"], name: "index_drawings_on_user_id_and_created_at", using: :btree
    t.index ["user_id"], name: "index_drawings_on_user_id", using: :btree
  end

  create_table "exchange_rates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "code"
    t.string   "name"
    t.decimal  "rate",            precision: 10
    t.decimal  "withdraw_rate",   precision: 10, default: 1,  null: false
    t.decimal  "deposit_rate",    precision: 10, default: 1,  null: false
    t.decimal  "withdraw_factor", precision: 10, default: 1,  null: false
    t.decimal  "deposit_factor",  precision: 10, default: 1,  null: false
    t.string   "params",                         default: "", null: false
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
  end

  create_table "game_centers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.boolean  "is_master",                 default: false
    t.string   "name"
    t.text     "description", limit: 65535
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.index ["name"], name: "index_game_centers_on_name", unique: true, using: :btree
  end

  create_table "game_instruments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "code"
    t.string   "description"
    t.datetime "created_at",                                                        null: false
    t.datetime "updated_at",                                                        null: false
    t.integer  "category_id",                                    default: 0,        null: false
    t.boolean  "hot",                                            default: false,    null: false
    t.string   "rate",                                           default: "",       null: false
    t.decimal  "default_rate",           precision: 6, scale: 2, default: "0.7",    null: false
    t.time     "day1_open_at"
    t.time     "day1_close_at"
    t.time     "day2_open_at"
    t.time     "day2_close_at"
    t.time     "day3_open_at"
    t.time     "day3_close_at"
    t.time     "day4_open_at"
    t.time     "day4_close_at"
    t.time     "day5_open_at"
    t.time     "day5_close_at"
    t.time     "day6_open_at"
    t.time     "day6_close_at"
    t.time     "day7_open_at"
    t.time     "day7_close_at"
    t.string   "disabled_game_period",                           default: "111111", null: false
    t.integer  "scales",                                         default: 0,        null: false
    t.integer  "period5m_enabled",                               default: 1,        null: false
    t.integer  "period30s_enabled",                              default: 1,        null: false
    t.integer  "period60s_enabled",                              default: 1,        null: false
    t.integer  "period120s_enabled",                             default: 1,        null: false
    t.integer  "period300s_enabled",                             default: 1,        null: false
    t.integer  "period5m_max_price",                             default: 0,        null: false
    t.integer  "period30s_max_price",                            default: 0,        null: false
    t.integer  "period60s_max_price",                            default: 0,        null: false
    t.integer  "period120s_max_price",                           default: 0,        null: false
    t.integer  "period300s_max_price",                           default: 0,        null: false
    t.time     "day1_halftime_start_at"
    t.time     "day1_halftime_end_at"
    t.time     "day2_halftime_start_at"
    t.time     "day2_halftime_end_at"
    t.time     "day3_halftime_start_at"
    t.time     "day3_halftime_end_at"
    t.time     "day4_halftime_start_at"
    t.time     "day4_halftime_end_at"
    t.time     "day5_halftime_start_at"
    t.time     "day5_halftime_end_at"
    t.time     "day6_halftime_start_at"
    t.time     "day6_halftime_end_at"
    t.time     "day7_halftime_start_at"
    t.time     "day7_halftime_end_at"
  end

  create_table "game_rounds", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "game_id"
    t.decimal  "paramd1",               precision: 10
    t.decimal  "paramd2",               precision: 10
    t.decimal  "paramd3",               precision: 10
    t.decimal  "paramd4",               precision: 10
    t.decimal  "paramd5",               precision: 10
    t.decimal  "paramd6",               precision: 10
    t.decimal  "paramd7",               precision: 10
    t.decimal  "paramd8",               precision: 10
    t.decimal  "paramd9",               precision: 10
    t.decimal  "paramd10",              precision: 10
    t.decimal  "paramd11",              precision: 10
    t.decimal  "paramd12",              precision: 10
    t.datetime "created_at",                                                     null: false
    t.datetime "updated_at",                                                     null: false
    t.integer  "instrument_id"
    t.string   "instrument_code"
    t.datetime "start_at"
    t.integer  "period",                                         default: 0,     null: false
    t.decimal  "instrument_quote",      precision: 14, scale: 6, default: "0.0", null: false
    t.string   "state"
    t.datetime "end_at"
    t.decimal  "instrument_hack_quote", precision: 14, scale: 6, default: "0.0", null: false
    t.integer  "custom_highlow",                                 default: 0,     null: false
    t.index ["game_id"], name: "index_game_rounds_on_game_id", using: :btree
    t.index ["instrument_id"], name: "index_game_rounds_on_instrument_id", using: :btree
    t.index ["instrument_quote", "state", "end_at"], name: "index_game_rounds_on_instrument_quote_and_state_and_end_at", using: :btree
  end

  create_table "games", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "game_center_id",               default: 0, null: false
    t.string   "slug"
    t.string   "name"
    t.text     "description",    limit: 65535
    t.integer  "state",                        default: 0, null: false
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "rule",                         default: 0, null: false
  end

  create_table "messages", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "title",                                      null: false
    t.text     "content",          limit: 65535,             null: false
    t.integer  "administrator_id"
    t.integer  "message_type",                   default: 0, null: false
    t.integer  "state",                          default: 0, null: false
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.index ["administrator_id"], name: "index_messages_on_administrator_id", using: :btree
  end

  create_table "payment_methods", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "type"
    t.string   "name"
    t.string   "merchant"
    t.string   "pid",           default: "",    null: false
    t.string   "key",           default: "",    null: false
    t.string   "payee_name"
    t.string   "payee_address"
    t.string   "payee_account"
    t.integer  "state",         default: 0,     null: false
    t.boolean  "enabled",       default: false, null: false
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  create_table "promotions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "description"
    t.string   "number"
    t.integer  "rule",                            default: 0, null: false
    t.decimal  "factor1",          precision: 10, default: 0, null: false
    t.decimal  "factor2",          precision: 10, default: 0, null: false
    t.decimal  "factor3",          precision: 10, default: 0, null: false
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.integer  "administrator_id"
    t.index ["administrator_id"], name: "index_promotions_on_administrator_id", using: :btree
    t.index ["name"], name: "index_promotions_on_name", unique: true, using: :btree
  end

  create_table "sale_days", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "seller_type"
    t.integer  "seller_id"
    t.date     "effective_on"
    t.integer  "clink_visits",           default: 0, null: false
    t.integer  "blink_visits",           default: 0, null: false
    t.integer  "member_count",           default: 0, null: false
    t.integer  "valuable_member_count",  default: 0, null: false
    t.integer  "energetic_member_count", default: 0, null: false
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.index ["seller_id", "effective_on"], name: "index_sale_days_on_seller_id_and_effective_on", using: :btree
    t.index ["seller_type", "seller_id"], name: "index_sale_days_on_seller_type_and_seller_id", using: :btree
  end

  create_table "sale_months", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "seller_type"
    t.integer  "seller_id"
    t.date     "effective_on"
    t.integer  "clink_visits",           default: 0, null: false
    t.integer  "blink_visits",           default: 0, null: false
    t.integer  "member_count",           default: 0, null: false
    t.integer  "valuable_member_count",  default: 0, null: false
    t.integer  "energetic_member_count", default: 0, null: false
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.index ["seller_id", "effective_on"], name: "index_sale_months_on_seller_id_and_effective_on", using: :btree
    t.index ["seller_type", "seller_id"], name: "index_sale_months_on_seller_type_and_seller_id", using: :btree
  end

  create_table "settings", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "site_name"
    t.string   "company_name"
    t.string   "contact_email"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "store_credits", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.decimal  "amount",          precision: 8, scale: 2, default: "0.0", null: false
    t.string   "memo"
    t.datetime "deleted_at"
    t.integer  "originator_id"
    t.string   "originator_type"
    t.datetime "created_at",                                              null: false
    t.datetime "updated_at",                                              null: false
    t.index ["deleted_at"], name: "index_store_credits_on_deleted_at", using: :btree
    t.index ["originator_id", "originator_type"], name: "store_credits_originator", using: :btree
    t.index ["user_id"], name: "index_store_credits_on_user_id", using: :btree
  end

  create_table "transfers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.integer  "from_game_center_id"
    t.integer  "to_game_center_id"
    t.string   "number"
    t.decimal  "amount",                         precision: 10, default: 0, null: false
    t.string   "machine_state",       limit: 12
    t.datetime "created_at",                                                null: false
    t.datetime "updated_at",                                                null: false
    t.index ["from_game_center_id"], name: "index_transfers_on_from_game_center_id", using: :btree
    t.index ["to_game_center_id"], name: "index_transfers_on_to_game_center_id", using: :btree
    t.index ["user_id"], name: "index_transfers_on_user_id", using: :btree
  end

  create_table "user_banks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.string   "name",                    default: "", null: false
    t.string   "card_number",             default: "", null: false
    t.string   "branch_name",             default: "", null: false
    t.string   "address",                 default: "", null: false
    t.integer  "payment_method_id"
    t.string   "payee",                   default: "", null: false
    t.string   "pay_memo",                default: "", null: false
    t.integer  "state",                   default: 0,  null: false
    t.datetime "deleted_at"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.string   "card_front_file_name"
    t.string   "card_front_content_type"
    t.integer  "card_front_file_size"
    t.datetime "card_front_updated_at"
    t.string   "card_back_file_name"
    t.string   "card_back_content_type"
    t.integer  "card_back_file_size"
    t.datetime "card_back_updated_at"
    t.index ["deleted_at"], name: "index_user_banks_on_deleted_at", using: :btree
    t.index ["user_id"], name: "index_user_banks_on_user_id", using: :btree
  end

  create_table "user_days", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.integer  "broker_id"
    t.date     "effective_on"
    t.decimal  "deposit_amount",   precision: 10, default: 0, null: false
    t.decimal  "drawing_amount",   precision: 10, default: 0, null: false
    t.decimal  "bid_amount",       precision: 10, default: 0, null: false
    t.decimal  "bonus",            precision: 10, default: 0, null: false
    t.decimal  "profit",           precision: 10, default: 0, null: false
    t.decimal  "balance",          precision: 10, default: 0, null: false
    t.decimal  "bank_charges",     precision: 10, default: 0, null: false
    t.decimal  "platform_charges", precision: 10, default: 0, null: false
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.index ["broker_id"], name: "index_user_days_on_broker_id", using: :btree
    t.index ["user_id", "broker_id", "effective_on"], name: "index_user_days_on_user_id_and_broker_id_and_effective_on", using: :btree
    t.index ["user_id", "effective_on"], name: "index_user_days_on_user_id_and_effective_on", using: :btree
    t.index ["user_id"], name: "index_user_days_on_user_id", using: :btree
  end

  create_table "user_lives", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.integer  "broker_id"
    t.date     "effective_on"
    t.decimal  "deposit_amount", precision: 10, default: 0, null: false
    t.decimal  "drawing_amount", precision: 10, default: 0, null: false
    t.decimal  "bonus",          precision: 10, default: 0, null: false
    t.decimal  "bid_amount",     precision: 10, default: 0, null: false
    t.decimal  "profit",         precision: 10, default: 0, null: false
    t.decimal  "balance",        precision: 10, default: 0, null: false
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.index ["broker_id"], name: "index_user_lives_on_broker_id", using: :btree
    t.index ["user_id", "broker_id", "effective_on"], name: "index_user_lives_on_user_id_and_broker_id_and_effective_on", using: :btree
    t.index ["user_id", "effective_on"], name: "index_user_lives_on_user_id_and_effective_on", using: :btree
    t.index ["user_id"], name: "index_user_lives_on_user_id", using: :btree
  end

  create_table "user_messages", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.integer  "message_id"
    t.integer  "state",      default: 0, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["message_id"], name: "index_user_messages_on_message_id", using: :btree
    t.index ["user_id"], name: "index_user_messages_on_user_id", using: :btree
  end

  create_table "user_months", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.integer  "broker_id"
    t.date     "effective_on"
    t.decimal  "deposit_amount",   precision: 10, default: 0, null: false
    t.decimal  "drawing_amount",   precision: 10, default: 0, null: false
    t.decimal  "bid_amount",       precision: 10, default: 0, null: false
    t.decimal  "bonus",            precision: 10, default: 0, null: false
    t.decimal  "profit",           precision: 10, default: 0, null: false
    t.decimal  "balance",          precision: 10, default: 0, null: false
    t.decimal  "bank_charges",     precision: 10, default: 0, null: false
    t.decimal  "platform_charges", precision: 10, default: 0, null: false
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.index ["broker_id"], name: "index_user_months_on_broker_id", using: :btree
    t.index ["user_id", "broker_id", "effective_on"], name: "index_user_months_on_user_id_and_broker_id_and_effective_on", using: :btree
    t.index ["user_id", "effective_on"], name: "index_user_months_on_user_id_and_effective_on", using: :btree
    t.index ["user_id"], name: "index_user_months_on_user_id", using: :btree
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "type",                                  null: false
    t.integer  "broker_id"
    t.integer  "role",                     default: 0,  null: false
    t.integer  "parent_id"
    t.integer  "lft",                                   null: false
    t.integer  "rgt",                                   null: false
    t.integer  "depth",                    default: 0,  null: false
    t.integer  "children_count",           default: 0,  null: false
    t.string   "email",                    default: "", null: false
    t.string   "encrypted_password",       default: "", null: false
    t.string   "encrypted_money_password", default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",            default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",          default: 0,  null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "nickname"
    t.string   "number",                                null: false
    t.integer  "gender",                   default: 0,  null: false
    t.string   "phone",                    default: "", null: false
    t.string   "qq",                       default: "", null: false
    t.string   "first_name"
    t.string   "last_name"
    t.date     "birthday"
    t.integer  "id_type",                  default: 0,  null: false
    t.string   "id_number"
    t.string   "country_code"
    t.string   "province"
    t.string   "city"
    t.string   "address"
    t.string   "postcode"
    t.string   "lang"
    t.string   "website"
    t.string   "pp_question",              default: "", null: false
    t.string   "pp_answer",                default: "", null: false
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit"
    t.string   "invited_by_type"
    t.integer  "invited_by_id"
    t.integer  "invitations_count",        default: 0
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string   "id_front_file_name"
    t.string   "id_front_content_type"
    t.integer  "id_front_file_size"
    t.datetime "id_front_updated_at"
    t.string   "id_back_file_name"
    t.string   "id_back_content_type"
    t.integer  "id_back_file_size"
    t.datetime "id_back_updated_at"
    t.integer  "administrator_id"
    t.datetime "deleted_at"
    t.string   "collection",               default: "", null: false
    t.index ["administrator_id"], name: "index_users_on_administrator_id", using: :btree
    t.index ["broker_id"], name: "index_users_on_broker_id", using: :btree
    t.index ["created_at"], name: "index_users_on_created_at", using: :btree
    t.index ["deleted_at", "type"], name: "index_users_on_deleted_at_and_type", using: :btree
    t.index ["deleted_at"], name: "index_users_on_deleted_at", using: :btree
    t.index ["email"], name: "index_users_on_email", using: :btree
    t.index ["id", "type"], name: "index_users_on_id_and_type", using: :btree
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true, using: :btree
    t.index ["invitations_count"], name: "index_users_on_invitations_count", using: :btree
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id", using: :btree
    t.index ["lft"], name: "index_users_on_lft", using: :btree
    t.index ["number"], name: "index_users_on_number", using: :btree
    t.index ["parent_id"], name: "index_users_on_parent_id", using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["rgt"], name: "index_users_on_rgt", using: :btree
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree
  end

  create_table "wallets", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.decimal  "amount",          precision: 10, default: 0
    t.string   "memo"
    t.datetime "deleted_at"
    t.integer  "originator_id"
    t.string   "originator_type"
    t.boolean  "is_bonus",                       default: false
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.index ["deleted_at"], name: "index_wallets_on_deleted_at", using: :btree
    t.index ["originator_id", "originator_type"], name: "wallets_originator", using: :btree
    t.index ["user_id"], name: "index_wallets_on_user_id", using: :btree
  end

  add_foreign_key "deposits", "administrators"
  add_foreign_key "deposits", "payment_methods"
  add_foreign_key "deposits", "users"
  add_foreign_key "drawings", "administrators"
  add_foreign_key "drawings", "user_banks"
  add_foreign_key "drawings", "users"
  add_foreign_key "game_rounds", "games"
  add_foreign_key "promotions", "administrators"
  add_foreign_key "transfers", "users"
  add_foreign_key "user_banks", "users"
  add_foreign_key "users", "administrators"
  add_foreign_key "wallets", "users"
end
