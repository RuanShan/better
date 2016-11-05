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

ActiveRecord::Schema.define(version: 20161023090958) do

  create_table "administrators", force: :cascade do |t|
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
    t.index ["email"], name: "index_administrators_on_email", unique: true
    t.index ["reset_password_token"], name: "index_administrators_on_reset_password_token", unique: true
  end

  create_table "bids", force: :cascade do |t|
    t.integer  "game_round_id"
    t.integer  "user_id"
    t.string   "number"
    t.decimal  "amount"
    t.decimal  "rate"
    t.integer  "state",         default: 0, null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["game_round_id"], name: "index_bids_on_game_round_id"
    t.index ["user_id"], name: "index_bids_on_user_id"
  end

  create_table "broker_days", force: :cascade do |t|
    t.integer  "broker_id"
    t.date     "effective_on"
    t.integer  "clink_visits",           default: 0, null: false
    t.integer  "blink_visits",           default: 0, null: false
    t.integer  "member_count",           default: 0, null: false
    t.integer  "valuable_member_count",  default: 0, null: false
    t.integer  "energetic_member_count", default: 0, null: false
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.index ["broker_id", "effective_on"], name: "index_broker_days_on_broker_id_and_effective_on"
    t.index ["broker_id"], name: "index_broker_days_on_broker_id"
  end

  create_table "broker_months", force: :cascade do |t|
    t.integer  "broker_id"
    t.date     "effective_on"
    t.integer  "clink_visits",           default: 0, null: false
    t.integer  "blink_visits",           default: 0, null: false
    t.integer  "member_count",           default: 0, null: false
    t.integer  "valuable_member_count",  default: 0, null: false
    t.integer  "energetic_member_count", default: 0, null: false
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.index ["broker_id", "effective_on"], name: "index_broker_months_on_broker_id_and_effective_on"
    t.index ["broker_id"], name: "index_broker_months_on_broker_id"
  end

  create_table "brokers", force: :cascade do |t|
    t.integer  "parent_id"
    t.integer  "lft",                                 null: false
    t.integer  "rgt",                                 null: false
    t.integer  "depth",                  default: 0,  null: false
    t.integer  "children_count",         default: 0,  null: false
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
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",        default: 0,  null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "nickname"
    t.string   "number",                              null: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit"
    t.string   "invited_by_type"
    t.integer  "invited_by_id"
    t.integer  "invitations_count",      default: 0
    t.index ["email"], name: "index_brokers_on_email", unique: true
    t.index ["invitation_token"], name: "index_brokers_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_brokers_on_invitations_count"
    t.index ["invited_by_id"], name: "index_brokers_on_invited_by_id"
    t.index ["lft"], name: "index_brokers_on_lft"
    t.index ["number"], name: "index_brokers_on_number"
    t.index ["parent_id"], name: "index_brokers_on_parent_id"
    t.index ["reset_password_token"], name: "index_brokers_on_reset_password_token", unique: true
    t.index ["rgt"], name: "index_brokers_on_rgt"
    t.index ["unlock_token"], name: "index_brokers_on_unlock_token", unique: true
  end

  create_table "deposits", force: :cascade do |t|
    t.integer  "payment_method_id"
    t.integer  "user_id"
    t.string   "number"
    t.string   "currency"
    t.decimal  "amount",                       default: "0.0", null: false
    t.string   "state",             limit: 12
    t.string   "memo"
    t.string   "promotion_number"
    t.datetime "completed_at"
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.index ["number"], name: "index_deposits_on_number"
    t.index ["payment_method_id"], name: "index_deposits_on_payment_method_id"
    t.index ["user_id", "created_at"], name: "index_deposits_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_deposits_on_user_id"
  end

  create_table "drawings", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "user_bank_id"
    t.string   "number"
    t.decimal  "amount"
    t.string   "state",        limit: 12
    t.datetime "completed_at"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.index ["user_bank_id"], name: "index_drawings_on_user_bank_id"
    t.index ["user_id", "created_at"], name: "index_drawings_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_drawings_on_user_id"
  end

  create_table "exchange_rates", force: :cascade do |t|
    t.string   "code"
    t.string   "name"
    t.decimal  "rate"
    t.decimal  "withdraw_rate",   default: "1.0", null: false
    t.decimal  "deposit_rate",    default: "1.0", null: false
    t.decimal  "withdraw_factor", default: "1.0", null: false
    t.decimal  "deposit_factor",  default: "1.0", null: false
    t.string   "params",          default: "",    null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  create_table "game_centers", force: :cascade do |t|
    t.boolean  "is_master",   default: false
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.index ["name"], name: "index_game_centers_on_name", unique: true
  end

  create_table "game_rounds", force: :cascade do |t|
    t.integer  "game_id"
    t.decimal  "paramd1"
    t.decimal  "paramd2"
    t.decimal  "paramd3"
    t.decimal  "paramd4"
    t.decimal  "paramd5"
    t.decimal  "paramd6"
    t.decimal  "paramd7"
    t.decimal  "paramd8"
    t.decimal  "paramd9"
    t.decimal  "paramd10"
    t.decimal  "paramd11"
    t.decimal  "paramd12"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_game_rounds_on_game_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer  "game_center_id", default: 0, null: false
    t.string   "slug"
    t.string   "name"
    t.text     "description"
    t.integer  "state",          default: 0, null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "messages", force: :cascade do |t|
    t.string   "title",      null: false
    t.text     "content",    null: false
    t.integer  "user_id"
    t.integer  "state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "payment_methods", force: :cascade do |t|
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

  create_table "promotions", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.string   "number"
    t.integer  "rule",        default: 0,     null: false
    t.decimal  "factor1",     default: "0.0", null: false
    t.decimal  "factor2",     default: "0.0", null: false
    t.decimal  "factor3",     default: "0.0", null: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.index ["name"], name: "index_promotions_on_name", unique: true
  end

  create_table "settings", force: :cascade do |t|
    t.string   "site_name"
    t.string   "company_name"
    t.string   "contact_email"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "store_credits", force: :cascade do |t|
    t.integer  "user_id"
    t.decimal  "amount",          precision: 8, scale: 2, default: "0.0", null: false
    t.string   "memo"
    t.datetime "deleted_at"
    t.integer  "originator_id"
    t.string   "originator_type"
    t.datetime "created_at",                                              null: false
    t.datetime "updated_at",                                              null: false
    t.index ["deleted_at"], name: "index_store_credits_on_deleted_at"
    t.index ["originator_id", "originator_type"], name: "store_credits_originator"
    t.index ["user_id"], name: "index_store_credits_on_user_id"
  end

  create_table "transfers", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "from_game_center_id"
    t.integer  "to_game_center_id"
    t.string   "number"
    t.decimal  "amount",                         default: "0.0", null: false
    t.string   "machine_state",       limit: 12
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.index ["from_game_center_id"], name: "index_transfers_on_from_game_center_id"
    t.index ["to_game_center_id"], name: "index_transfers_on_to_game_center_id"
    t.index ["user_id"], name: "index_transfers_on_user_id"
  end

  create_table "user_banks", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name",        default: "", null: false
    t.string   "card_number", default: "", null: false
    t.string   "branch_name", default: "", null: false
    t.string   "address",     default: "", null: false
    t.integer  "state",       default: 0,  null: false
    t.datetime "deleted_at"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.index ["deleted_at"], name: "index_user_banks_on_deleted_at"
    t.index ["user_id"], name: "index_user_banks_on_user_id"
  end

  create_table "user_days", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "broker_id"
    t.date     "effective_on"
    t.decimal  "deposit_amount",   default: "0.0", null: false
    t.decimal  "drawing_amount",   default: "0.0", null: false
    t.decimal  "bid_amount",       default: "0.0", null: false
    t.decimal  "bonus",            default: "0.0", null: false
    t.decimal  "profit",           default: "0.0", null: false
    t.decimal  "balance",          default: "0.0", null: false
    t.decimal  "bank_charges",     default: "0.0", null: false
    t.decimal  "platform_charges", default: "0.0", null: false
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["broker_id"], name: "index_user_days_on_broker_id"
    t.index ["user_id", "broker_id", "effective_on"], name: "index_user_days_on_user_id_and_broker_id_and_effective_on"
    t.index ["user_id", "effective_on"], name: "index_user_days_on_user_id_and_effective_on"
    t.index ["user_id"], name: "index_user_days_on_user_id"
  end

  create_table "user_lives", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "broker_id"
    t.date     "effective_on"
    t.decimal  "deposit_amount", default: "0.0", null: false
    t.decimal  "drawing_amount", default: "0.0", null: false
    t.decimal  "bonus",          default: "0.0", null: false
    t.decimal  "bid_amount",     default: "0.0", null: false
    t.decimal  "profit",         default: "0.0", null: false
    t.decimal  "balance",        default: "0.0", null: false
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.index ["broker_id"], name: "index_user_lives_on_broker_id"
    t.index ["user_id", "broker_id", "effective_on"], name: "index_user_lives_on_user_id_and_broker_id_and_effective_on"
    t.index ["user_id", "effective_on"], name: "index_user_lives_on_user_id_and_effective_on"
    t.index ["user_id"], name: "index_user_lives_on_user_id"
  end

  create_table "user_messages", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "message_id"
    t.integer  "state",      default: 0, null: false
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["message_id"], name: "index_user_messages_on_message_id"
    t.index ["user_id"], name: "index_user_messages_on_user_id"
  end

  create_table "user_months", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "broker_id"
    t.date     "effective_on"
    t.decimal  "deposit_amount",   default: "0.0", null: false
    t.decimal  "drawing_amount",   default: "0.0", null: false
    t.decimal  "bid_amount",       default: "0.0", null: false
    t.decimal  "bonus",            default: "0.0", null: false
    t.decimal  "profit",           default: "0.0", null: false
    t.decimal  "balance",          default: "0.0", null: false
    t.decimal  "bank_charges",     default: "0.0", null: false
    t.decimal  "platform_charges", default: "0.0", null: false
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["broker_id"], name: "index_user_months_on_broker_id"
    t.index ["user_id", "broker_id", "effective_on"], name: "index_user_months_on_user_id_and_broker_id_and_effective_on"
    t.index ["user_id", "effective_on"], name: "index_user_months_on_user_id_and_effective_on"
    t.index ["user_id"], name: "index_user_months_on_user_id"
  end

  create_table "users", force: :cascade do |t|
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
    t.integer  "failed_attempts",          default: 0,  null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "nickname"
    t.integer  "gender",                   default: 0,  null: false
    t.string   "phone",                    default: "", null: false
    t.string   "qq",                       default: "", null: false
    t.string   "pp_question",              default: "", null: false
    t.string   "pp_answer",                default: "", null: false
    t.string   "real_name"
    t.integer  "id_type",                  default: 0,  null: false
    t.string   "id_number"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "role"
    t.string   "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit"
    t.string   "invited_by_type"
    t.integer  "invited_by_id"
    t.integer  "invitations_count",        default: 0
    t.integer  "broker_id"
    t.index ["broker_id", "created_at"], name: "index_users_on_broker_id_and_created_at"
    t.index ["broker_id"], name: "index_users_on_broker_id"
    t.index ["created_at"], name: "index_users_on_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "wallets", force: :cascade do |t|
    t.integer  "user_id"
    t.decimal  "amount"
    t.string   "memo"
    t.datetime "deleted_at"
    t.integer  "originator_id"
    t.string   "originator_type"
    t.boolean  "is_bonus",        default: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["deleted_at"], name: "index_wallets_on_deleted_at"
    t.index ["originator_id", "originator_type"], name: "wallets_originator"
    t.index ["user_id"], name: "index_wallets_on_user_id"
  end

end
