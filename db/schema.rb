# frozen_string_literal: true

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

ActiveRecord::Schema[7.0].define(version: 20_230_317_200_000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension 'plpgsql'

  create_table 'authorizations', force: :cascade do |t|
    t.datetime 'created_at', null: false
    t.string 'provider'
    t.string 'uid'
    t.datetime 'updated_at', null: false
    t.bigint 'user_id'
    t.index %w[provider uid], name: 'index_authorizations_on_provider_and_uid'
    t.index ['user_id'], name: 'index_authorizations_on_user_id'
  end

  create_table 'capabilities', force: :cascade do |t|
    t.string 'capability_type'
    t.datetime 'created_at', null: false
    t.integer 'device_id'
    t.boolean 'enabled'
    t.string 'path'
    t.integer 'pin'
    t.boolean 'retrievable'
    t.string 'state'
    t.string 'state_instance'
    t.integer 'state_value'
    t.boolean 'status'
    t.datetime 'updated_at', null: false
  end

  create_table 'device_types', force: :cascade do |t|
    t.string 'code'
    t.string 'name'
  end

  create_table 'devices', force: :cascade do |t|
    t.datetime 'created_at', null: false
    t.string 'description'
    t.string 'device_type'
    t.boolean 'enabled'
    t.string 'host'
    t.string 'hw_version'
    t.string 'manufacturer'
    t.string 'model'
    t.string 'name'
    t.integer 'port'
    t.integer 'protocol_id'
    t.string 'room'
    t.string 'sw_version'
    t.datetime 'updated_at', null: false
    t.integer 'user_id'
  end

  create_table 'oauth_access_grants', force: :cascade do |t|
    t.bigint 'application_id', null: false
    t.datetime 'created_at', precision: nil, null: false
    t.integer 'expires_in', null: false
    t.text 'redirect_uri', null: false
    t.bigint 'resource_owner_id', null: false
    t.datetime 'revoked_at', precision: nil
    t.string 'scopes', default: '', null: false
    t.string 'token', null: false
    t.index ['application_id'], name: 'index_oauth_access_grants_on_application_id'
    t.index ['resource_owner_id'], name: 'index_oauth_access_grants_on_resource_owner_id'
    t.index ['token'], name: 'index_oauth_access_grants_on_token', unique: true
  end

  create_table 'oauth_access_tokens', force: :cascade do |t|
    t.bigint 'application_id', null: false
    t.datetime 'created_at', precision: nil, null: false
    t.integer 'expires_in'
    t.string 'previous_refresh_token', default: '', null: false
    t.string 'refresh_token'
    t.bigint 'resource_owner_id'
    t.datetime 'revoked_at', precision: nil
    t.string 'scopes'
    t.string 'token', null: false
    t.index ['application_id'], name: 'index_oauth_access_tokens_on_application_id'
    t.index ['refresh_token'], name: 'index_oauth_access_tokens_on_refresh_token', unique: true
    t.index ['resource_owner_id'], name: 'index_oauth_access_tokens_on_resource_owner_id'
    t.index ['token'], name: 'index_oauth_access_tokens_on_token', unique: true
  end

  create_table 'oauth_applications', force: :cascade do |t|
    t.boolean 'confidential', default: true, null: false
    t.datetime 'created_at', null: false
    t.string 'name', null: false
    t.text 'redirect_uri', null: false
    t.string 'scopes', default: '', null: false
    t.string 'secret', null: false
    t.string 'uid', null: false
    t.datetime 'updated_at', null: false
    t.index ['uid'], name: 'index_oauth_applications_on_uid', unique: true
  end

  create_table 'properties', force: :cascade do |t|
    t.datetime 'created_at', null: false
    t.integer 'device_id'
    t.boolean 'enabled'
    t.string 'parameters_events'
    t.string 'parameters_instance'
    t.string 'parameters_unit'
    t.string 'parameters_value'
    t.string 'property_type'
    t.boolean 'reportable'
    t.boolean 'retrievable'
    t.datetime 'updated_at', null: false
  end

  create_table 'props', force: :cascade do |t|
    t.datetime 'created_at', null: false
    t.integer 'device_id'
    t.boolean 'enabled'
    t.string 'parameters_instance'
    t.string 'parameters_unit'
    t.string 'prop_type'
    t.boolean 'reportable'
    t.boolean 'retrievable'
    t.string 'state_instance'
    t.integer 'state_value'
    t.datetime 'updated_at', null: false
  end

  create_table 'protocols', force: :cascade do |t|
    t.string 'code'
    t.datetime 'created_at', null: false
    t.string 'name'
    t.datetime 'updated_at', null: false
  end

  create_table 'users', force: :cascade do |t|
    t.boolean 'admin'
    t.datetime 'created_at', null: false
    t.datetime 'current_sign_in_at', precision: nil
    t.inet 'current_sign_in_ip'
    t.string 'email'
    t.string 'encrypted_password', default: '', null: false
    t.datetime 'last_sign_in_at', precision: nil
    t.inet 'last_sign_in_ip'
    t.string 'name'
    t.string 'phone'
    t.string 'provider'
    t.datetime 'remember_created_at', precision: nil
    t.datetime 'reset_password_sent_at', precision: nil
    t.string 'reset_password_token'
    t.integer 'sign_in_count', default: 0, null: false
    t.string 'token'
    t.string 'uid'
    t.datetime 'updated_at', null: false
  end

  add_foreign_key 'authorizations', 'users'
  add_foreign_key 'oauth_access_grants', 'oauth_applications', column: 'application_id'
  add_foreign_key 'oauth_access_tokens', 'oauth_applications', column: 'application_id'
end
