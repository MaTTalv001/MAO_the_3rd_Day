module Api
  module V1
    class EnemiesController < ApplicationController
      skip_before_action :authenticate_request, only: [:random, :index]
      def random
        enemy = Enemy.order("RAND()").first
        render json: enemy
      end

      def index
        enemies = Enemy.all
        Rails.logger.info(enemies)
        render json: enemies
      end
    end
  end
end

