class Api::V1::SpecialModesController < ApplicationController
  before_action :authenticate_request

  def participate
    if @current_user.special_mode_unlocked
      @current_user.update(special_mode_unlocked: false)
      render json: { message: '魔王戦に挑みます' }, status: :ok
    else
      render json: { error: '魔王戦に挑むことができませんでした' }, status: :unprocessable_entity
    end
  end
end