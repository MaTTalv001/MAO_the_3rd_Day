class Api::V1::BossesController < ApplicationController
  before_action :set_boss, only: [:show]
  skip_before_action :authenticate_request, only: [:show]

  def index

  end

  def show
    render json: @boss
  end

  private

  def set_boss
    @boss = Boss.find(params[:id])
  end
end