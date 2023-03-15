# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_03_14_221840) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "mondais", force: :cascade do |t|
    t.string "kanji"
    t.string "yomikata"
    t.bigint "study_set_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["study_set_id"], name: "index_mondais_on_study_set_id"
  end

  create_table "study_sets", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "public", default: false, null: false
    t.index ["user_id"], name: "index_study_sets_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "writing_sessions", force: :cascade do |t|
    t.bigint "study_set_id", null: false
    t.bigint "user_id", null: false
    t.integer "answered", default: 0
    t.integer "correct", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["study_set_id"], name: "index_writing_sessions_on_study_set_id"
    t.index ["user_id"], name: "index_writing_sessions_on_user_id"
  end

  add_foreign_key "mondais", "study_sets"
  add_foreign_key "study_sets", "users"
  add_foreign_key "writing_sessions", "study_sets"
  add_foreign_key "writing_sessions", "users"
end
