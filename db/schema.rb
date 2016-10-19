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

ActiveRecord::Schema.define(version: 20161018122350) do

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

  create_table "brokers", force: :cascade do |t|
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
    t.index ["reset_password_token"], name: "index_brokers_on_reset_password_token", unique: true
  end

  create_table "deposits", force: :cascade do |t|
    t.integer  "payment_method_id"
    t.integer  "user_id"
    t.string   "number"
    t.string   "currency"
    t.decimal  "amount"
    t.integer  "state",             default: 0, null: false
    t.string   "memo"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.index ["number"], name: "index_deposits_on_number", unique: true
    t.index ["payment_method_id"], name: "index_deposits_on_payment_method_id"
    t.index ["user_id"], name: "index_deposits_on_user_id"
  end

  create_table "drawings", force: :cascade do |t|
    t.integer  "user_bank_id"
    t.string   "number"
    t.decimal  "amount"
    t.integer  "state",        default: 0, null: false
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.index ["user_bank_id"], name: "index_drawings_on_user_bank_id"
  end

  create_table "exchange_rates", force: :cascade do |t|
    t.decimal  "withdraw_rate",   default: "1.0", null: false
    t.decimal  "deposit_rate",    default: "1.0", null: false
    t.decimal  "withdraw_factor", default: "1.0", null: false
    t.decimal  "deposit_factor",  default: "1.0", null: false
    t.string   "params",          default: "",    null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  create_table "game_centers", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["name"], name: "index_game_centers_on_name", unique: true
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
    t.string   "name"
    t.string   "merchant"
    t.string   "pid",        default: "",    null: false
    t.string   "key",        default: "",    null: false
    t.integer  "state",      default: 0,     null: false
    t.boolean  "enabled",    default: false, null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "promotions", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.string   "code"
    t.integer  "rule",        default: 0, null: false
    t.integer  "factor1"
    t.integer  "factor2"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
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
    t.integer  "game_center_id"
    t.decimal  "amount",          precision: 8, scale: 2, default: "0.0", null: false
    t.string   "memo"
    t.datetime "deleted_at"
    t.integer  "originator_id"
    t.string   "originator_type"
    t.datetime "created_at",                                              null: false
    t.datetime "updated_at",                                              null: false
    t.index ["deleted_at"], name: "index_store_credits_on_deleted_at"
    t.index ["originator_id", "originator_type"], name: "store_credits_originator"
    t.index ["user_id", "game_center_id"], name: "index_store_credits_on_user_id_and_game_center_id"
    t.index ["user_id"], name: "index_store_credits_on_user_id"
  end

  create_table "transfers", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "from_game_center_id"
    t.integer  "to_game_center_id"
    t.string   "number"
    t.decimal  "amount"
    t.integer  "state",               default: 0, null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["from_game_center_id"], name: "index_transfers_on_from_game_center_id"
    t.index ["to_game_center_id"], name: "index_transfers_on_to_game_center_id"
    t.index ["user_id"], name: "index_transfers_on_user_id"
  end

  create_table "user_banks", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "code"
    t.integer  "country_id",  default: 1
    t.integer  "province_id", default: 2
    t.integer  "city_id",     default: 2
    t.string   "address",     default: "f", null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["user_id"], name: "index_user_banks_on_user_id"
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

  create_table "users", force: :cascade do |t|
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
    t.string   "nickname"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
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
    t.integer  "invitations_count",      default: 0
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
