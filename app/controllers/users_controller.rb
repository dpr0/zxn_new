# frozen_string_literal: true

class UsersController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    head(:ok)
  end

  def show; end
end
