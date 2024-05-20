class Api::V1::SpecialModesController < ApplicationController
  before_action :authenticate_request

  def participate
    if @current_user.special_mode_unlocked
      @current_user.update(special_mode_unlocked: false)
      render json: { message: '魔王戦を再びロックします' }, status: :ok
    else
      render json: { error: '魔王戦はすでにロックされています' }, status: :unprocessable_entity
    end
  end
end